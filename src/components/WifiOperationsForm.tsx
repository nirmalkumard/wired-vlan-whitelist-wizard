
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { OrganizationalContext } from './form-steps/OrganizationalContext';
import { ParameterConfiguration } from './form-steps/ParameterConfiguration';
import { ConfigurationOutput } from './form-steps/ConfigurationOutput';
import { ApiConfiguration } from './ApiConfiguration';
import { Badge } from '@/components/ui/badge';

export interface FormData {
  organizationId: string;
  organizationName: string;
  networkId: string;
  networkName: string;
  useCase: 'WiFi' | 'Wired' | '';
  operation: string;
  // WiFi specific fields
  ssid: string;
  ssidName: string;
  clientName: string;
  // Wired specific fields
  vlan: string;
  deviceSerial: string;
  deviceName: string;
  portNumber: string;
  // Common field
  macId: string;
}

export const WifiOperationsForm = () => {
  const [currentStep, setCurrentStep] = useState(0); // Start with API configuration
  const [apiKey, setApiKey] = useState('');
  const [formData, setFormData] = useState<FormData>({
    organizationId: '',
    organizationName: '',
    networkId: '',
    networkName: '',
    useCase: '',
    operation: '',
    ssid: '',
    ssidName: '',
    clientName: '',
    vlan: '',
    macId: '',
    deviceSerial: '',
    deviceName: '',
    portNumber: ''
  });

  const updateFormData = (updates: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const handleApiKeySet = (key: string) => {
    setApiKey(key);
    setCurrentStep(1); // Move to organizational context
  };

  const handleStepComplete = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBackToStep = (step: number) => {
    setCurrentStep(step);
  };

  const getStepStatus = (step: number) => {
    if (step < currentStep) return 'completed';
    if (step === currentStep) return 'active';
    return 'pending';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">
            Internal WiFi Operations
          </h1>
          <p className="text-lg text-slate-600">
            MAC Whitelisting & VLAN Tagging Configuration
          </p>
        </div>

        <div className="space-y-6">
          {/* API Configuration Step */}
          {currentStep === 0 && (
            <ApiConfiguration 
              onApiKeySet={handleApiKeySet}
              apiKey={apiKey}
            />
          )}

          {/* Progress Indicator - Only show after API key is set */}
          {currentStep > 0 && (
            <Card className="border-slate-200 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  {[1, 2, 3].map((step) => (
                    <div key={step} className="flex items-center">
                      <div className={`flex items-center justify-center w-10 h-10 rounded-full text-sm font-medium transition-colors ${
                        getStepStatus(step) === 'completed'
                          ? 'bg-green-500 text-white'
                          : getStepStatus(step) === 'active'
                          ? 'bg-blue-500 text-white'
                          : 'bg-slate-200 text-slate-600'
                      }`}>
                        {step}
                      </div>
                      <div className="ml-3">
                        <div className={`text-sm font-medium ${
                          getStepStatus(step) === 'active' ? 'text-blue-600' : 'text-slate-600'
                        }`}>
                          {step === 1 && 'Organizational Context'}
                          {step === 2 && 'Configure Parameters'}
                          {step === 3 && 'Review & Output'}
                        </div>
                      </div>
                      {step < 3 && (
                        <div className={`ml-6 w-16 h-0.5 ${
                          getStepStatus(step) === 'completed' ? 'bg-green-500' : 'bg-slate-200'
                        }`} />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step Content */}
          {currentStep === 1 && (
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="border-b border-slate-100">
                <CardTitle className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-blue-50 text-blue-700">
                    Step 1
                  </Badge>
                  Select Organizational Context
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <OrganizationalContext
                  formData={formData}
                  updateFormData={updateFormData}
                  onComplete={handleStepComplete}
                  apiKey={apiKey}
                />
              </CardContent>
            </Card>
          )}

          {currentStep === 2 && (
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="border-b border-slate-100">
                <CardTitle className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-blue-50 text-blue-700">
                    Step 2
                  </Badge>
                  Configure Parameters
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <ParameterConfiguration
                  formData={formData}
                  updateFormData={updateFormData}
                  onComplete={handleStepComplete}
                  onBack={() => handleBackToStep(1)}
                  apiKey={apiKey}
                />
              </CardContent>
            </Card>
          )}

          {currentStep === 3 && (
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="border-b border-slate-100">
                <CardTitle className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-green-50 text-green-700">
                    Step 3
                  </Badge>
                  Configuration Complete
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <ConfigurationOutput
                  formData={formData}
                  onBack={() => handleBackToStep(2)}
                  onReset={() => {
                    setCurrentStep(0);
                    setApiKey('');
                    setFormData({
                      organizationId: '',
                      organizationName: '',
                      networkId: '',
                      networkName: '',
                      useCase: '',
                      operation: '',
                      ssid: '',
                      ssidName: '',
                      clientName: '',
                      vlan: '',
                      macId: '',
                      deviceSerial: '',
                      deviceName: '',
                      portNumber: ''
                    });
                  }}
                />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
