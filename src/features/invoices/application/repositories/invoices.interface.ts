import { Invoice, RequestInvoiceInput } from '../../domain/entities/models/invoices';

export interface IInvoiceRepository {
  createInvoiceRequest(
    data: RequestInvoiceInput,
    requestingUserId: string | null,
  ): Promise<Invoice>;
}
