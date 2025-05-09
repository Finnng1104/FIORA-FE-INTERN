import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { bulkImportService } from '@/features/invoices/infrastructure/services/bulkImportService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Check authentication using getServerSession
    const session = await getServerSession(req, res, authOptions);
    
    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Only allow GET method
    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    // Generate template file
    const templateBlob = await bulkImportService.generateTemplate();
    const buffer = await templateBlob.arrayBuffer();

    // Set response headers for file download
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=bulk-invoice-template.xlsx');
    res.setHeader('Cache-Control', 'no-store');

    // Send the file
    res.send(Buffer.from(buffer));
  } catch (error: any) {
    console.error('Template generation error:', error);
    return res.status(500).json({ error: error.message || 'Failed to generate template' });
  }
}
