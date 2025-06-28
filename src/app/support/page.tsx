"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { cn } from "@/lib/utils";
import { 
  Mail, 
  MessageCircle, 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Send,
  Loader2,
  Phone,
  Globe,
  Users,
  Zap,
  Shield,
  Star
} from "lucide-react";

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

const supportCategories = [
  {
    icon: <Mail className="w-6 h-6" />,
    title: "Email Support",
    description: "Get help via email within 24 hours",
    contact: "support@aihumanizer.com",
    responseTime: "24 hours",
    color: "bg-blue-50 text-blue-600 border-blue-200"
  },
  {
    icon: <MessageCircle className="w-6 h-6" />,
    title: "Live Chat",
    description: "Chat with our support team in real-time",
    contact: "Available 9 AM - 6 PM EST",
    responseTime: "Instant",
    color: "bg-green-50 text-green-600 border-green-200"
  },
  {
    icon: <Phone className="w-6 h-6" />,
    title: "Priority Support",
    description: "Premium support for Pro and Ultra users",
    contact: "Dedicated support line",
    responseTime: "2 hours",
    color: "bg-purple-50 text-purple-600 border-purple-200"
  }
];

const faqData = [
  {
    question: "How do I reset my password?",
    answer: "You can reset your password by clicking on the 'Forgot Password' link on the login page. You'll receive an email with instructions to reset your password within a few minutes."
  },
  {
    question: "How does the word balance system work?",
    answer: "Each subscription plan comes with a monthly word allowance. Words are deducted from your balance when you humanize text. Your balance resets at the beginning of each billing cycle."
  },
  {
    question: "Can I upgrade or downgrade my plan?",
    answer: "Yes, you can change your subscription plan at any time from your account settings. Changes take effect immediately, and you'll be charged or credited the prorated difference."
  },
  {
    question: "Is my data secure and private?",
    answer: "Absolutely. We use enterprise-grade encryption to protect your data. We don't store your text after processing, and all data transmission is secured with SSL encryption."
  },
  {
    question: "What AI detectors does AI Humanizer bypass?",
    answer: "AI Humanizer is designed to bypass all major AI detection tools including GPTZero, Turnitin, Originality.ai, Copyleaks, Writer.com, and many others."
  },
  {
    question: "Do you offer refunds?",
    answer: "We offer a 7-day money-back guarantee for all new subscriptions. If you're not satisfied with our service, contact support within 7 days of purchase for a full refund."
  },
  {
    question: "How accurate is the humanization process?",
    answer: "Our AI maintains over 95% semantic accuracy, ensuring your original meaning is preserved while making the text sound naturally human-written."
  },
  {
    question: "Can I cancel my subscription anytime?",
    answer: "Yes, you can cancel your subscription at any time from your account settings. You'll continue to have access until the end of your current billing period."
  }
];

const subjectOptions = [
  "Account Issues",
  "Billing Questions", 
  "Technical Support",
  "Feature Request",
  "Bug Report",
  "Partnership Inquiry",
  "Other"
];

