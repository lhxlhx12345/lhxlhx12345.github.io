// React component for top navigation bar using Shadcn UI (Radix UI) components.
// Replace placeholder elements with actual Shadcn UI components as needed.
import React from 'react';
import { Button } from '@shadcn/ui'; // placeholder import; adjust per actual package
import { Lucide } from 'lucide-react';

export default function NavBar() {
  return (
    <nav className="flex items-center justify-between px-4 py-2">
      <div className="text-xl font-bold">个人博客</div>
      <div className="flex space-x-2">
        <Button variant="ghost" size="icon">
          <Lucide name="home" size={20} />
        </Button>
        <Button variant="ghost" size="icon">
          <Lucide name="search" size={20} />
        </Button>
        {/* Add more navigation items as needed */}
      </div>
    </nav>
  );
}
