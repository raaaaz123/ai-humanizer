"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { theme } from "@/lib/theme";

export default function TermsOfServicePage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Terms of Service</h1>
      
      <div className="prose prose-blue max-w-none">
        <p className="text-lg mb-8">
          Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
          <p>
            By accessing or using Raw Writer ("the Service"), you agree to be bound by these Terms of Service. 
            If you do not agree to these terms, please do not use the Service.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Description of Service</h2>
          <p>
          Raw Writer provides a platform that uses artificial intelligence to transform AI-generated content into 
            natural, human-like text. The Service is provided on an "as is" and "as available" basis.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. User Accounts</h2>
          <p className="mb-4">
            To access certain features of the Service, you must create an account. When creating an account, you agree to provide 
            accurate, current, and complete information. You are responsible for maintaining the confidentiality of your account 
            credentials and for all activities that occur under your account.
          </p>
          <p>
            We reserve the right to suspend or terminate your account if any information provided is inaccurate, false, or violates 
            these Terms.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Subscription and Payment</h2>
          <p className="mb-4">
            Some features of the Service require a paid subscription. Subscription fees are charged in advance and are non-refundable. 
            You may cancel your subscription at any time, but no refunds will be provided for any unused portion of your subscription.
          </p>
          <p>
            We reserve the right to change our subscription fees at any time. Any price changes will be communicated to you in advance.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Acceptable Use</h2>
          <p className="mb-4">You agree not to use the Service to:</p>
          <ul className="list-disc pl-6 mb-4">
            <li className="mb-2">Violate any applicable laws or regulations</li>
            <li className="mb-2">Infringe upon the rights of others</li>
            <li className="mb-2">Submit content that is illegal, harmful, threatening, abusive, defamatory, or otherwise objectionable</li>
            <li className="mb-2">Attempt to gain unauthorized access to any portion of the Service</li>
            <li className="mb-2">Interfere with or disrupt the Service</li>
            <li className="mb-2">Generate academic content for the purpose of plagiarism or cheating</li>
            <li className="mb-2">Generate content that impersonates individuals or entities without authorization</li>
          </ul>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Intellectual Property</h2>
          <p className="mb-4">
            All content and materials available through the Service, including but not limited to text, graphics, logos, 
            icons, images, audio clips, and software, are the property of Raw Writer or its licensors and are protected 
            by copyright, trademark, and other intellectual property laws.
          </p>
          <p>
            You retain all rights to the content you submit to the Service. By submitting content, you grant us a non-exclusive, 
            worldwide, royalty-free license to use, store, and process your content solely for the purpose of providing the Service to you.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, Raw Writer shall not be liable for any indirect, incidental, special, 
            consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other 
            intangible losses, resulting from your access to or use of or inability to access or use the Service.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">8. Disclaimer of Warranties</h2>
          <p>
            The Service is provided "as is" and "as available" without warranties of any kind, either express or implied, 
            including, but not limited to, implied warranties of merchantability, fitness for a particular purpose, or non-infringement.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">9. Changes to Terms</h2>
          <p>
            We reserve the right to modify these Terms at any time. We will provide notice of any material changes by posting 
            the updated Terms on this page. Your continued use of the Service after such modifications constitutes your acceptance 
            of the revised Terms.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">10. Governing Law</h2>
          <p>
            These Terms shall be governed by and construed in accordance with the laws of [Jurisdiction], without regard to its 
            conflict of law provisions.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">11. Contact Us</h2>
          <p>
            If you have any questions about these Terms, please contact us at:
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