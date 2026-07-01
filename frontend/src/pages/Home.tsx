import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export const Home: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto animate-fade-in-up">
      {/* Warning/Disclaimer Notice */}
      <div className="notice-banner">
        <span className="notice-banner__icon">⚠️</span>
        <div className="notice-banner__text">
          <strong>Important Notice:</strong> This is a simulated prototype/clone of the first two steps of the Government of India Udyam Registration Portal. Do <strong>not</strong> enter actual sensitive Aadhaar or PAN card numbers. Fake values matching validation criteria should be used.
        </div>
      </div>

      <div className="card">
        <div className="card__header">
          <h2>Welcome to Udyam Registration Portal</h2>
          <p>Online registration for Micro, Small and Medium Enterprises (MSME)</p>
        </div>
        <div className="card__body space-y-6">
          <div className="prose text-gray-700">
            <h3 className="text-lg font-semibold text-gov-blue mb-2">Registration Process Overview:</h3>
            <p className="mb-4">
              Udyam Registration is a fully online, paperless, and free process based on self-declaration. The portal dynamically renders input fields and validates details based on central registry specifications.
            </p>

            <div className="grid md:grid-cols-2 gap-4 my-6">
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <h4 className="font-bold text-gov-blue mb-1">Step 1: Aadhaar Verification</h4>
                <ul className="list-disc pl-4 text-xs space-y-1 text-gray-600">
                  <li>Enter 12-digit Aadhaar Number</li>
                  <li>Enter name exactly as printed on Aadhaar</li>
                  <li>Generate and verify a 6-digit OTP code</li>
                </ul>
              </div>
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <h4 className="font-bold text-gov-blue mb-1">Step 2: PAN & Organisation Verification</h4>
                <ul className="list-disc pl-4 text-xs space-y-1 text-gray-600">
                  <li>Select Type of Organisation</li>
                  <li>Enter 10-character PAN number</li>
                  <li>Enter name as per PAN & DOB/DOI</li>
                </ul>
              </div>
            </div>

            <div className="alert alert--info mb-6">
              <strong>Extensible Architecture:</strong> The fields are dynamically loaded from an dynamic backend schema endpoint (<code>GET /api/schema</code>) which reads scraped attributes from Puppeteer.
            </div>
          </div>

          <div className="flex justify-center pt-4">
            <Link to="/step-1" className="w-full sm:w-auto">
              <Button size="lg" className="px-12 w-full">
                Begin MSME Registration
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Home;
