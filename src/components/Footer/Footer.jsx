// Simple footer component (React) – replace with Shadcn UI components if needed.
import React from 'react';

export default function Footer() {
  return (
    <div className="text-center text-sm text-gray-600">
      © {new Date().getFullYear()} LHX. All rights reserved.
    </div>
  );
}
