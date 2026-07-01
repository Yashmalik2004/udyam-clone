import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSchema } from '../hooks/useSchema';
import { generateOtp, verifyOtp } from '../services/aadhaar.service';
import { aadhaarSchema } from '../utils/validators';
import type { AadhaarFormValues } from '../utils/validators';
import { StepIndicator } from '../components/ui/StepIndicator';
import { DynamicField } from '../components/form/DynamicField';
import { OtpInput } from '../components/form/OtpInput';
import { Button } from '../components/ui/Button';
import { Spinner } from '../components/ui/Spinner';

export const StepOne: React.FC = () => {
  const navigate = useNavigate();
  const { schema, loading: schemaLoading, error: schemaError } = useSchema();

  // Step state
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [referenceId, setReferenceId] = useState<string>('');
  const [maskedMobile, setMaskedMobile] = useState<string>('');
  
  // API loaders & errors
  const [apiLoading, setApiLoading] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [submittedOtp, setSubmittedOtp] = useState<string>('');

  // Forms
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<AadhaarFormValues>({
    resolver: zodResolver(aadhaarSchema),
    mode: 'onTouched',
  });

  // Extract step 1 fields from schema
  const stepOneFields = schema?.steps.find((s) => s.step === 1)?.fields || [];

  const handleSendOtp = async (data: AadhaarFormValues) => {
    try {
      setApiLoading(true);
      setApiError(null);
      const res = await generateOtp(data.aadhaarNumber, data.aadhaarName);
      setReferenceId(res.referenceId);
      setMaskedMobile(res.maskedMobile);
      if (res.otp) {
        console.log(`[MOCK OTP] ${res.otp}`);
      }
      setOtpSent(true);
    } catch (err: any) {
      setApiError(err.response?.data?.message || err.message || 'Failed to generate OTP');
    } finally {
      setApiLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (submittedOtp.length !== 6) {
      setOtpError('Please enter a valid 6-digit OTP');
      return;
    }

    try {
      setApiLoading(true);
      setOtpError(null);
      const values = getValues();
      const res = await verifyOtp(referenceId, submittedOtp, values.aadhaarName);
      
      // Store verification details in session storage for Step 2
      sessionStorage.setItem('aadhaarToken', res.token);
      sessionStorage.setItem('aadhaarNumber', values.aadhaarNumber);
      sessionStorage.setItem('aadhaarName', values.aadhaarName);

      // Redirect to step 2
      navigate('/step-2');
    } catch (err: any) {
      setOtpError(err.response?.data?.message || err.message || 'OTP verification failed');
    } finally {
      setApiLoading(false);
    }
  };

  if (schemaLoading) {
    return <Spinner size="lg" />;
  }

  if (schemaError || stepOneFields.length === 0) {
    return (
      <div className="alert alert--error max-w-2xl mx-auto">
        <strong>Error:</strong> {schemaError || 'Failed to parse form schema.'}
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto animate-fade-in-up">
      <StepIndicator currentStep={1} />

      <div className="card">
        <div className="card__header">
          <h2>Step 1: Aadhaar Verification & Validation</h2>
          <p>Verify your identity via registered mobile number OTP</p>
        </div>

        <div className="card__body">
          {apiError && (
            <div className="alert alert--error mb-6">
              <strong>Error:</strong> {apiError}
            </div>
          )}

          {!otpSent ? (
            <form onSubmit={handleSubmit(handleSendOtp)} className="space-y-6">
              {stepOneFields.map((field) => (
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
                  onClick={() => navigate('/')}
                  disabled={apiLoading}
                >
                  Back
                </Button>
                <Button type="submit" isLoading={apiLoading}>
                  Validate & Generate OTP
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="alert alert--success">
                <strong>OTP Sent!</strong> A simulated 6-digit OTP has been sent to mobile number ending in {maskedMobile}. Check the browser console for the code.
              </div>

              <div className="bg-gray-50 p-4 border border-gray-200 rounded-lg text-sm text-gray-700 space-y-1">
                <p><strong>Aadhaar Number:</strong> {getValues('aadhaarNumber')}</p>
                <p><strong>Name as per Aadhaar:</strong> {getValues('aadhaarName')}</p>
              </div>

              <OtpInput
                onChange={(otp) => {
                  setSubmittedOtp(otp);
                  setOtpError(null);
                }}
                error={otpError || undefined}
                disabled={apiLoading}
              />

              <div className="pt-4 flex justify-between gap-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setOtpSent(false)}
                  disabled={apiLoading}
                >
                  Edit Aadhaar details
                </Button>
                <Button
                  type="button"
                  onClick={handleVerifyOtp}
                  isLoading={apiLoading}
                  disabled={submittedOtp.length !== 6}
                >
                  Verify OTP & Continue
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default StepOne;
