'use client';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import Recommendations from './components/Recommendations';

export default function HomePage() {
  return (
    <div className="flex flex-1 flex-col space-y-4 p-4">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Home</h2>
        <div className="hidden items-center space-x-2 md:flex"></div>
      </div>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-10">
            {/* Left Section */}
            <div className="col-span-1 md:col-span-2 lg:col-span-7 space-y-4">Content Here</div>

            {/* Right Section */}
            <div className="col-span-1 md:col-span-2 lg:col-span-3 space-y-4">
              <Recommendations />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
