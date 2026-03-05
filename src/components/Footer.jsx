import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white pt-12 pb-8 dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Company Identity */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <span className="rounded-full bg-gradient-to-r from-sky-500 to-indigo-500 px-2 py-0.5 text-xs font-semibold text-white">B2B</span>
              <span className="text-lg font-bold text-slate-900 dark:text-white">GarTexHub</span>
            </div>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              Trusted B2B Marketplace for Garments & Textile Industry. Connecting International Buyers, Buying Houses, and Verified Factories through structured communication and professional digital workflows.
            </p>
            <div className="mt-6 flex gap-4">
              <a href="#" className="text-slate-400 hover:text-sky-600 transition-colors">LinkedIn</a>
              <a href="#" className="text-slate-400 hover:text-sky-600 transition-colors">Facebook</a>
              <a href="#" className="text-slate-400 hover:text-sky-600 transition-colors">YouTube</a>
            </div>
          </div>

          {/* Quick Links & Account Types */}
          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">Quick Navigation</h3>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li><Link to="/" className="hover:text-sky-600">Home</Link></li>
              <li><Link to="/search" className="hover:text-sky-600">Search</Link></li>
              <li><Link to="/buyer-requests" className="hover:text-sky-600">Buyer Requests</Link></li>
              <li><Link to="/product-management" className="hover:text-sky-600">Company Products</Link></li>
              <li><Link to="/pricing" className="hover:text-sky-600">Subscription Plans</Link></li>
              <li><Link to="/help" className="hover:text-sky-600">Help Center</Link></li>
            </ul>
          </div>

          {/* Verification & Legal */}
          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">Verification & Legal</h3>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li><Link to="/verification" className="hover:text-sky-600">Document Verification</Link></li>
              <li><Link to="/contracts" className="hover:text-sky-600">Digital Contract System</Link></li>
              <li><Link to="/privacy" className="hover:text-sky-600">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-sky-600">Terms & Conditions</Link></li>
              <li><Link to="/privacy" className="hover:text-sky-600">Cookie Policy</Link></li>
            </ul>
          </div>

          {/* Support & Contact */}
          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">Support</h3>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li><span className="font-semibold">Email:</span> support@gartexhub.com</li>
              <li><span className="font-semibold">Business:</span> business@gartexhub.com</li>
              <li className="pt-2 text-xs italic text-slate-500">
                The more verified documentation a company provides, the stronger its international credibility.
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-200 pt-8 dark:border-slate-800">
          <p className="text-center text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            © 2026 GarTexHub. All Rights Reserved. GarTexHub is an independent B2B networking platform.<br />
            The platform does not directly process financial transactions. All recorded communications are subject to consent and compliance regulations.
          </p>
        </div>
      </div>
    </footer>
  );
}
