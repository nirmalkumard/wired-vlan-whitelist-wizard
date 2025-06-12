
import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Router, Cable, Hash } from 'lucide-react';
import { FormData } from '../WifiOperationsForm';
import { merakiApi } from '@/lib/meraki-api';

interface Props {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
  onComplete: () => void;
  onBack: () => void;
}

export const ParameterConfiguration: React.FC<Props> = ({
  formData,
  updateFormData,
  onComplete,
  onBack
}) => {
  const [devices, setDevices] = useState<any[]>([]);
  const [ports, setPorts] = useState<any[]>([]);
  const [loadingDevices, setLoadingDevices] = useState(true);
  const [loadingPorts, setLoadingPorts] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (formData.organizationId) {
      loadDevices();
    }
  }, [formData.organizationId]);

  useEffect(() => {
    if (formData.deviceSerial) {
      loadPorts(formData.deviceSerial);
    }
  }, [formData.deviceSerial]);

  const loadDevices = async () => {
    try {
      setLoadingDevices(true);
      setError('');
      const allDevices = await merakiApi.getDevices(formData.organizationId);
      // Filter for switches only
      const switches = allDevices.filter(device => 
        device.model && (
          device.model.includes('MS') || 
          device.model.toLowerCase().includes('switch')
        )
      );
      setDevices(switches);
    } catch (err) {
      setError('Failed to load devices. Please check your API configuration.');
      console.error('Error loading devices:', err);
    } finally {
      setLoadingDevices(false);
    }
  };

  const loadPorts = async (serialNo: string) => {
    try {
      setLoadingPorts(true);
      setError('');
      const switchPorts = await merakiApi.getSwitchPorts(serialNo);
      setPorts(switchPorts);
    } catch (err) {
      setError('Failed to load ports for selected device.');
      console.error('Error loading ports:', err);
    } finally {
      setLoadingPorts(false);
    }
  };

  const handleDeviceChange = (value: string) => {
    const selectedDevice = devices.find(device => device.serial === value);
    updateFormData({
      deviceSerial: value,
      deviceName: selectedDevice?.name || selectedDevice?.model || 'Unknown Device',
      portNumber: ''
    });
    setPorts([]);
  };

  const validateMacAddress = (mac: string) => {
    const macRegex = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;
    return macRegex.test(mac);
  };

  const validateVlan = (vlan: string) => {
    const vlanNum = parseInt(vlan);
    return !isNaN(vlanNum) && vlanNum >= 1 && vlanNum <= 4094;
  };

  const canProceed = formData.vlan && 
                    validateVlan(formData.vlan) && 
                    formData.macId && 
                    validateMacAddress(formData.macId) &&
                    formData.deviceSerial && 
                    formData.portNumber;

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="vlan" className="flex items-center gap-2">
            <Hash className="w-4 h-4" />
            VLAN
          </Label>
          <Input
            id="vlan"
            type="text"
            placeholder="e.g., 120"
            value={formData.vlan}
            onChange={(e) => updateFormData({ vlan: e.target.value })}
            className={`${formData.vlan && !validateVlan(formData.vlan) ? 'border-red-500' : ''}`}
          />
          {formData.vlan && !validateVlan(formData.vlan) && (
            <p className="text-sm text-red-500">VLAN must be between 1 and 4094</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="macId" className="flex items-center gap-2">
            <Cable className="w-4 h-4" />
            MAC ID
          </Label>
          <Input
            id="macId"
            type="text"
            placeholder="e.g., aa:bb:cc:dd:ee:ff"
            value={formData.macId}
            onChange={(e) => updateFormData({ macId: e.target.value.toLowerCase() })}
            className={`${formData.macId && !validateMacAddress(formData.macId) ? 'border-red-500' : ''}`}
          />
          {formData.macId && !validateMacAddress(formData.macId) && (
            <p className="text-sm text-red-500">Invalid MAC address format. Use aa:bb:cc:dd:ee:ff</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="device" className="flex items-center gap-2">
            <Router className="w-4 h-4" />
            Choose Device
          </Label>
          <Select 
            value={formData.deviceSerial} 
            onValueChange={handleDeviceChange}
            disabled={loadingDevices}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={loadingDevices ? "Loading devices..." : "Select switch device"} />
            </SelectTrigger>
            <SelectContent className="bg-white border border-slate-200 shadow-lg z-50">
              {devices.map((device) => (
                <SelectItem key={device.serial} value={device.serial}>
                  <div className="flex flex-col">
                    <span className="font-medium">{device.name || device.model}</span>
                    <span className="text-sm text-slate-500">{device.serial}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {loadingDevices && (
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading switch devices...
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="port">Port Number</Label>
          <Select 
            value={formData.portNumber} 
            onValueChange={(value) => updateFormData({ portNumber: value })}
            disabled={!formData.deviceSerial || loadingPorts}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={
                !formData.deviceSerial 
                  ? "Select device first"
                  : loadingPorts 
                  ? "Loading ports..." 
                  : "Select port"
              } />
            </SelectTrigger>
            <SelectContent className="bg-white border border-slate-200 shadow-lg z-50">
              {ports.map((port) => (
                <SelectItem key={port.portId} value={port.portId}>
                  <div className="flex flex-col">
                    <span>Port {port.portId}</span>
                    {port.name && <span className="text-sm text-slate-500">{port.name}</span>}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {loadingPorts && (
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading ports...
            </div>
          )}
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-800 mb-2">Configuration Summary</h4>
        <div className="text-sm text-blue-700 space-y-1">
          <p><strong>Organization:</strong> {formData.organizationName}</p>
          <p><strong>Network:</strong> {formData.networkName}</p>
          <p><strong>Operation:</strong> {formData.operation}</p>
          {formData.deviceName && <p><strong>Device:</strong> {formData.deviceName}</p>}
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button 
          onClick={onComplete}
          disabled={!canProceed}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Generate Configuration
        </Button>
      </div>
    </div>
  );
};
