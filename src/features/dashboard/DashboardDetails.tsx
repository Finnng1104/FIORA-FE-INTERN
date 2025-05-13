'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import InvoiceToolbar from './Filter/FSS';

type InvoiceStatus =
  | 'Accepted'
  | 'Issuing'
  | 'Cancel'
  | 'Cancelled'
  | 'Replace'
  | 'Replaced'
  | 'Issued'
  | 'Request';

const statusColor: Record<InvoiceStatus, string> = {
  Accepted: 'text-blue-500',
  Issuing: 'text-orange-500',
  Cancel: 'text-red-500',
  Cancelled: 'text-red-500',
  Replace: 'text-purple-500',
  Replaced: 'text-purple-500',
  Issued: 'text-green-500',
  Request: 'text-yellow-500',
};

const invoiceList: {
  id: number;
  name: string;
  taxNo: string;
  order: string;
  email: string;
  invoice: string;
  amount: string;
  status: InvoiceStatus;
  date: string;
  time: string;
}[] = [
  {
    id: 1,
    name: 'Khoa Ngô',
    taxNo: '23745',
    order: 'OR01',
    email: 'abc@gmail.com',
    invoice: 'INV01',
    amount: '3.000.000',
    status: 'Accepted',
    date: '02/05/2025',
    time: '02/05/2025',
  },
  {
    id: 2,
    name: 'Nghĩa',
    taxNo: '23425',
    order: 'OR02',
    email: 'abc@gmail.com',
    invoice: 'INV01',
    amount: '3.000.000',
    status: 'Issued',
    date: '02/05/2025',
    time: '02/05/2025',
  },
  {
    id: 3,
    name: 'Nhật Anh',
    taxNo: '23742',
    order: 'OR03',
    email: 'abc@gmail.com',
    invoice: 'INV01',
    amount: '3.000.000',
    status: 'Issuing',
    date: '02/05/2025',
    time: '02/05/2025',
  },
  {
    id: 4,
    name: 'Anh Khoa',
    taxNo: '27425',
    order: 'OR04',
    email: 'abc@gmail.com',
    invoice: 'INV01',
    amount: '3.000.000',
    status: 'Cancel',
    date: '02/05/2025',
    time: '02/05/2025',
  },
  {
    id: 5,
    name: 'Thanh Bạch',
    taxNo: '37425',
    order: 'OR05',
    email: 'abc@gmail.com',
    invoice: 'INV01',
    amount: '3.000.000',
    status: 'Replace',
    date: '02/05/2025',
    time: '02/05/2025',
  },
];

export default function InvoiceDashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [chartData, setChartData] = useState<{ status: InvoiceStatus; count: number }[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<(typeof invoiceList)[0] | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  // Fetch chart data from API
  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const response = await fetch('/api/chart-data');
        const data = await response.json();
        setChartData(data);
      } catch (error) {
        console.error('Error fetching chart data:', error);
      }
    };
    fetchChartData();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const handleSort = (key: string) => {
    // If the same column is clicked, toggle sort order
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const sortedInvoices = [...invoiceList].sort((a, b) => {
    if (sortKey) {
      const aValue = a[sortKey as keyof typeof a];
      const bValue = b[sortKey as keyof typeof b];

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const filteredInvoices = sortedInvoices.filter((invoice) => {
    return (
      invoice.name.toLowerCase().includes(searchQuery) ||
      invoice.taxNo.toLowerCase().includes(searchQuery) ||
      invoice.order.toLowerCase().includes(searchQuery) ||
      invoice.email.toLowerCase().includes(searchQuery) ||
      invoice.invoice.toLowerCase().includes(searchQuery) ||
      invoice.status.toLowerCase().includes(searchQuery) ||
      invoice.date.toLowerCase().includes(searchQuery) ||
      invoice.time.toLowerCase().includes(searchQuery)
    );
  });

  return (
    <div className="p-6 space-y-6">
      <InvoiceToolbar onSearchChange={handleSearchChange} />

      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-4">Invoices Chart</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              layout="vertical"
              data={chartData}
              margin={{ top: 10, right: 20, left: 30, bottom: 10 }}
            >
              <XAxis type="number" />
              <YAxis type="category" dataKey="status" />
              <Tooltip />
              <Bar dataKey="count" fill="#f472b6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-4">Invoices Dashboard</h3>
          <div className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead onClick={() => handleSort('id')}>
                    No. {sortKey === 'id' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </TableHead>
                  <TableHead onClick={() => handleSort('name')}>
                    Name {sortKey === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </TableHead>
                  <TableHead onClick={() => handleSort('taxNo')}>
                    Tax No {sortKey === 'taxNo' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </TableHead>
                  <TableHead onClick={() => handleSort('order')}>
                    Order No {sortKey === 'order' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </TableHead>
                  <TableHead onClick={() => handleSort('email')}>
                    Email {sortKey === 'email' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </TableHead>
                  <TableHead onClick={() => handleSort('invoice')}>
                    Invoice No {sortKey === 'invoice' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </TableHead>
                  <TableHead onClick={() => handleSort('amount')}>
                    Amount {sortKey === 'amount' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </TableHead>
                  <TableHead onClick={() => handleSort('status')}>
                    Status {sortKey === 'status' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </TableHead>
                  <TableHead onClick={() => handleSort('date')}>
                    Invoice Date {sortKey === 'date' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </TableHead>
                  <TableHead onClick={() => handleSort('time')}>
                    Request Date Time {sortKey === 'time' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvoices.map((inv) => (
                  <TableRow key={inv.id}>
                    <TableCell>{inv.id}</TableCell>
                    <TableCell>{inv.name}</TableCell>
                    <TableCell>{inv.taxNo}</TableCell>
                    <TableCell>{inv.order}</TableCell>
                    <TableCell>{inv.email}</TableCell>
                    <TableCell>{inv.invoice}</TableCell>
                    <TableCell>{inv.amount}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded font-medium ${statusColor[inv.status]}`}>
                        {inv.status}
                      </span>
                    </TableCell>
                    <TableCell>{inv.date}</TableCell>
                    <TableCell>{inv.time}</TableCell>
                    <TableCell>
                      <button
                        className="text-sm text-gray-500 hover:text-blue-600"
                        onClick={() => {
                          setSelectedInvoice(inv);
                          setShowDetails(true);
                        }}
                      >
                        🔍
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {showDetails && selectedInvoice && (
        <Card>
          <CardContent className="pt-4 space-y-2">
            <h3 className="text-lg font-semibold mb-2">Invoice Details</h3>
            <p>
              <strong>Name:</strong> {selectedInvoice.name}
            </p>
            <p>
              <strong>Tax No:</strong> {selectedInvoice.taxNo}
            </p>
            <p>
              <strong>Order No:</strong> {selectedInvoice.order}
            </p>
            <p>
              <strong>Email:</strong> {selectedInvoice.email}
            </p>
            <p>
              <strong>Invoice No:</strong> {selectedInvoice.invoice}
            </p>
            <p>
              <strong>Amount:</strong> {selectedInvoice.amount}
            </p>
            <p>
              <strong>Status:</strong> {selectedInvoice.status}
            </p>
            <p>
              <strong>Invoice Date:</strong> {selectedInvoice.date}
            </p>
            <p>
              <strong>Request Date Time:</strong> {selectedInvoice.time}
            </p>
            <button
              className="mt-4 text-sm text-gray-500 hover:text-blue-600"
              onClick={() => setShowDetails(false)}
            >
              Close
            </button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
