import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { bulkImportService } from '@/features/invoices/infrastructure/services/bulkImportService';
import { ValidatedRecord } from '@/features/invoices/domain/types/bulk-import.types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Check authentication using getServerSession
    const session = await getServerSession(req, res, authOptions);
    
    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Only allow POST method
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    // Get records from request body
    const { records } = req.body as { records: ValidatedRecord[] };

    if (!Array.isArray(records) || records.length === 0) {
      return res.status(400).json({ error: 'No valid records provided' });
    }

    // Filter out invalid records
    const validRecords = records.filter(record => record.status === 'valid');

    if (validRecords.length === 0) {
      return res.status(400).json({ error: 'No valid records to import' });
    }

    // Import records
    const importResult = await bulkImportService.importRecords(validRecords);

    return res.status(200).json({ data: importResult });
  } catch (error: any) {
    console.error('Import error:', error);
    return res.status(500).json({ error: error.message || 'Failed to import records' });
  }
}
