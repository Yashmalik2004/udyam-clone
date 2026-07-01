import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSchema } from '../hooks/useSchema';
import { validatePan } from '../services/pan.service';
import { submitRegistration } from '../services/schema.service';
import { panSchema } from '../utils/validators';
import type { PanFormValues } from '../utils/validators';
import { StepIndicator } from '../components/ui/StepIndicator';
import { DynamicField } from '../components/form/DynamicField';
import { Button } from '../components/ui/Button';
import { Spinner } from '../components/ui/Spinner';

export const StepTwo: React.FC = () => {
  const navigate = useNavigate();
  const { schema, loading: schemaLoading, error: schemaError } = useSchema();

  // Cached Aadhaar session data
  const [aadhaarToken, setAadhaarToken] = useState<string | null>(null);
  const [aadhaarNumber, setAadhaarNumber] = useState<string | null>(null);
  const [aadhaarName, setAadhaarName] = useState<string | null>(null);

  // Status
  const [apiLoading, setApiLoading] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PanFormValues>({
    resolver: zodResolver(panSchema),
    mode: 'onTouched',
  });

  // Verify Step 1 is done
  useEffect(() => {
    const token = sessionStorage.getItem('aadhaarToken');
    const num = sessionStorage.getItem('aadhaarNumber');
    const name = sessionStorage.getItem('aadhaarName');

    if (!token || !num || !name) {
      navigate('/step-1');
      return;
    }

    setAadhaarToken(token);
    setAadhaarNumber(num);
    setAadhaarName(name);
  }, [navigate]);

  // Extract Step 2 fields from schema
  const stepTwoFields = schema?.steps.find((s) => s.step === 2)?.fields || [];

  const handleContinue = async (data: PanFormValues) => {
    if (!aadhaarToken || !aadhaarNumber || !aadhaarName) {
      setApiError('Aadhaar verification session lost. Please restart.');
      return;
    }

    try {
      setApiLoading(true);
      setApiError(null);

      // 1. Validate PAN details first (POST /api/pan/validate)
      await validatePan({
        panNumber: data.panNumber,
        panHolderName: data.panHolderName,
        dobOrDoi: data.dobOrDoi,
        organisationType: data.organisationType,
        aadhaarToken,
      });

      // 2. Submit the full registration (POST /api/submit)
      const submitRes = await submitRegistration({
        aadhaarNumber,
        aadhaarName,
        otpVerified: true,
        aadhaarToken,
        organisationType: data.organisationType,
        panNumber: data.panNumber,
        panHolderName: data.panHolderName,
        dobOrDoi: data.dobOrDoi,
      });

      // Clear session cache
      sessionStorage.removeItem('aadhaarToken');
      sessionStorage.removeItem('aadhaarNumber');
      sessionStorage.removeItem('aadhaarName');

      // Store URN for success screen
      sessionStorage.setItem('udyamRef', submitRes.data.udyamReferenceNumber);
      sessionStorage.setItem('subId', submitRes.data.id);

      navigate('/success');
    } catch (err: any) {
      setApiError(
        err.response?.data?.message ||
          err.message ||
          'Failed to validate details or submit registration'
      );
    } finally {
      setApiLoading(false);
    }
  };

  if (schemaLoading) {
    return <Spinner size="lg" />;
  }

  if (schemaError || stepTwoFields.length === 0) {
    return (
      <div className="alert alert--error max-w-2xl mx-auto">
        <strong>Error:</strong> {schemaError || 'Failed to parse form schema.'}
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto animate-fade-in-up">
      <StepIndicator currentStep={2} />

      <div className="card">
        <div className="card__header">
          <h2>Step 2: PAN & Organisation Verification</h2>
          <p>Provide enterprise tax registration and legal identity details</p>
        </div>

        <div className="card__body">
          {apiError && (
            <div className="alert alert--error mb-6">
              <strong>Error:</strong> {apiError}
            </div>
          )}

          {/* Display verified Aadhaar context */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex justify-between items-center text-sm text-green-800">
            <div>
              <p><strong>Aadhaar Verified:</strong> {aadhaarName}</p>
              <p className="text-xs opacity-75">Number: ...{aadhaarNumber?.slice(-4)}</p>
            </div>
            <span className="bg-green-600 text-white px-2 py-1 rounded text-xs font-bold uppercase tracking-wider">
              Verified
            </span>
          </div>

          <form onSubmit={handleSubmit(handleContinue)} className="space-y-6">
            {stepTwoFields.map((field) => (
              <DynamicField
                key={field.id}
                field={field}
                register={register}
                errors={errors}
                disabled={apiLoading}
              />
            ))}

            <div className="pt-4 flex justify-between gap-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate('/step-1')}
                disabled={apiLoading}
              >
                Back to Step 1
              </Button>
              <Button type="submit" isLoading={apiLoading}>
                Validate & Submit Registration
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
export default StepTwo;
