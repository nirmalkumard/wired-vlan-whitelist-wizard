
// Meraki API implementation with production-ready error handling
// Note: Direct browser access to Meraki API is blocked by CORS
// In production, this should be proxied through a backend service

const API_BASE_URL = "https://api.meraki.com/api/v1";

class MerakiAPIError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'MerakiAPIError';
  }
}

export const merakiApi = {
  async getOrganizations(apiKey: string) {
    if (!apiKey) {
      throw new MerakiAPIError('API key is required');
    }

    try {
      const response = await fetch(`${API_BASE_URL}/organizations`, {
        headers: {
          'X-Cisco-Meraki-API-Key': apiKey,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new MerakiAPIError(`API request failed: ${response.status} ${response.statusText}`, response.status);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching organizations:', error);
      
      // Handle CORS error specifically
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        throw new MerakiAPIError(
          'Unable to connect to Meraki API directly from browser. This application requires a backend proxy service to function in production. Please contact your administrator.'
        );
      }
      
      throw error;
    }
  },

  async getNetworks(organizationId: string, apiKey: string) {
    if (!apiKey) {
      throw new MerakiAPIError('API key is required');
    }

    try {
      const response = await fetch(`${API_BASE_URL}/organizations/${organizationId}/networks`, {
        headers: {
          'X-Cisco-Meraki-API-Key': apiKey,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new MerakiAPIError(`API request failed: ${response.status} ${response.statusText}`, response.status);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching networks:', error);
      
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        throw new MerakiAPIError(
          'Unable to connect to Meraki API. Backend proxy service required for production use.'
        );
      }
      
      throw error;
    }
  },

  async getWirelessSSIDs(networkId: string, apiKey: string) {
    if (!apiKey) {
      throw new MerakiAPIError('API key is required');
    }

    try {
      const response = await fetch(`${API_BASE_URL}/networks/${networkId}/wireless/ssids`, {
        headers: {
          'X-Cisco-Meraki-API-Key': apiKey,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new MerakiAPIError(`API request failed: ${response.status} ${response.statusText}`, response.status);
      }

      const ssids = await response.json();
      return ssids.filter((ssid: any) => ssid.enabled);
    } catch (error) {
      console.error('Error fetching SSIDs:', error);
      
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        throw new MerakiAPIError(
          'Unable to connect to Meraki API. Backend proxy service required for production use.'
        );
      }
      
      throw error;
    }
  },

  async getNetworkDevices(networkId: string, apiKey: string) {
    if (!apiKey) {
      throw new MerakiAPIError('API key is required');
    }

    try {
      const response = await fetch(`${API_BASE_URL}/networks/${networkId}/devices`, {
        headers: {
          'X-Cisco-Meraki-API-Key': apiKey,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new MerakiAPIError(`API request failed: ${response.status} ${response.statusText}`, response.status);
      }

      const devices = await response.json();
      // Filter only MS devices (switches)
      return devices.filter((device: any) => device.model && device.model.startsWith('MS'));
    } catch (error) {
      console.error('Error fetching devices:', error);
      
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        throw new MerakiAPIError(
          'Unable to connect to Meraki API. Backend proxy service required for production use.'
        );
      }
      
      throw error;
    }
  },

  async getSwitchPorts(serialNumber: string, apiKey: string) {
    if (!apiKey) {
      throw new MerakiAPIError('API key is required');
    }

    try {
      const response = await fetch(`${API_BASE_URL}/devices/${serialNumber}/switch/ports`, {
        headers: {
          'X-Cisco-Meraki-API-Key': apiKey,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new MerakiAPIError(`API request failed: ${response.status} ${response.statusText}`, response.status);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching switch ports:', error);
      
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        throw new MerakiAPIError(
          'Unable to connect to Meraki API. Backend proxy service required for production use.'
        );
      }
      
      throw error;
    }
  }
};
