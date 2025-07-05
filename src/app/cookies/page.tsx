"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { theme } from "@/lib/theme";

export default function CookiePolicyPage() {
  const lastUpdated = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Cookie Policy</h1>
      
      <div className="prose prose-blue max-w-none">
        <p className="text-lg mb-8">
          Last updated: {lastUpdated}
        </p>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">What Are Cookies</h2>
          <p>
            Cookies are small text files that are stored on your computer or mobile device when you visit a website. 
            They are widely used to make websites work more efficiently and provide information to the website owners.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">How We Use Cookies</h2>
          <p className="mb-4">
            Raw Writer uses cookies for several purposes, including:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li className="mb-2">
              <strong>Essential Cookies:</strong> These cookies are necessary for the website to function properly and cannot be turned off in our systems.
            </li>
            <li className="mb-2">
              <strong>Performance Cookies:</strong> These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site.
            </li>
            <li className="mb-2">
              <strong>Functional Cookies:</strong> These cookies enable the website to provide enhanced functionality and personalization, such as remembering your preferences.
            </li>
            <li className="mb-2">
              <strong>Targeting Cookies:</strong> These cookies may be set through our site by our advertising partners to build a profile of your interests and show you relevant ads.
            </li>
          </ul>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Types of Cookies We Use</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 mt-4">
              <thead>
                <tr>
                  <th className="border border-gray-200 px-4 py-2">Cookie Name</th>
                  <th className="border border-gray-200 px-4 py-2">Purpose</th>
                  <th className="border border-gray-200 px-4 py-2">Duration</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-200 px-4 py-2">session_id</td>
                  <td className="border border-gray-200 px-4 py-2">Maintains your session state</td>
                  <td className="border border-gray-200 px-4 py-2">Session</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 px-4 py-2">auth_token</td>
                  <td className="border border-gray-200 px-4 py-2">Authentication</td>
                  <td className="border border-gray-200 px-4 py-2">30 days</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 px-4 py-2">preferences</td>
                  <td className="border border-gray-200 px-4 py-2">Stores your preferences</td>
                  <td className="border border-gray-200 px-4 py-2">1 year</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 px-4 py-2">_ga</td>
                  <td className="border border-gray-200 px-4 py-2">Google Analytics</td>
                  <td className="border border-gray-200 px-4 py-2">2 years</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 px-4 py-2">_gid</td>
                  <td className="border border-gray-200 px-4 py-2">Google Analytics</td>
                  <td className="border border-gray-200 px-4 py-2">24 hours</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Managing Cookies</h2>
          <p className="mb-4">
            Most web browsers allow you to control cookies through their settings preferences. However, if you limit the ability of websites 
            to set cookies, you may worsen your overall user experience and/or lose access to some functionality.
          </p>
          <p>
            To find out more about cookies, including how to see what cookies have been set and how to manage and delete them, 
            visit <a href="https://www.allaboutcookies.org" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">www.allaboutcookies.org</a>.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Your Choices</h2>
          <p className="mb-4">
            When you first visit our website, you will be presented with a cookie banner that allows you to accept or decline non-essential cookies.
          </p>
          <p>
            You can change your cookie preferences at any time by clicking on the &quot;Cookie Settings&quot; link in the footer of our website.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Third-Party Cookies</h2>
          <p>
            Some cookies are placed by third parties on our website. These third parties may include analytics providers, 
            advertising networks, and social media platforms. We do not control these third-party cookies, and they are subject 
            to the privacy policies of the third parties that provide them.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Changes to This Cookie Policy</h2>
          <p>
            We may update our Cookie Policy from time to time. We will notify you of any changes by posting the new Cookie Policy 
            on this page and updating the &quot;Last updated&quot; date.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
          <p>
            If you have any questions about our use of cookies, please contact us at:
          </p>
          <p className="mt-2">
            <strong>Email:</strong> rexatechin@gmail.com
          </p>
        </section>
      </div>
      
      <div className="mt-12 text-center">
        <Link href="/" className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background h-10 py-2 px-4 bg-[#3b82f6] text-white hover:bg-[#2563eb]">
          Return to Home
        </Link>
      </div>
    </div>
  );
} 