'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Recommendations from './components/Recommendations';
import InvoiceDetailsPage from '@/features/Dashboard/DashboardDetails';

export default function HomePage() {
  return (
    <div className="flex flex-1 flex-col space-y-4 p-4">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Home</h2>
        <div className="hidden items-center space-x-2 md:flex"></div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="filter">Filter Settings</TabsTrigger>
          <TabsTrigger value="invoice">DashboardDetails</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-10">
            {/* Left Section */}
            <div className="col-span-1 md:col-span-2 lg:col-span-7 space-y-4">
              {/* <SectionList/> */}
            </div>

            {/* Right Section */}
            <div className="col-span-1 md:col-span-2 lg:col-span-3 space-y-4">
              <Recommendations />
            </div>
          </div>
          {/* <TabsContent value="filter">
            <FSS/>
          </TabsContent> */}
        </TabsContent>
        <TabsContent value="invoice">
          <InvoiceDetailsPage />
        </TabsContent>
      </Tabs>
    </div>
  );
}
