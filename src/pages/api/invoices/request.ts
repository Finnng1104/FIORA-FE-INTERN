import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import * as Yup from 'yup';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { RequestInvoiceUseCase } from '@/features/invoices/application/use-cases/requestInvoice';
import { InvoiceCreationError } from '@/features/invoices/domain/entities/errors/invoiceErrors';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { invoiceRepository } from '@/features/invoices/infrastructure/repositories/invoice.repository';
import { orderRepository } from '@/features/orders/infrastructure/repositories/order.repository';
import { RequestInvoiceInput } from '@/features/invoices/domain/entities/models/invoices';
import { OrderNotFoundError } from '@/features/orders/domain/entities/errors/orderErrors';
import { DomainError } from '@/shared/entities/common';

// Schema validation
const requestInvoiceSchema = Yup.object().shape({
  orderNo: Yup.string().required('Order number is required.'),
  customerName: Yup.string().required('Customer name is required.'),
  taxNo: Yup.string().required('Tax number is required.'),
  taxAddress: Yup.string().required('Address is required.'),
  email: Yup.string().email('Invalid email address.').required('Email address is required.'),
  phone: Yup.string().required('Phone number is required.'),
  providerId: Yup.string().required('Provider is required'),
});

// Instantiate the use case with the repository dependency
const requestInvoiceUseCase = new RequestInvoiceUseCase(invoiceRepository, orderRepository);

/**
 * API handler for invoice requests
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(RESPONSE_CODE.METHOD_NOT_ALLOWED).json({ error: 'Method not allowed' });
  }

  // 1. Get User Session (but allow guests)
  const session = await getServerSession(req, res, authOptions);
  const requestingUserId = session?.user?.id ?? null;

  try {
    // 2. Validate Request Body using Yup
    const validatedData = await validateRequestBody(req.body);

    // 3. Execute the Use Case
    const result = await requestInvoiceUseCase.execute(validatedData, requestingUserId);

    // 4. Return Success Response
    return res.status(201).json({
      message: 'Invoice request submitted successfully.',
      data: result,
      validation: {
        status: result.validationStatus,
        message: result.validationMessage,
        title: result.validationTitle,
      },
    });
  } catch (error) {
    return handleApiError(error, res);
  }
}

/**
 * Validates the request body using Yup schema
 */
async function validateRequestBody(body: any): Promise<RequestInvoiceInput> {
  try {
    return await requestInvoiceSchema.validate(body, {
      abortEarly: false,
      stripUnknown: true,
    });
  } catch (error) {
    if (error instanceof Yup.ValidationError) {
      const errors = error.inner.reduce(
        (acc, current) => {
          acc[current.path as string] = current.message;
          return acc;
        },
        {} as Record<string, string>,
      );

      // Rethrow with structured error
      const validationError = new Error('Invalid request data');
      (validationError as any).status = 400;
      (validationError as any).errors = errors;
      throw validationError;
    }
    throw error;
  }
}

/**
 * Handles API errors with appropriate status codes
 */
function handleApiError(error: any, res: NextApiResponse) {
  console.log('API Error:', error);

  if (error instanceof OrderNotFoundError) {
    return res.status(404).json({ message: error.message });
  }

  if (error instanceof InvoiceCreationError) {
    return res.status(500).json({ message: error.message });
  }

  if (error instanceof DomainError) {
    return res.status(400).json({ message: error.message });
  }

  if (error.status === 400 && error.errors) {
    return res.status(400).json({ message: 'Invalid request data.', errors: error.errors });
  }

  return res.status(500).json({ message: 'An unexpected internal server error occurred.' });
}
