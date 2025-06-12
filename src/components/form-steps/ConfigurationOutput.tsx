
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Copy, RotateCcw } from 'lucide-react';
import { FormData } from '../WifiOperationsForm';
import { useToast } from '@/hooks/use-toast';

interface Props {
  formData: FormData;
  onBack: () => void;
  onReset: () => void;
}

export const ConfigurationOutput: React.FC<Props> = ({
  formData,
  onBack,
  onReset
}) => {
  const { toast } = useToast();

  const outputJson = {
    orgId: formData.organizationId,
    networkId: formData.networkId,
    serialNumber: formData.deviceSerial,
    vlan: formData.vlan,
    macId: formData.macId,
    portNumber: formData.portNumber
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(outputJson, null, 2));
    toast({
      title: "Copied to clipboard",
      description: "Configuration JSON has been copied to your clipboard.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <CheckCircle className="w-16 h-16 text-green-500" />
        </div>
        <h3 className="text-2xl font-bold text-slate-800 mb-2">
          Configuration Complete!
        </h3>
        <p className="text-slate-600">
          Your MAC Whitelisting & VLAN Tagging configuration has been generated successfully.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="text-lg">Configuration Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-slate-600">Organization:</span>
              <span className="font-medium">{formData.organizationName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Network:</span>
              <span className="font-medium">{formData.networkName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Use Case:</span>
              <Badge variant="secondary">{formData.useCase}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Operation:</span>
              <span className="font-medium text-sm">{formData.operation}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Device:</span>
              <span className="font-medium">{formData.deviceName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Port:</span>
              <Badge variant="outline">{formData.portNumber}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">VLAN:</span>
              <Badge className="bg-blue-100 text-blue-800">{formData.vlan}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">MAC ID:</span>
              <code className="text-sm bg-slate-100 px-2 py-1 rounded">{formData.macId}</code>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Output JSON</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={copyToClipboard}
              className="flex items-center gap-2"
            >
              <Copy className="w-4 h-4" />
              Copy
            </Button>
          </CardHeader>
          <CardContent>
            <pre className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-sm overflow-x-auto">
              <code>{JSON.stringify(outputJson, null, 2)}</code>
            </pre>
          </CardContent>
        </Card>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-green-800 mb-2">Next Steps</h4>
        <ul className="text-sm text-green-700 space-y-1 list-disc list-inside">
          <li>Copy the JSON configuration above</li>
          <li>Use this configuration with your Meraki API integration</li>
          <li>Apply the MAC whitelisting and VLAN tagging to the specified port</li>
          <li>Verify the configuration in your Meraki dashboard</li>
        </ul>
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onBack}>
          Back to Configuration
        </Button>
        <Button 
          onClick={onReset}
          className="flex items-center gap-2 bg-slate-600 hover:bg-slate-700"
        >
          <RotateCcw className="w-4 h-4" />
          Start New Configuration
        </Button>
      </div>
    </div>
  );
};
