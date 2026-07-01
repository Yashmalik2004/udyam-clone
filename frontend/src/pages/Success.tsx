import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export const Success: React.FC = () => {
  const navigate = useNavigate();
  const [urn, setUrn] = useState<string | null>(null);
  const [submissionId, setSubmissionId] = useState<string | null>(null);

  useEffect(() => {
    const cachedUrn = sessionStorage.getItem('udyamRef');
    const cachedId = sessionStorage.getItem('subId');

    if (!cachedUrn) {
      navigate('/');
      return;
    }

    setUrn(cachedUrn);
    setSubmissionId(cachedId);
  }, [navigate]);

  const handleRestart = () => {
    sessionStorage.clear();
    navigate('/');
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-in-up text-center">
      <div className="card">
        <div className="card__body p-12 space-y-6">
          <div className="success-icon">
            <svg
              className="w-12 h-12 text-green-600 fill-current"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          </div>

          <h2 className="text-3xl font-extrabold text-gray-900">
            Registration Submitted!
          </h2>
          <p className="text-gray-600 text-sm max-w-md mx-auto">
            Your MSME registration details have been simulated, verified, and stored in the database. A unique reference number has been generated.
          </p>

          <div className="urn-display">
            <div className="urn-display__label">Udyam Registration Number (URN)</div>
            <div className="urn-display__number">{urn}</div>
          </div>

          {submissionId && (
            <p className="text-xs text-gray-400">
              Database Submission ID: <code className="bg-gray-100 px-1 py-0.5 rounded">{submissionId}</code>
            </p>
          )}

          <div className="pt-6">
            <Button variant="primary" onClick={handleRestart} className="px-8">
              Start New Registration
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Success;
