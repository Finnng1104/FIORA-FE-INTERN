import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import formidable from 'formidable';
import fs from 'fs/promises';
import { bulkImportService } from '@/features/invoices/infrastructure/services/bulkImportService';

export const config = {
  api: {
    bodyParser: false,
  },
};

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

    // Parse form data
    const form = formidable();
    const [, files] = await form.parse(req);
    const uploadedFile = Array.isArray(files.file) ? files.file[0] : files.file;

    if (!uploadedFile) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    try {
      // Read file content
      const fileBuffer = await fs.readFile(uploadedFile.filepath);
      
      // Validate file using the service
      const validationResult = await bulkImportService.validateFile(
        fileBuffer,
        uploadedFile.mimetype || undefined
      );

      // Clean up temp file
      await fs.unlink(uploadedFile.filepath);

      return res.status(200).json({ data: validationResult });
    } catch (error: any) {
      console.error('File processing error:', error);
      return res.status(400).json({ 
        error: error.message || 'Failed to process Excel file'
      });
    }
  } catch (error: any) {
    console.error('Validation error:', error);
    return res.status(400).json({ 
      error: error.message || 'Failed to validate file'
    });
  }
}
