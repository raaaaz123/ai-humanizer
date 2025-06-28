"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/AuthContext";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import posthog from "posthog-js";

interface HistoryItem {
  id: string;
  inputText: string;
  outputText: string;
  wordCount: number;
  fleschScore: number;
  createdAt: Date;
}

export default function HistoryClient() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/auth?redirect=%2Fhistory');
      return;
    }

    const fetchHistory = async () => {
      try {
        const historyRef = collection(db, "users", user.uid, "history");
        const q = query(historyRef, orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        
        const items = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt.toDate()
        })) as HistoryItem[];
        
        setHistory(items);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching history:", error);
        setLoading(false);
      }
    };

    fetchHistory();
  }, [user, router]);

  const handleItemClick = (item: HistoryItem) => {
    setSelectedItem(item.id);
    
    localStorage.setItem('selectedHistoryItem', JSON.stringify({
      inputText: item.inputText,
      outputText: item.outputText
    }));
    
    posthog.capture("history_item_selected", {
      itemId: item.id,
      wordCount: item.wordCount
    });
    
    setTimeout(() => {
      router.push('/');
    }, 300);
  };

  const filteredHistory = history.filter(item => 
    item.inputText.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.outputText.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-b from-[#f0f7ff] to-white">
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-blue-500 border-opacity-20 rounded-full"></div>
          </div>
          <p className="mt-4 text-blue-600 font-medium">Loading your history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] bg-gradient-to-b from-[#f0f7ff] to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-500">
            Your Humanization History
          </h1>
          <p className="text-gray-600 max-w-3xl mx-auto text-base md:text-lg">
            View and restore your previous humanized texts. Click any entry to load it into the editor.
          </p>
        </div>

        {history.length > 0 && (
          <div className="mb-6 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search your history..."
              className="pl-10 pr-4 py-3 w-full rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white/80 backdrop-blur-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        )}

        {history.length === 0 ? (
          <Card className="p-8 md:p-12 text-center bg-white rounded-2xl shadow-lg border border-blue-100">
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 md:w-24 md:h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                <svg className="w-10 h-10 md:w-12 md:h-12 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-xl md:text-2xl font-bold mb-2 text-gray-800">No History Found</h2>
              <p className="text-gray-600 mb-6 md:mb-8 max-w-md">
                You have not humanized any text yet. Start by creating your first humanized text!
              </p>
              <Button 
                onClick={() => router.push('/')}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-3 md:px-8 md:py-4 text-base md:text-lg font-medium md:font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <svg className="w-5 h-5 md:w-6 md:h-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Humanize Your First Text
              </Button>
            </div>
          </Card>
        ) : filteredHistory.length === 0 ? (
          <Card className="p-8 text-center bg-white rounded-2xl shadow-lg border border-blue-100">
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                <svg className="w-10 h-10 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 21h7a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v11m0 5l4.879-4.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold mb-2 text-gray-800">No Results Found</h2>
              <p className="text-gray-600 mb-6 max-w-md">
                No history items match your search. Try a different search term.
              </p>
              <Button 
                onClick={() => setSearchTerm("")}
                variant="outline"
                className="px-6 py-2 text-blue-600 border-blue-200"
              >
                Clear Search
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid gap-4 sm:gap-6">
            {filteredHistory.map((item) => (
              <Card 
                key={item.id}
                className={cn(
                  "p-4 sm:p-6 bg-white rounded-xl border transition-all duration-300 hover:shadow-md",
                  selectedItem === item.id 
                    ? "border-blue-500 ring-2 ring-blue-200 shadow-md transform scale-[1.01]" 
                    : "border-gray-200 hover:border-blue-300"
                )}
                onClick={() => handleItemClick(item)}
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-gray-500 text-xs sm:text-sm">
                        {new Date(item.createdAt).toLocaleDateString()} at {new Date(item.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </span>
                    </div>
                    <div className="text-gray-700 font-medium mb-2 line-clamp-2 text-sm sm:text-base">{item.inputText}</div>
                    <div className="text-gray-500 text-xs sm:text-sm line-clamp-2">{item.outputText}</div>
                  </div>
                  <div className="flex flex-row sm:flex-col items-center sm:items-end gap-4 sm:gap-1 text-xs sm:text-sm text-gray-500">
                    <div className="px-2 py-1 bg-blue-50 rounded-full text-blue-700 font-medium">
                      {item.wordCount} words
                    </div>
                    <div className="flex items-center">
                      <span className="mr-1">Flesch:</span>
                      <span className={cn(
                        "font-medium",
                        item.fleschScore > 60 ? "text-green-600" : 
                        item.fleschScore > 30 ? "text-yellow-600" : "text-red-600"
                      )}>
                        {item.fleschScore.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-gray-100 flex justify-end">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-xs sm:text-sm border-blue-100 text-blue-600 hover:bg-blue-50"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleItemClick(item);
                    }}
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Restore
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 