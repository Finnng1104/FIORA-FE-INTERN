import { useState } from 'react';
import { UseFormReturn, FieldValues } from 'react-hook-form';
import { toast } from 'sonner';

interface UseInvoiceRequestOptions<T extends FieldValues> {
  form: UseFormReturn<T>;
  endpoint?: string;
}

interface InvoiceRequestResult {
  isSubmitting: boolean;
  isSuccess: boolean;
  handleSubmit: (data: any) => Promise<void>;
}

export function useInvoiceRequest<T extends FieldValues>({
  form,
  endpoint = '/api/invoices/request',
}: UseInvoiceRequestOptions<T>): InvoiceRequestResult {
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (data: T) => {
    try {
      const formattedPhone = data.phone?.replace(/\D/g, '');
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, phone: formattedPhone }),
      });

      const result = await response.json();

      if (!response.ok) {
        // Handle specific errors with appropriate messages
        if (response.status === 404) {
          toast.error(`Order not found`, {
            description: `${result?.message} Please check your order number and try again.`,
          });

          form.setError('orderNo' as any, {
            message: `${result?.message}`,
          });
        } else {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to create invoice request');
        }
      } else {
        setIsSuccess(true);

        if (result.validation) {
          if (result.validation?.status === 'warning') {
            // Show warning toast but still indicate success with form reset
            toast.warning(result.validation?.title || 'Invoice request requires review', {
              description: `Request No: ${result.data?.reqNo}. ${result.validation?.message}`,
            });
          } else {
            toast.success(`Invoice request submitted successfully!`, {
              description: `Request No: ${result.data?.reqNo}.${result.validation?.message}`,
            });
          }
        } else {
          // Fallback to standard success message if no validation info
          toast.success(`Invoice request submitted successfully!`, {
            description: `Request No: ${result.data?.reqNo}. You will receive a confirmation email soon.`,
          });
        }

        form.reset(); // Reset form on success

        // Reset success state after 5 seconds
        setTimeout(() => setIsSuccess(false), 5000);
      }
    } catch (error) {
      console.error('Submission Error:', error);
      toast.error('An unexpected error occurred while submitting the request.');
    }
  };

  return {
    isSubmitting: form.formState.isSubmitting,
    isSuccess,
    handleSubmit,
  };
}
