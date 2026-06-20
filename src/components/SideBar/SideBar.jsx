// React component for sidebar navigation (placeholder)
import React from 'react';
import { Button } from '@shadcn/ui'; // placeholder import
import { Lucide } from 'lucide-react';

export default function SideBar() {
  return (
    <div className="p-4 space-y-2">
      <Button variant="outline" className="w-full justify-start">
        <Lucide name="list" size={16} className="mr-2" />
        分类目录
      </Button>
      {/* Add more sidebar entries as needed */}
    </div>
  );
}
