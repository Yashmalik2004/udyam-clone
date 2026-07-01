import React from 'react';

interface StepIndicatorProps {
  currentStep: number | 'success';
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
  const steps = [
    { num: 1, label: 'Aadhaar Verification' },
    { num: 2, label: 'PAN Verification' },
  ];

  return (
    <div className="step-indicator">
      {steps.map((step, index) => {
        const isActive = currentStep === step.num;
        const isCompleted =
          currentStep === 'success' || (typeof currentStep === 'number' && currentStep > step.num);

        return (
          <React.Fragment key={step.num}>
            <div className="step-indicator__step">
              <div
                className={`step-indicator__dot ${
                  isActive ? 'step-indicator__dot--active' : ''
                } ${isCompleted ? 'step-indicator__dot--completed' : ''}`}
              >
                {isCompleted ? (
                  <svg
                    className="w-5 h-5 fill-current"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  step.num
                )}
              </div>
              <span
                className={`step-indicator__label ${
                  isActive ? 'step-indicator__label--active' : ''
                }`}
              >
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`step-indicator__connector ${
                  isCompleted ? 'step-indicator__connector--completed' : ''
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};
