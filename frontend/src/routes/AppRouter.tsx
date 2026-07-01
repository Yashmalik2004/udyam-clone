import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { Home } from '../pages/Home';
import { StepOne } from '../pages/StepOne';
import { StepTwo } from '../pages/StepTwo';
import { Success } from '../pages/Success';

export const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/step-1" element={<StepOne />} />
          <Route path="/step-2" element={<StepTwo />} />
          <Route path="/success" element={<Success />} />
          {/* Fallback to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
};
