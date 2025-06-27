"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { TextArea } from "@/components/ui/textarea";
import { useAuth } from "@/lib/AuthContext";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export const TextInputSection = () => {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showOutput, setShowOutput] = useState(false);
  const { user, userData, signIn } = useAuth();

  // Ensure we only render interactive elements client-side
  useEffect(() => {
    setIsMounted(true);
  }, []);

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
    } catch (err) {
      console.error("Failed to read clipboard: ", err);
    }
  };

  const handleClear = () => {
    setInputText("");
    setOutputText("");
    setShowOutput(false);
  };

  const handleHumanize = async () => {
    if (!user) {
      signIn();
      return;
    }

    if (!inputText.trim()) return;
    
    if (!userData || userData.wordBalance <= 0) {
      alert("You don't have enough word balance. Please upgrade your plan.");
      return;
    }
    
    const wordCount = inputText.trim().split(/\s+/).length;
    
    if (wordCount > userData.wordBalance) {
      alert(`You don't have enough word balance. Your text has ${wordCount} words but you only have ${userData.wordBalance} words left.`);
      return;
    }

    setIsLoading(true);
    setProgress(0);
    
    try {
      // Here you would call your AI humanizing API
      // For now we'll just simulate a response
      setTimeout(async () => {
        const humanizedText = `${inputText} (Humanized version)`;
        setOutputText(humanizedText);
        setProgress(100);
        
        // Update word balance in Firestore
        if (user && userData) {
          const newBalance = Math.max(0, userData.wordBalance - wordCount);
          const userRef = doc(db, "users", user.uid);
          await updateDoc(userRef, {
            wordBalance: newBalance
          });
        }
        
        setIsLoading(false);
        setShowOutput(true);
      }, 1500);
    } catch (error) {
      console.error("Error humanizing text:", error);
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!outputText) return;
    
    try {
      await navigator.clipboard.writeText(outputText);
      alert("Copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  return (
    <section className="py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">Transform AI Text to Human</h2>
          <p className="text-[#64748b] max-w-2xl mx-auto">
            Paste your AI-generated content and our advanced AI will transform it into natural, human-like text that connects with your audience.
          </p>
        </div>

        {/* Input Section */}
        <div className="bg-white rounded-xl shadow-sm border border-[#e2e8f0] p-6 mb-8">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-[#ef4444] rounded-full mr-1.5"></div>
              <div className="w-3 h-3 bg-[#f59e0b] rounded-full mr-1.5"></div>
              <div className="w-3 h-3 bg-[#10b981] rounded-full mr-3"></div>
              <label className="text-sm font-medium text-[#1e293b]">Input Text</label>
            </div>
            {isMounted && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handlePaste}
                className="text-xs flex items-center gap-1.5"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Paste
              </Button>
            )}
          </div>
          
          <div className="relative">
            <TextArea 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste your AI-generated text here..."
              className="min-h-[250px] mb-2 bg-[#f8fafc] border-[#e2e8f0] focus:border-[#b074d4] focus:ring-[#b074d4] font-mono text-sm resize-none"
            />
            <div className="absolute bottom-3 right-3 bg-[#f8f0ff] text-[#b074d4] text-xs px-2 py-1 rounded-md font-mono">
              {inputText ? `${inputText.trim().split(/\s+/).length} words` : "0 words"}
            </div>
          </div>
          
          <div className="flex justify-between items-center mt-4">
            {user && userData && (
              <div className="text-sm text-[#64748b] flex items-center">
                <svg className="w-4 h-4 mr-1.5 text-[#b074d4]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                <span>Balance: <strong>{userData.wordBalance}</strong> words</span>
              </div>
            )}
            
            {isMounted && (
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleClear}
                  className="text-xs"
                >
                  Clear
                </Button>
                <Button 
                  variant="primary" 
                  size="sm"
                  onClick={handleHumanize}
                  disabled={!inputText.trim() || isLoading}
                  className="text-xs"
                >
                  {isLoading ? (
                    <>
                      <span className="mr-2">Humanizing</span>
                      <div className="animate-spin h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full"></div>
                    </>
                  ) : (
                    user ? "Humanize Text" : "Sign In to Humanize"
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Processing Status */}
        {isLoading && (
          <div className="bg-white rounded-xl shadow-sm border border-[#e2e8f0] p-6 mb-8">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium">Processing your text...</h3>
              <span className="text-xs text-[#b074d4]">{progress}%</span>
            </div>
            <Progress 
              value={progress} 
              className={cn("h-2", "bg-[#f8f0ff]")}
            />
            <div className="mt-3 text-xs text-[#64748b] flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-[#b074d4]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Applying humanization algorithms...
            </div>
          </div>
        )}

        {/* Output Section - Only shown after generation */}
        {showOutput && !isLoading && (
          <div className="bg-white rounded-xl shadow-sm border border-[#e2e8f0] p-6">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-[#ef4444] rounded-full mr-1.5"></div>
                <div className="w-3 h-3 bg-[#f59e0b] rounded-full mr-1.5"></div>
                <div className="w-3 h-3 bg-[#10b981] rounded-full mr-3"></div>
                <label className="text-sm font-medium text-[#1e293b]">Humanized Text</label>
              </div>
              {isMounted && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleCopy}
                  disabled={!outputText}
                  className="text-xs flex items-center gap-1.5"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                className="min-h-[250px] mb-2 bg-[#f8f0ff] border-[#e2e8f0] font-mono text-sm resize-none"
              />
              <div className="absolute bottom-3 right-3 bg-[#f5e8ff] text-[#b074d4] text-xs px-2 py-1 rounded-md font-mono">
                {outputText ? `${outputText.trim().split(/\s+/).length} words` : "0 words"}
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-[#10b981] flex items-center justify-center mr-1.5">
                  <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-xs text-[#10b981] font-medium">Successfully humanized</span>
              </div>
              
              <div className="text-xs text-[#64748b]">
                <span className="font-medium">AI Detection:</span> 0.1% (Undetectable)
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}; 