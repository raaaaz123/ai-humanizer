"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { TextArea } from "@/components/ui/textarea";
import { useAuth } from "@/lib/AuthContext";
import { doc, updateDoc, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { theme } from "@/lib/theme";
import { useRouter } from "next/navigation";
import posthog from "posthog-js";

export const TextInputSection = () => {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showOutput, setShowOutput] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [error, setError] = useState("");
  const { user, userData, signIn } = useAuth();
  const router = useRouter();

  const MIN_WORDS = 50;
  
  // Get word limit based on subscription plan
  const getWordLimit = () => {
    if (!userData) return 250; // Default free plan limit
    
    // Get the plan name and log it for debugging
    const plan = userData.subscription || 'Free Plan';
    console.log('Current plan:', plan, 'Word balance:', userData.wordBalance);
    
    // Check for plan names - handle different variations
    if (plan === 'Basic' || plan.includes('Basic')) {
      return 500;
    } else if (plan === 'Pro' || plan.includes('Pro')) {
      return 1500;
    } else if (plan === 'Ultra' || plan.includes('Ultra')) {
      return 3000;
    } else {
      return 250; // Free plan
    }
  };
  
  const wordLimit = getWordLimit();

  // Calculate word count when input changes
  useEffect(() => {
    const count = inputText.trim() ? inputText.trim().split(/\s+/).length : 0;
    setWordCount(count);
    
    if (count > 0 && count < MIN_WORDS) {
      setError(`Minimum ${MIN_WORDS} words required (${MIN_WORDS - count} more needed)`);
    } else if (count > wordLimit) {
      setError(`Maximum ${wordLimit} words allowed for your plan (${count - wordLimit} words over limit)`);
    } else {
      setError("");
    }
  }, [inputText, wordLimit, MIN_WORDS]);

  // Ensure we only render interactive elements client-side
  useEffect(() => {
    setIsMounted(true);

    // Check for history item in localStorage
    const historyItem = localStorage.getItem('selectedHistoryItem');
    if (historyItem) {
      const { inputText: savedInput, outputText: savedOutput } = JSON.parse(historyItem);
      setInputText(savedInput);
      setOutputText(savedOutput);
      setShowOutput(true);
      // Clear the history item
      localStorage.removeItem('selectedHistoryItem');
    }
  }, []);

  // Log plan info when userData changes
  useEffect(() => {
    if (userData) {
      console.log('User Plan Info:', {
        plan: userData.subscription || 'Free Plan',
        wordBalance: userData.wordBalance,
        wordLimit: getWordLimit(),
        subscriptionStatus: userData.subscriptionStatus
      });
    }
  }, [userData]);

  // Progress bar animation
  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 95) {
            clearInterval(interval);
            return 95;
          }
          return prev + 5;
        });
      }, 100);
      
      return () => {
        clearInterval(interval);
        if (isLoading) setProgress(0);
      };
    }
  }, [isLoading]);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInputText(text);
      posthog.capture("text_pasted", {
        wordCount: text.trim().split(/\s+/).length,
      });
    } catch (err) {
      console.error("Failed to read clipboard: ", err);
    }
  };

  const handleClear = () => {
    setInputText("");
    setOutputText("");
    setShowOutput(false);
    setError("");
    posthog.capture("text_cleared");
  };

  const handleHumanize = async () => {
    if (!user) {
      signIn();
      posthog.capture("sign_in_prompt", { trigger: "humanize_button" });
      return;
    }

    if (!inputText.trim()) {
      setError("Please enter some text to humanize");
      return;
    }
    
    if (wordCount < MIN_WORDS) {
      setError(`Minimum ${MIN_WORDS} words required (${MIN_WORDS - wordCount} more needed)`);
      return;
    }
    
    if (wordCount > wordLimit) {
      setError(`Maximum ${wordLimit} words allowed for your plan (${wordCount - wordLimit} words over limit)`);
      return;
    }
    
    if (!userData || userData.wordBalance <= 0) {
      setError("You don't have enough word balance. Please upgrade your plan.");
      posthog.capture("insufficient_balance", { 
        wordCount: wordCount,
        userBalance: userData?.wordBalance || 0 
      });
      return;
    }
    
    if (wordCount > userData.wordBalance) {
      setError(`You don't have enough word balance. Your text has ${wordCount} words but you only have ${userData.wordBalance} words left.`);
      posthog.capture("insufficient_balance", { 
        wordCount: wordCount,
        userBalance: userData?.wordBalance || 0 
      });
      return;
    }

    setError("");
    setIsLoading(true);
    setProgress(0);
    setOutputText("Processing your text...");
    setShowOutput(true);
    
    try {
      const startTime = Date.now();
      
      // Call the humanizer API
      const response = await fetch(process.env.NEXT_PUBLIC_HUMANIZER_API_URL!, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_HUMANIZER_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: inputText,
          model: "undetectable",
          words: true,
          costs: true
        })
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} - ${await response.text()}`);
      }

      const data = await response.json();
      const processingTime = Date.now() - startTime;
      
      // Log the complete API response
      console.log('Humanizer API Response:', {
        status: response.status,
        processingTime: `${processingTime}ms`,
        wordCount: wordCount,
        plan: userData?.subscription || 'Free Plan',
        wordLimit: wordLimit,
        fleschScore: data.new_flesch_score,
        inputLength: inputText.length,
        outputLength: data.output?.length || 0,
        completeResponse: data
      });
      
      // Update output and progress
      setOutputText(data.output);
      setProgress(100);
      
      // Save to history in Firestore
      if (user) {
        const historyRef = collection(db, "users", user.uid, "history");
        await addDoc(historyRef, {
          inputText,
          outputText: data.output,
          wordCount,
          fleschScore: data.new_flesch_score,
          createdAt: serverTimestamp()
        });
      }
      
      // Update word balance in Firestore and local state
      if (user && userData) {
        const newBalance = Math.max(0, userData.wordBalance - wordCount);
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, {
          wordBalance: newBalance
        });
        
        // Update local userData state to reflect new balance immediately
        userData.wordBalance = newBalance;
      }
      
      setIsLoading(false);
      
      // Track successful humanization
      posthog.capture("text_humanized", {
        wordCount: wordCount,
        processingTime,
        fleschScore: data.new_flesch_score,
        remainingBalance: userData ? Math.max(0, userData.wordBalance - wordCount) : 0
      });
    } catch (error: any) {
      console.error("Error humanizing text:", error);
      setIsLoading(false);
      setError("Failed to humanize text. Please try again.");
      setOutputText("");
      
      // Track error
      posthog.capture("humanization_error", {
        wordCount: wordCount,
        error: error.toString()
      });
    }
  };

  const handleCopy = async () => {
    if (!outputText) return;
    
    try {
      await navigator.clipboard.writeText(outputText);
      alert("Copied to clipboard!");
      posthog.capture("output_copied", {
        wordCount: outputText.trim().split(/\s+/).length
      });
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  const getWordCountColor = () => {
    if (wordCount === 0) return "text-gray-400";
    if (wordCount < MIN_WORDS) return `text-[${theme.colors.error}]`;
    if (wordCount > wordLimit) return `text-[${theme.colors.error}]`;
    if (userData && userData.wordBalance && wordCount > userData.wordBalance) return `text-[${theme.colors.error}]`;
    return `text-[${theme.colors.primary}]`;
  };

  // CSS for the glowing button
  const glowAnimation = `
    @keyframes glow {
      0% {
        box-shadow: 0 0 5px rgba(59, 130, 246, 0.5), 0 0 10px rgba(59, 130, 246, 0.3);
      }
      50% {
        box-shadow: 0 0 10px rgba(59, 130, 246, 0.8), 0 0 20px rgba(59, 130, 246, 0.5);
      }
      100% {
        box-shadow: 0 0 5px rgba(59, 130, 246, 0.5), 0 0 10px rgba(59, 130, 246, 0.3);
      }
    }
    .glow-button {
      animation: glow 2s infinite;
    }
  `;

  return (
    <section className="py-16 px-4 bg-gray-50 min-h-screen">
      <style jsx>{glowAnimation}</style>
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
            Transform AI Text to Human
          </h2>
          <p className={`text-[${theme.colors.textLight}] max-w-3xl mx-auto text-lg md:text-xl leading-relaxed`}>
            Paste your AI-generated content and our advanced AI will transform it into natural, human-like text that connects with your audience.
          </p>
          <Button
            variant="primary"
            size="lg"
            className="mt-10 px-10 py-6 text-lg font-medium rounded-xl glow-button transform hover:scale-105 transition-all duration-300 shadow-lg"
            onClick={() => router.push('/pricing')}
          >
            Get more words
          </Button>
        </div>

        {/* Input Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8 transition-all duration-300 hover:shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <div className="w-2 h-6 bg-blue-500 rounded-full mr-3"></div>
              <label className="text-lg font-semibold text-gray-800">Input Text</label>
            </div>
            {isMounted && inputText && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleClear}
                className="text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                Clear
              </Button>
            )}
          </div>
          
          <div className="relative">
            {/* Empty state with centered paste button */}
            {!inputText && isMounted && (
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={handlePaste}
                  className="flex items-center gap-3 bg-white/95 backdrop-blur-sm hover:bg-white shadow-md border-2 border-dashed border-gray-300 hover:border-blue-400 transition-all duration-300 px-8 py-4 rounded-xl"
                >
                  <svg className="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <span className="font-medium">Paste AI-generated text</span>
                </Button>
              </div>
            )}
            
            <TextArea 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Paste your AI-generated text here... (${MIN_WORDS}-${wordLimit} words)`}
              className={cn(
                "min-h-[380px] md:min-h-[420px] p-6 text-base resize-none",
                "bg-gray-50/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                "border border-gray-200 shadow-inner rounded-xl transition-all duration-300",
                "placeholder:text-gray-400 leading-relaxed"
              )}
            />
            <div className={cn(
              "absolute bottom-4 right-4 px-3 py-2 rounded-lg font-mono text-sm backdrop-blur-sm",
              "bg-white/90 border border-gray-200 shadow-sm",
              getWordCountColor()
            )}>
              {wordCount} / {wordLimit} words
              {wordCount > 0 && wordCount < MIN_WORDS && ` (${MIN_WORDS - wordCount} more needed)`}
              {wordCount > wordLimit && ` (${wordCount - wordLimit} over limit)`}
            </div>
          </div>
          
          {error && (
            <div className={`text-[${theme.colors.error}] text-sm mt-4 mb-2 bg-red-50 border border-red-200 rounded-lg p-3`}>
              {error}
            </div>
          )}
          
          <div className="flex justify-between items-center mt-6">
            {user && userData && (
              <div className={`text-sm text-[${theme.colors.textLight}] flex items-center bg-blue-50 px-4 py-2 rounded-lg border border-blue-100`}>
                <svg className={`w-5 h-5 mr-2 text-[${theme.colors.primary}]`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                <span>
                  <span className="text-blue-600 font-medium">{userData.subscription || 'Free Plan'}</span>: 
                  <strong className="text-blue-600 ml-1">{userData.wordBalance.toLocaleString()}</strong> words balance • 
                  <span className="text-blue-600 ml-1">{wordLimit.toLocaleString()}</span> max per request
                </span>
              </div>
            )}
            
            {isMounted && inputText && (
              <Button 
                variant="primary" 
                size="default"
                onClick={handleHumanize}
                disabled={!inputText.trim() || isLoading || wordCount < MIN_WORDS || wordCount > wordLimit || (userData?.wordBalance !== undefined && wordCount > userData.wordBalance)}
                className="px-8 py-3 font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {isLoading ? (
                  <>
                    <span className="mr-3">Humanizing</span>
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                  </>
                ) : (
                  user ? "Humanize Text" : "Sign In to Humanize"
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Processing Status */}
        {isLoading && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="w-2 h-6 bg-blue-500 rounded-full mr-3"></div>
                <h3 className="text-lg font-semibold text-gray-800">Processing your text...</h3>
              </div>
              <span className={`text-sm font-medium text-[${theme.colors.primary}] bg-blue-50 px-3 py-1 rounded-lg`}>{progress}%</span>
            </div>
            <Progress 
              value={progress} 
              className={cn("h-3 bg-gray-100 rounded-full overflow-hidden")}
            />
            <div className={`mt-4 text-sm text-[${theme.colors.textLight}] flex items-center`}>
              <svg className={`animate-spin -ml-1 mr-3 h-5 w-5 text-[${theme.colors.primary}]`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="font-medium">Applying humanization algorithms...</span>
            </div>
          </div>
        )}

        {/* Output Section - Only shown after generation */}
        {showOutput && !isLoading && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 transition-all duration-300 hover:shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center">
                <div className="w-2 h-6 bg-green-500 rounded-full mr-3"></div>
                <label className="text-lg font-semibold text-gray-800">Humanized Text</label>
              </div>
              {isMounted && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleCopy}
                  disabled={!outputText}
                  className="text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy
                </Button>
              )}
            </div>
            
            <div className="relative">
              <TextArea 
                value={outputText}
                readOnly
                className={cn(
                  "min-h-[380px] md:min-h-[420px] p-6 text-base resize-none",
                  "bg-green-50/30 border border-green-200 shadow-inner rounded-xl",
                  "leading-relaxed"
                )}
              />
              <div className={cn(
                "absolute bottom-4 right-4 px-3 py-2 rounded-lg font-mono text-sm",
                "bg-green-100 border border-green-200 text-green-700 shadow-sm"
              )}>
                {outputText ? `${outputText.trim().split(/\s+/).length} words` : "0 words"}
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-6 p-4 bg-green-50 rounded-xl border border-green-200">
              <div className="flex items-center">
                <div className={`w-6 h-6 rounded-full bg-[${theme.colors.success}] flex items-center justify-center mr-3`}>
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className={`text-sm text-[${theme.colors.success}] font-semibold`}>Successfully humanized</span>
              </div>
              
              <div className="flex items-center gap-3">
                <div className={`text-sm text-[${theme.colors.textLight}] bg-white px-3 py-1 rounded-lg border border-gray-200`}>
                  <span className="font-medium">AI Detection:</span> <span className="text-green-600 font-semibold">0.1% (Undetectable)</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};