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
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/auth');
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#f0f7ff] to-white">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mb-4"></div>
          <p className="text-blue-600 font-medium">Loading your history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f0f7ff] to-white py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-500">
            Your Humanization History
          </h1>
          <p className="text-gray-600 max-w-3xl mx-auto text-lg">
            View and restore your previous humanized texts. Click any entry to load it into the editor.
          </p>
        </div>

        {history.length === 0 ? (
          <Card className="p-12 text-center bg-white rounded-2xl shadow-lg border border-blue-100">
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                <svg className="w-12 h-12 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-2 text-gray-800">No History Found</h2>
              <p className="text-gray-600 mb-8 max-w-md">
                You have not humanized any text yet. Start by creating your first humanized text!
              </p>
              <Button 
                onClick={() => router.push('/')}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-8 py-6 text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <svg className="w-6 h-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Humanize Your First Text
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid gap-6">
            {history.map((item) => (
              <Card 
                key={item.id}
                className={cn(
                  "p-6 bg-white rounded-xl border border-gray-200 cursor-pointer hover:border-blue-300 transition-all duration-300",
                  selectedItem === item.id ? "border-blue-500 ring-2 ring-blue-200" : ""
                )}
                onClick={() => handleItemClick(item)}
              >
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <div className="flex items-center mb-2">
                      <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-gray-500 text-sm">
                        {new Date(item.createdAt).toLocaleDateString()} at {new Date(item.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="text-gray-700 font-medium mb-2 line-clamp-2">{item.inputText}</div>
                    <div className="text-gray-500 text-sm line-clamp-2">{item.outputText}</div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-sm text-gray-500">{item.wordCount} words</span>
                    <span className="text-sm text-gray-500">Flesch score: {item.fleschScore.toFixed(1)}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 