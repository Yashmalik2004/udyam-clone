import React, { useRef, useState } from 'react';

interface OtpInputProps {
  length?: number;
  onChange: (otp: string) => void;
  error?: string;
  disabled?: boolean;
}

export const OtpInput: React.FC<OtpInputProps> = ({
  length = 6,
  onChange,
  error,
  disabled = false,
}) => {
  const [digits, setDigits] = useState<string[]>(Array(length).fill(''));
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const handleDigitChange = (index: number, val: string) => {
    const numericVal = val.replace(/\D/g, ''); // digit only
    if (!numericVal && val !== '') return;

    const newDigits = [...digits];
    newDigits[index] = numericVal.slice(-1); // take the last entered char
    setDigits(newDigits);

    const fullOtp = newDigits.join('');
    onChange(fullOtp);

    // Auto-focus next input
    if (numericVal && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      // Focus previous input on backspace if current is empty
      const newDigits = [...digits];
      newDigits[index - 1] = '';
      setDigits(newDigits);
      onChange(newDigits.join(''));
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    if (!pasteData) return;

    const newDigits = Array(length).fill('');
    for (let i = 0; i < pasteData.length; i++) {
      newDigits[i] = pasteData[i] || '';
    }
    setDigits(newDigits);
    onChange(newDigits.join(''));

    // Focus last filled or next empty input
    const focusIndex = Math.min(pasteData.length, length - 1);
    inputsRef.current[focusIndex]?.focus();
  };

  return (
    <div className="form-group">
      <label className="form-label">
        Enter 6-Digit OTP <span className="required">*</span>
      </label>
      <div className="otp-container">
        {digits.map((digit, idx) => (
          <input
            key={idx}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleDigitChange(idx, e.target.value)}
            onKeyDown={(e) => handleKeyDown(idx, e)}
            onPaste={handlePaste}
            disabled={disabled}
            ref={(el) => {
              inputsRef.current[idx] = el;
            }}
            className={`otp-digit ${digit ? 'otp-digit--filled' : ''} ${
              error ? 'otp-digit--error' : ''
            }`}
          />
        ))}
      </div>
      {error && (
        <span className="form-error" role="alert">
          <svg
            className="w-4 h-4 fill-current mr-1"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </span>
      )}
    </div>
  );
};
