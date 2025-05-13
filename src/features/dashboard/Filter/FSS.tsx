import { useState, ChangeEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Filter, LayoutGrid, Plus, ShoppingCart, Search } from 'lucide-react';

interface InvoiceToolbarProps {
  onSearchChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export default function InvoiceToolbar({ onSearchChange }: InvoiceToolbarProps) {
  // State for search query
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Handle the search input change
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    onSearchChange(e); // Gọi hàm onSearchChange khi input thay đổi
  };

  // Handle search button click
  const handleSearchClick = () => {
    console.log('Searching for:', searchQuery);
    // You can trigger the search logic here, like fetching the filtered invoices from an API
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between border p-4 rounded-md shadow-sm bg-white space-y-2 md:space-y-0">
      {/* Left section: title & search description */}
      <div>
        <h2 className="text-lg font-semibold text-black">Invoices Dashboard</h2>
        <p className="text-xs text-black">
          Search by name, tax no, order number, email, invoice no, status, invoice date, request
          date time
        </p>
      </div>

      {/* Middle section: search + filter + display count */}
      <div className="flex items-center gap-2">
        <Input
          placeholder="Search..."
          className="w-48 h-8 text-sm text-black"
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleSearchClick}>
          <Search className="h-4 w-4 text-black" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Filter className="h-4 w-4 text-black" />
        </Button>
        <span className="text-xs text-black ml-2">Displaying: 5 / 50</span>
      </div>

      {/* Right section: icon actions */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <ShoppingCart className="h-4 w-4 text-black" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Plus className="h-4 w-4 text-black" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <LayoutGrid className="h-4 w-4 text-black" />
        </Button>
      </div>
    </div>
  );
}
