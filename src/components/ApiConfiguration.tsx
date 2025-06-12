
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Eye, EyeOff, AlertTriangle } from 'lucide-react';

interface Props {
  onApiKeySet: (apiKey: string) => void;
  apiKey: string;
}

export const ApiConfiguration: React.FC<Props> = ({ onApiKeySet, apiKey }) => {
  const [inputKey, setInputKey] = useState(apiKey);
  const [showKey, setShowKey] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputKey.trim()) {
      onApiKeySet(inputKey.trim());
    }
  };

  return (
    <Card className="border-orange-200 bg-orange-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-orange-800">
          <Shield className="w-5 h-5" />
          Meraki API Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert className="border-amber-200 bg-amber-50">
          <AlertTriangle className="w-4 h-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            <strong>Security Notice:</strong> Your API key is stored temporarily in your browser session and is not saved permanently. 
            Never share your API key with others. If compromised, rotate it immediately in your Meraki Dashboard.
          </AlertDescription>
        </Alert>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="apiKey" className="text-sm font-medium">
              Meraki API Key
            </Label>
            <div className="relative">
              <Input
                id="apiKey"
                type={showKey ? "text" : "password"}
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                placeholder="Enter your Meraki API key"
                className="pr-10"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowKey(!showKey)}
              >
                {showKey ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </Button>
            </div>
            <p className="text-xs text-gray-600">
              Get your API key from the Meraki Dashboard under Organization → Settings → Dashboard API access
            </p>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-orange-600 hover:bg-orange-700"
            disabled={!inputKey.trim()}
          >
            {apiKey ? 'Update API Key' : 'Set API Key'}
          </Button>
        </form>

        {apiKey && (
          <div className="text-sm text-green-700 bg-green-50 p-3 rounded-md border border-green-200">
            ✓ API key configured. You can now proceed with the configuration.
          </div>
        )}
      </CardContent>
    </Card>
  );
};
