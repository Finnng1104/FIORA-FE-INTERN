'use client';

import type React from 'react';
import { useState, useEffect } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from '@/components/ui/button';
import { Loader2, Check } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useInvoiceRequest } from '../hooks/useInvoiceRequest';

// Phone validation regex for format 0xxx xxx xxx
const PHONE_REGEX = /^0\d{3}(\s\d{3}){2}$/;

interface Provider {
  id: string;
  name: string;
}

const requestInvoiceSchema = Yup.object().shape({
  orderNo: Yup.string().required('Order number is required.'),
  customerName: Yup.string().required('Customer name is required.'),
  taxNo: Yup.string().required('Tax code is required.'),
  taxAddress: Yup.string().required('Address is required.'),
  email: Yup.string().email('Invalid email address.').required('Email address is required.'),
  providerId: Yup.string().required('Provider is required.'),
  phone: Yup.string()
    .required('Phone number is required.')
    .transform((value) => (value === '' ? null : value))
    .test(
      'is-valid-phone',
      'Phone number should be in format: 0xxx xxx xxx',
      (value) => !value || PHONE_REGEX.test(value),
    ),
});

type RequestInvoiceFormValues = Yup.InferType<typeof requestInvoiceSchema>;

const RequestInvoiceForm = ({ className, ...props }: React.ComponentProps<'div'>) => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [isLoadingProviders, setIsLoadingProviders] = useState(false);

  const form = useForm<RequestInvoiceFormValues>({
    resolver: yupResolver(requestInvoiceSchema),
    mode: 'onChange',
    defaultValues: {
      orderNo: '',
      customerName: '',
      taxNo: '',
      taxAddress: '',
      email: '',
      phone: '',
      providerId: '',
    },
  });

  const { isSubmitting, handleSubmit } = useInvoiceRequest<RequestInvoiceFormValues>({
    form,
    endpoint: '/api/invoices/request',
  });

  // Fetch providers on component mount
  useEffect(() => {
    const fetchProviders = async () => {
      setProviders([
        { id: 'seed-user-1', name: 'Provider 1' },
        { id: 'seed-user-2', name: 'Provider 2' },
        { id: 'seed-user-3', name: 'Provider 3' },
        { id: 'seed-user-4', name: 'Provider 4' },
      ]);
      setIsLoadingProviders(false);
    };

    fetchProviders();
  }, []);

  // Format phone number as user types (0xxx xxx xxx)
  const formatPhoneNumber = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');

    // Format to 0xxx xxx xxx
    if (digits.length <= 4) {
      return digits;
    } else if (digits.length <= 7) {
      return `${digits.substring(0, 4)} ${digits.substring(4)}`;
    } else {
      return `${digits.substring(0, 4)} ${digits.substring(4, 7)} ${digits.substring(7, 10)}`;
    }
  };

  const isFormValid = form.formState.isValid;

  return (
    <Card className={`mt-5 max-w-3xl mx-auto shadow-sm ${className || ''}`} {...props}>
      <CardHeader className="text-center">
        <CardTitle className="text-xl font-bold">Request Invoice</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="orderNo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Order code <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter order code" {...field} value={field.value ?? ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="providerId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Provider <span className="text-red-500">*</span>
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={
                              isLoadingProviders ? 'Loading providers...' : 'Select provider'
                            }
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {providers.map((provider) => (
                          <SelectItem key={provider.id} value={provider.id}>
                            {provider.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="customerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Name <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your name" {...field} value={field.value ?? ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="taxNo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Tax code <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter tax code" {...field} value={field.value ?? ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Email <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        {...field}
                        value={field.value ?? ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field: { onChange, ...field } }) => (
                  <FormItem>
                    <FormLabel>
                      Phone number <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="0xxx xxx xxx"
                        {...field}
                        value={field.value ?? ''}
                        onChange={(e) => {
                          const formattedValue = formatPhoneNumber(e.target.value);
                          onChange(formattedValue);
                        }}
                        maxLength={12} // 0xxx xxx xxx (10 digits + 2 spaces)
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Address field (full width) */}
            <FormField
              control={form.control}
              name="taxAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Address <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter your address"
                      className="resize-none"
                      {...field}
                      value={field.value ?? ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-center mt-6">
              <Button
                type="submit"
                className="text-lg font-semibold w-48 py-6 bg-blue-500  hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
                disabled={!isFormValid}
              >
                {!isSubmitting ? (
                  <Check className="block text-green-300 stroke-[4] transform transition-transform duration-200 drop-shadow-sm hover:text-green-100 !h-[23px] !w-[23px]" />
                ) : (
                  <Loader2 className="h-full w-full text-primary animate-spin" />
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default RequestInvoiceForm;
