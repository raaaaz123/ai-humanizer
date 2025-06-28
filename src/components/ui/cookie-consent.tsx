"use client";

import { useState, useEffect, createContext, useContext } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { theme } from "@/lib/theme";
import posthog from "posthog-js";

// Create a context to expose cookie consent functionality
type CookieConsentContextType = {
  showCookieSettings: () => void;
};

const CookieConsentContext = createContext<CookieConsentContextType | null>(null);

export const useCookieConsent = () => {
  const context = useContext(CookieConsentContext);
  if (!context) {
    throw new Error("useCookieConsent must be used within a CookieConsentProvider");
  }
  return context;
};

export const CookieConsentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [showConsent, setShowConsent] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [cookiePreferences, setCookiePreferences] = useState({
    essential: true, // Always required
    performance: false,
    functional: false,
    targeting: false,
  });

  useEffect(() => {
    // Check if user has already made a choice
    const consentGiven = localStorage.getItem("cookieConsent");
    
    if (!consentGiven) {
      // Show banner after a short delay
      const timer = setTimeout(() => {
        setShowConsent(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    } else {
      // Load saved preferences
      try {
        const savedPreferences = JSON.parse(localStorage.getItem("cookiePreferences") || "{}");
        setCookiePreferences(prev => ({
          ...prev,
          ...savedPreferences
        }));
        
        // Apply saved preferences to PostHog
        applyPostHogSettings(savedPreferences);
      } catch (error) {
        console.error("Error parsing cookie preferences:", error);
      }
    }
  }, []);

  // Function to apply PostHog settings based on cookie preferences
  const applyPostHogSettings = (preferences: typeof cookiePreferences) => {
    if (preferences.performance) {
      // Enable PostHog tracking
      posthog.opt_in_capturing();
    } else {
      // Disable PostHog tracking
      posthog.opt_out_capturing();
    }
  };

  const handleAcceptAll = () => {
    const allAccepted = {
      essential: true,
      performance: true,
      functional: true,
      targeting: true,
    };
    
    setCookiePreferences(allAccepted);
    saveConsent(allAccepted);
    setShowConsent(false);
    
    // Track consent given
    posthog.capture("cookie_consent_given", {
      consent_type: "accept_all",
      preferences: allAccepted
    });
  };

  const handleAcceptSelected = () => {
    saveConsent(cookiePreferences);
    setShowConsent(false);
    setShowPreferences(false);
    
    // Track consent given
    posthog.capture("cookie_consent_given", {
      consent_type: "custom_preferences",
      preferences: cookiePreferences
    });
  };

  const handleRejectNonEssential = () => {
    const essentialOnly = {
      essential: true,
      performance: false,
      functional: false,
      targeting: false,
    };
    
    setCookiePreferences(essentialOnly);
    saveConsent(essentialOnly);
    setShowConsent(false);
    
    // Track consent rejected
    posthog.capture("cookie_consent_given", {
      consent_type: "essential_only",
      preferences: essentialOnly
    });
  };

  const saveConsent = (preferences: typeof cookiePreferences) => {
    localStorage.setItem("cookieConsent", "true");
    localStorage.setItem("cookiePreferences", JSON.stringify(preferences));
    
    // Apply PostHog settings based on preferences
    applyPostHogSettings(preferences);
    
    // Here you would typically trigger your analytics/tracking based on preferences
    if (preferences.performance) {
      // Initialize analytics
      console.log("Performance cookies enabled");
    }
    
    if (preferences.functional) {
      // Initialize functional cookies
      console.log("Functional cookies enabled");
    }
    
    if (preferences.targeting) {
      // Initialize targeting/advertising cookies
      console.log("Targeting cookies enabled");
    }
  };

  const handlePreferenceChange = (key: keyof typeof cookiePreferences) => {
    setCookiePreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Function to expose cookie settings to other components
  const showCookieSettings = () => {
    setShowConsent(true);
    setShowPreferences(true);
    
    // Track cookie settings opened
    posthog.capture("cookie_settings_opened");
  };

  return (
    <CookieConsentContext.Provider value={{ showCookieSettings }}>
      {children}
      {showConsent && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white shadow-lg border-t border-gray-200">
          <div className="max-w-7xl mx-auto p-4 md:p-6">
            {!showPreferences ? (
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">We value your privacy</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic. 
                    By clicking "Accept All", you consent to our use of cookies.
                  </p>
                  <div className="text-sm">
                    <Link href="/cookies" className={`text-[${theme.colors.primary}] hover:underline mr-4`}>
                      Cookie Policy
                    </Link>
                    <Link href="/privacy" className={`text-[${theme.colors.primary}] hover:underline`}>
                      Privacy Policy
                    </Link>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowPreferences(true)}
                    className="whitespace-nowrap"
                  >
                    Cookie Settings
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRejectNonEssential}
                    className="whitespace-nowrap"
                  >
                    Reject All
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleAcceptAll}
                    className="whitespace-nowrap"
                  >
                    Accept All
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Cookie Preferences</h3>
                  <button 
                    onClick={() => setShowPreferences(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-start">
                    <div className="flex items-center h-5 mt-1">
                      <input
                        id="essential"
                        type="checkbox"
                        checked={cookiePreferences.essential}
                        disabled={true}
                        className="w-4 h-4 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="essential" className="font-medium">
                        Essential Cookies <span className="text-gray-500">(Required)</span>
                      </label>
                      <p className="text-gray-500">
                        These cookies are necessary for the website to function and cannot be turned off.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex items-center h-5 mt-1">
                      <input
                        id="performance"
                        type="checkbox"
                        checked={cookiePreferences.performance}
                        onChange={() => handlePreferenceChange("performance")}
                        className="w-4 h-4 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="performance" className="font-medium">
                        Performance Cookies
                      </label>
                      <p className="text-gray-500">
                        These cookies allow us to count visits and traffic sources so we can measure and improve site performance.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex items-center h-5 mt-1">
                      <input
                        id="functional"
                        type="checkbox"
                        checked={cookiePreferences.functional}
                        onChange={() => handlePreferenceChange("functional")}
                        className="w-4 h-4 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="functional" className="font-medium">
                        Functional Cookies
                      </label>
                      <p className="text-gray-500">
                        These cookies enable enhanced functionality and personalization.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex items-center h-5 mt-1">
                      <input
                        id="targeting"
                        type="checkbox"
                        checked={cookiePreferences.targeting}
                        onChange={() => handlePreferenceChange("targeting")}
                        className="w-4 h-4 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="targeting" className="font-medium">
                        Targeting Cookies
                      </label>
                      <p className="text-gray-500">
                        These cookies may be set by our advertising partners to build a profile of your interests.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRejectNonEssential}
                  >
                    Essential Only
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleAcceptSelected}
                  >
                    Save Preferences
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </CookieConsentContext.Provider>
  );
};

// Export the component for direct use in layout
export const CookieConsent = CookieConsentProvider; 