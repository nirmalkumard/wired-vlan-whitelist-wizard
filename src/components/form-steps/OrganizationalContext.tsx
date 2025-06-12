
import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Building, Network, Settings } from 'lucide-react';
import { FormData } from '../WifiOperationsForm';
import { merakiApi } from '@/lib/meraki-api';

interface Props {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
  onComplete: () => void;
}

export const OrganizationalContext: React.FC<Props> = ({
  formData,
  updateFormData,
  onComplete
}) => {
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [networks, setNetworks] = useState<any[]>([]);
  const [loadingOrgs, setLoadingOrgs] = useState(true);
  const [loadingNetworks, setLoadingNetworks] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    loadOrganizations();
  }, []);

  useEffect(() => {
    if (formData.organizationId) {
      loadNetworks(formData.organizationId);
    }
  }, [formData.organizationId]);

  const loadOrganizations = async () => {
    try {
      setLoadingOrgs(true);
      setError('');
      const orgs = await merakiApi.getOrganizations();
      setOrganizations(orgs);
    } catch (err) {
      setError('Failed to load organizations. Please check your API configuration.');
      console.error('Error loading organizations:', err);
    } finally {
      setLoadingOrgs(false);
    }
  };

  const loadNetworks = async (orgId: string) => {
    try {
      setLoadingNetworks(true);
      setError('');
      const nets = await merakiApi.getNetworks(orgId);
      setNetworks(nets);
    } catch (err) {
      setError('Failed to load networks for selected organization.');
      console.error('Error loading networks:', err);
    } finally {
      setLoadingNetworks(false);
    }
  };

  const handleOrganizationChange = (value: string) => {
    const selectedOrg = organizations.find(org => org.id === value);
    updateFormData({
      organizationId: value,
      organizationName: selectedOrg?.name || '',
      networkId: '',
      networkName: ''
    });
    setNetworks([]);
  };

  const handleNetworkChange = (value: string) => {
    const selectedNetwork = networks.find(net => net.id === value);
    updateFormData({
      networkId: value,
      networkName: selectedNetwork?.name || ''
    });
  };

  const canProceed = formData.organizationId && formData.networkId && formData.useCase && formData.operation;

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="organization" className="flex items-center gap-2">
            <Building className="w-4 h-4" />
            Customer (Organization)
          </Label>
          <Select 
            value={formData.organizationId} 
            onValueChange={handleOrganizationChange}
            disabled={loadingOrgs}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={loadingOrgs ? "Loading organizations..." : "Select organization"} />
            </SelectTrigger>
            <SelectContent className="bg-white border border-slate-200 shadow-lg z-50">
              {organizations.map((org) => (
                <SelectItem key={org.id} value={org.id}>
                  {org.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="network" className="flex items-center gap-2">
            <Network className="w-4 h-4" />
            Site (Network)
          </Label>
          <Select 
            value={formData.networkId} 
            onValueChange={handleNetworkChange}
            disabled={!formData.organizationId || loadingNetworks}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={
                !formData.organizationId 
                  ? "Select organization first"
                  : loadingNetworks 
                  ? "Loading networks..." 
                  : "Select network"
              } />
            </SelectTrigger>
            <SelectContent className="bg-white border border-slate-200 shadow-lg z-50">
              {networks.map((network) => (
                <SelectItem key={network.id} value={network.id}>
                  {network.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {loadingNetworks && (
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading networks...
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="useCase" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Use Case
          </Label>
          <Select value={formData.useCase} onValueChange={(value: 'WiFi' | 'Wired') => updateFormData({ useCase: value, operation: '' })}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select use case" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-slate-200 shadow-lg z-50">
              <SelectItem value="WiFi">WiFi</SelectItem>
              <SelectItem value="Wired">Wired</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="operation">Operation</Label>
          <Select 
            value={formData.operation} 
            onValueChange={(value) => updateFormData({ operation: value })}
            disabled={!formData.useCase}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={!formData.useCase ? "Select use case first" : "Select operation"} />
            </SelectTrigger>
            <SelectContent className="bg-white border border-slate-200 shadow-lg z-50">
              {formData.useCase === 'Wired' && (
                <SelectItem value="MAC Whitelisting and VLAN Tagging">
                  MAC Whitelisting and VLAN Tagging
                </SelectItem>
              )}
              {formData.useCase === 'WiFi' && (
                <SelectItem value="WiFi Configuration">
                  WiFi Configuration
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button 
          onClick={onComplete}
          disabled={!canProceed}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Continue to Parameters
        </Button>
      </div>
    </div>
  );
};
