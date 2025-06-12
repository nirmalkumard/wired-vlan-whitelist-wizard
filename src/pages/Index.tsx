
import React from 'react';
import { WifiOperationsForm } from '@/components/WifiOperationsForm';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-slate-800 mb-2">
              Internal WiFi Operations
            </h1>
            <p className="text-lg text-slate-600">
              MAC Whitelisting & VLAN Tagging Configuration
            </p>
          </div>
          <WifiOperationsForm />
        </div>
      </div>
    </div>
  );
};

export default Index;