export default function SupportPage() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [isMounted, setIsMounted] = useState(false);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Please select a subject";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters long";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Add document to Firestore
      await addDoc(collection(db, "support_messages"), {
        name: formData.name.trim(),
        email: formData.email.trim(),
        subject: formData.subject.trim(),
        message: formData.message.trim(),
        timestamp: serverTimestamp(),
        status: "pending"
      });

      setSubmitStatus('success');
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error("Error submitting support message:", error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              How can we help you?
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Our support team is here to assist you with any questions or issues you may have. 
              Get the help you need, when you need it.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30 px-4 py-2">
                <Clock className="w-4 h-4 mr-2" />
                24/7 Support Available
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30 px-4 py-2">
                <Users className="w-4 h-4 mr-2" />
                10,000+ Happy Customers
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        {/* Support Categories */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Support Channel</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Select the best way to get in touch with our support team based on your needs and urgency.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {supportCategories.map((category, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 shadow-lg">
                <CardHeader className="text-center pb-4">
                  <div className={cn(
                    "w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center transition-transform group-hover:scale-110",
                    category.color
                  )}>
                    {category.icon}
                  </div>
                  <CardTitle className="text-xl font-semibold">{category.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600 mb-4">{category.description}</p>
                  <div className="space-y-2">
                    <p className="font-medium text-gray-900">{category.contact}</p>
                    <Badge variant="outline" className="bg-gray-50">
                      Response: {category.responseTime}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <Card className="shadow-xl border-0">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
                <CardTitle className="text-2xl font-bold text-gray-900 flex items-center">
                  <Send className="w-6 h-6 mr-3 text-blue-600" />
                  Send us a Message
                </CardTitle>
                <p className="text-gray-600 mt-2">
                  Fill out the form below and we'll get back to you as soon as possible.
                </p>
              </CardHeader>
              
              <CardContent className="p-8">
                {submitStatus === 'success' && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-green-800">Message sent successfully!</p>
                      <p className="text-green-700 text-sm mt-1">
                        We've received your message and will respond within 24 hours.
                      </p>
                    </div>
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-red-800">Failed to send message</p>
                      <p className="text-red-700 text-sm mt-1">
                        Please try again or contact us directly at support@aihumanizer.com
                      </p>
                    </div>
                  </div>
                )}

                {isMounted && (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                          Name *
                        </label>
                        <input
                          type="text"
                          id="name"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          className={cn(
                            "w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors",
                            errors.name ? "border-red-300 bg-red-50" : "border-gray-300 hover:border-gray-400"
                          )}
                          placeholder="Your full name"
                        />
                        {errors.name && (
                          <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                        )}
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                          Email *
                        </label>
                        <input
                          type="email"
                          id="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className={cn(
                            "w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors",
                            errors.email ? "border-red-300 bg-red-50" : "border-gray-300 hover:border-gray-400"
                          )}
                          placeholder="your.email@example.com"
                        />
                        {errors.email && (
                          <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                        Subject *
                      </label>
                      <select
                        id="subject"
                        value={formData.subject}
                        onChange={(e) => handleInputChange('subject', e.target.value)}
                        className={cn(
                          "w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors",
                          errors.subject ? "border-red-300 bg-red-50" : "border-gray-300 hover:border-gray-400"
                        )}
                      >
                        <option value="">Select a subject</option>
                        {subjectOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                      {errors.subject && (
                        <p className="mt-1 text-sm text-red-600">{errors.subject}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                        Message *
                      </label>
                      <textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => handleInputChange('message', e.target.value)}
                        rows={6}
                        className={cn(
                          "w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors resize-none",
                          errors.message ? "border-red-300 bg-red-50" : "border-gray-300 hover:border-gray-400"
                        )}
                        placeholder="Please describe your issue or question in detail..."
                      />
                      {errors.message && (
                        <p className="mt-1 text-sm text-red-600">{errors.message}</p>
                      )}
                      <p className="mt-2 text-sm text-gray-500">
                        {formData.message.length}/500 characters
                      </p>
                    </div>

                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 px-6 rounded-xl font-medium transition-all duration-200 transform hover:scale-[1.02] disabled:transform-none"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Sending Message...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5 mr-2" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>

          {/* FAQ Section */}
          <div>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <FileText className="w-6 h-6 mr-3 text-blue-600" />
                Frequently Asked Questions
              </h2>
              <p className="text-gray-600">
                Find quick answers to common questions about AI Humanizer.
              </p>
            </div>

            <Accordion type="single" collapsible className="space-y-4">
              {faqData.map((faq, index) => (
                <AccordionItem 
                  key={index} 
                  value={`item-${index}`}
                  className="border border-gray-200 rounded-xl px-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <AccordionTrigger className="text-left font-medium hover:no-underline py-4">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 pb-4 leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
              <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                <Globe className="w-5 h-5 mr-2 text-blue-600" />
                Still need help?
              </h3>
              <p className="text-gray-600 mb-4">
                Can't find what you're looking for? Our support team is always ready to help.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="mailto:support@aihumanizer.com">
                  <Button variant="outline" size="sm" className="hover:bg-blue-50">
                    <Mail className="w-4 h-4 mr-2" />
                    Email Support
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowChat(true)}
                  className="hover:bg-blue-50"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Live Chat
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Support Resources */}
        <div className="mt-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Additional Resources</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore our comprehensive resources to get the most out of AI Humanizer.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow border-0 shadow-md">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl mx-auto mb-4 flex items-center justify-center">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Quick Start Guide</h3>
                <p className="text-gray-600 mb-4">
                  Get up and running with AI Humanizer in just a few minutes.
                </p>
                <Button variant="outline" size="sm">
                  View Guide
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow border-0 shadow-md">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl mx-auto mb-4 flex items-center justify-center">
                  <Shield className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Security & Privacy</h3>
                <p className="text-gray-600 mb-4">
                  Learn about our security measures and privacy policies.
                </p>
                <Link href="/privacy">
                  <Button variant="outline" size="sm">
                    Learn More
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow border-0 shadow-md">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-xl mx-auto mb-4 flex items-center justify-center">
                  <Star className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Best Practices</h3>
                <p className="text-gray-600 mb-4">
                  Tips and tricks to get the best results from AI Humanizer.
                </p>
                <Button variant="outline" size="sm">
                  Read Tips
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Chat Bubble */}
      {isMounted && (
        <div className="fixed bottom-6 right-6 z-50">
          <Button
            onClick={() => setShowChat(!showChat)}
            className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-110"
          >
            <MessageCircle className="w-6 h-6" />
          </Button>
          
          {showChat && (
            <div className="absolute bottom-16 right-0 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 p-6 transform transition-all duration-200 animate-in slide-in-from-bottom-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Live Chat</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowChat(false)}
                  className="w-8 h-8 p-0"
                >
                  ×
                </Button>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Hi! 👋 How can we help you today?
              </p>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start text-left">
                  I need help with my account
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start text-left">
                  I have a billing question
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start text-left">
                  Technical support needed
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </main>
  );
}