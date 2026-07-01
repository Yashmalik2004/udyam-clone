import React from 'react';
import { Link } from 'react-router-dom';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* ── Government Top Banner ── */}
      <div className="bg-gray-100 py-1 text-[10px] text-gray-600 border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="inline-block w-3 h-2 bg-orange-500"></span>
            <span className="inline-block w-3 h-2 bg-white border border-gray-300"></span>
            <span className="inline-block w-3 h-2 bg-green-600"></span>
            <span>GOVERNMENT OF INDIA / भारत सरकार</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="#main" className="hover:underline">Skip to main content</a>
            <span>|</span>
            <span>A+</span>
            <span>A</span>
            <span>A-</span>
            <span>|</span>
            <span>English / हिंदी</span>
          </div>
        </div>
      </div>

      {/* ── Main Government Portal Header ── */}
      <header className="gov-header">
        <div className="gov-header__inner">
          <div className="gov-header__brand">
            {/* Inline SVG representing the Ashoka Emblem / Government Crest */}
            <svg
              className="w-12 h-12 text-white fill-current"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 1.62-.51 3.12-1.37 4.39z" />
            </svg>
            <div className="gov-header__titles">
              <span className="gov-header__ministry">
                Ministry of Micro, Small & Medium Enterprises
              </span>
              <h1 className="gov-header__portal-name">
                Udyam Registration Portal <span>(MOCK CLONE)</span>
              </h1>
            </div>
          </div>
          <nav className="hidden md:flex gap-6 text-sm font-semibold">
            <Link to="/" className="hover:text-orange-400 transition-colors">Home</Link>
            <a href="https://udyamregistration.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-orange-400 transition-colors">Official Site</a>
            <span className="text-gray-400">|</span>
            <span className="text-orange-400">Step 1 & 2 Verification</span>
          </nav>
        </div>
      </header>

      {/* ── Subheader / Navigation breadcrumb ── */}
      <div className="page-subheader">
        <div className="page-subheader__inner">
          <Link to="/" className="hover:underline">Home</Link>
          <span>/</span>
          <span>Udyam Registration Flow</span>
        </div>
      </div>

      {/* ── Main Application Content ── */}
      <main id="main" className="main-content flex-grow">
        {children}
      </main>

      {/* ── Government Footer ── */}
      <footer className="gov-footer">
        <div className="gov-footer__inner">
          <div>
            <p className="font-bold text-white mb-1">
              Ministry of Micro, Small & Medium Enterprises (MSME)
            </p>
            <p className="text-xs">
              Udyam Registration Portal Clone for Simulated Workflows.
            </p>
          </div>
          <div className="flex gap-6 text-xs mt-2 md:mt-0">
            <a href="#privacy">Privacy Policy</a>
            <a href="#terms">Terms & Conditions</a>
            <a href="#help">Help Desk / Support</a>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-6 mt-4 pt-4 border-t border-blue-900 text-center text-xs opacity-60">
          © {new Date().getFullYear()} Ministry of MSME, Government of India. Recreated for evaluation purposes.
        </div>
      </footer>
    </div>
  );
};
