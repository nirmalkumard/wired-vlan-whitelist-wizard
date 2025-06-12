
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle, Copy, RotateCcw, Send, Loader2 } from 'lucide-react';
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
  const [webhookUrl, setWebhookUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const submitToWebhook = async () => {
    if (!webhookUrl) {
      toast({
        title: "Error",
        description: "Please enter your n8n webhook URL",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    console.log("Submitting to n8n webhook:", webhookUrl);

    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...outputJson,
          timestamp: new Date().toISOString(),
          source: "wifi-operations-form"
        }),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Configuration submitted to n8n workflow successfully!",
        });
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error submitting to webhook:", error);
      toast({
        title: "Error",
        description: "Failed to submit to n8n webhook. Please check the URL and try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
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

      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-lg text-blue-800">Submit to n8n Workflow</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="webhook-url">n8n Webhook URL</Label>
            <Input
              id="webhook-url"
              type="url"
              placeholder="https://your-n8n-instance.com/webhook/your-webhook-id"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              className="mt-1"
            />
          </div>
          <Button 
            onClick={submitToWebhook}
            disabled={isSubmitting || !webhookUrl}
            className="w-full flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            {isSubmitting ? 'Submitting...' : 'Submit to n8n Workflow'}
          </Button>
        </CardContent>
      </Card>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-green-800 mb-2">Next Steps</h4>
        <ul className="text-sm text-green-700 space-y-1 list-disc list-inside">
          <li>Enter your n8n webhook URL above and submit the configuration</li>
          <li>The n8n workflow will receive the configuration data automatically</li>
          <li>Use the configuration with your Meraki API integration in n8n</li>
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
