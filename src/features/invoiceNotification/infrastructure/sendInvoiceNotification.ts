export async function sendInvoiceNotification(email: string, invoiceNumber: string) {
  try {
    const response = await fetch('/api/send-invoice-notification', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, invoiceNumber }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Gửi thông báo thất bại');
    }

    return await response.json();
  } catch (error: any) {
    console.error('Lỗi khi gửi thông báo:', error);
    throw new Error(error.message || 'Gửi thông báo thất bại');
  }
}
