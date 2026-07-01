import React from 'react';
import { useForm } from 'react-hook-form';
import type { FormFieldSchema } from '../../types/schema.types';
import { DynamicField } from './DynamicField';
import { Button } from '../ui/Button';

interface DynamicFormProps {
  fields: FormFieldSchema[];
  onSubmit: (data: any) => void;
  isLoading?: boolean;
  submitButtonText?: string;
  defaultValues?: Record<string, any>;
}

export const DynamicForm: React.FC<DynamicFormProps> = ({
  fields,
  onSubmit,
  isLoading = false,
  submitButtonText = 'Submit',
  defaultValues = {},
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues,
    mode: 'onTouched',
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {fields.map((field) => (
        <DynamicField
          key={field.id}
          field={field}
          register={register}
          errors={errors}
          disabled={isLoading}
        />
      ))}
      <div className="pt-2">
        <Button type="submit" isLoading={isLoading} fullWidth className="btn--lg">
          {submitButtonText}
        </Button>
      </div>
    </form>
  );
};
