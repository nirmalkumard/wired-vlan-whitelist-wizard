
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Server } from 'lucide-react';

export const ProductionWarning: React.FC = () => {
  return (
    <Alert className="border-amber-200 bg-amber-50 mb-6">
      <AlertTriangle className="w-4 h-4 text-amber-600" />
      <AlertDescription className="text-amber-800">
        <div className="space-y-2">
          <p className="font-semibold flex items-center gap-2">
            <Server className="w-4 h-4" />
            Production Deployment Notice
          </p>
          <p className="text-sm">
            This application requires a backend proxy service to access the Meraki API in production due to CORS restrictions. 
            Direct browser access to the Meraki API is not supported for security reasons.
          </p>
          <p className="text-sm">
            For production deployment, implement a backend service that:
          </p>
          <ul className="text-sm list-disc list-inside ml-4 space-y-1">
            <li>Accepts API requests from your frontend</li>
            <li>Forwards them to the Meraki API with proper authentication</li>
            <li>Returns the response back to your frontend</li>
            <li>Implements proper rate limiting and error handling</li>
          </ul>
        </div>
      </AlertDescription>
    </Alert>
  );
};
