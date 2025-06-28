"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { theme } from "@/lib/theme";

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Privacy Policy</h1>
      
      <div className="prose prose-blue max-w-none">
        <p className="text-lg mb-8">
          Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
          <p>
          Raw Writer ("we," "our," or "us") respects your privacy and is committed to protecting your personal data. 
            This privacy policy explains how we collect, use, disclose, and safeguard your information when you use our service.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
          <p className="mb-4">We may collect the following types of information:</p>
          <ul className="list-disc pl-6 mb-4">
            <li className="mb-2">
              <strong>Personal Information:</strong> Name, email address, and other contact details you provide when creating an account.
            </li>
            <li className="mb-2">
              <strong>Usage Data:</strong> Information about how you use our service, including text inputs, outputs, and features accessed.
            </li>
            <li className="mb-2">
              <strong>Payment Information:</strong> When you purchase a subscription, our payment processor collects necessary billing information.
            </li>
            <li className="mb-2">
              <strong>Device Information:</strong> Data about your device, IP address, browser type, and operating system.
            </li>
          </ul>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">How We Use Your Information</h2>
          <p className="mb-4">We use the information we collect to:</p>
          <ul className="list-disc pl-6 mb-4">
            <li className="mb-2">Provide, maintain, and improve our services</li>
            <li className="mb-2">Process transactions and manage your account</li>
            <li className="mb-2">Send you technical notices, updates, and support messages</li>
            <li className="mb-2">Respond to your comments and questions</li>
            <li className="mb-2">Monitor and analyze trends, usage, and activities</li>
            <li className="mb-2">Detect, investigate, and prevent fraudulent transactions and unauthorized access</li>
          </ul>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Data Retention</h2>
          <p>
            We store your text inputs only for the duration necessary to process and generate humanized outputs. 
            Once processing is complete, we do not retain your input or output text unless explicitly requested 
            for troubleshooting purposes. Account information is retained as long as you maintain an active account with us.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Cookies and Tracking Technologies</h2>
          <p className="mb-4">
            We use cookies and similar tracking technologies to track activity on our service and hold certain information. 
            Cookies are files with a small amount of data that may include an anonymous unique identifier.
          </p>
          <p>
            You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. 
            However, if you do not accept cookies, you may not be able to use some portions of our service.
            For more information about cookies, please visit our <Link href="/cookies" className={`text-[${theme.colors.primary}] hover:underline`}>Cookie Policy</Link>.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Your Rights</h2>
          <p className="mb-4">Depending on your location, you may have certain rights regarding your personal information, including:</p>
          <ul className="list-disc pl-6 mb-4">
            <li className="mb-2">Access to your personal data</li>
            <li className="mb-2">Correction of inaccurate or incomplete data</li>
            <li className="mb-2">Deletion of your personal data</li>
            <li className="mb-2">Restriction or objection to processing</li>
            <li className="mb-2">Data portability</li>
          </ul>
          <p>
            To exercise these rights, please contact us using the information provided below.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Changes to This Privacy Policy</h2>
          <p>
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new 
            Privacy Policy on this page and updating the "Last updated" date at the top of this policy.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at:
          </p>
          <p className="mt-2">
            <strong>Email:</strong> rexatechin@gmail.com
          </p>
        </section>
      </div>
      
      <div className="mt-12 text-center">
        <Button asChild>
          <Link href="/">Return to Home</Link>
        </Button>
      </div>
    </div>
  );
} 