
// Meraki API implementation with secure API key handling
// Users must provide their own API key for authentication

const API_BASE_URL = "https://api.meraki.com/api/v1";

export const merakiApi = {
  async getOrganizations(apiKey: string) {
    if (!apiKey) {
      throw new Error('API key is required');
    }

    try {
      const response = await fetch(`${API_BASE_URL}/organizations`, {
        headers: {
          'X-Cisco-Meraki-API-Key': apiKey,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching organizations:', error);
      throw error;
    }
  },

  async getNetworks(organizationId: string, apiKey: string) {
    if (!apiKey) {
      throw new Error('API key is required');
    }

    try {
      const response = await fetch(`${API_BASE_URL}/organizations/${organizationId}/networks`, {
        headers: {
          'X-Cisco-Meraki-API-Key': apiKey,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching networks:', error);
      throw error;
    }
  },

  async getWirelessSSIDs(networkId: string, apiKey: string) {
    if (!apiKey) {
      throw new Error('API key is required');
    }

    try {
      const response = await fetch(`${API_BASE_URL}/networks/${networkId}/wireless/ssids`, {
        headers: {
          'X-Cisco-Meraki-API-Key': apiKey,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      const ssids = await response.json();
      return ssids.filter((ssid: any) => ssid.enabled);
    } catch (error) {
      console.error('Error fetching SSIDs:', error);
      throw error;
    }
  },

  async getNetworkDevices(networkId: string, apiKey: string) {
    if (!apiKey) {
      throw new Error('API key is required');
    }

    try {
      const response = await fetch(`${API_BASE_URL}/networks/${networkId}/devices`, {
        headers: {
          'X-Cisco-Meraki-API-Key': apiKey,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      const devices = await response.json();
      // Filter only MS devices (switches)
      return devices.filter((device: any) => device.model && device.model.startsWith('MS'));
    } catch (error) {
      console.error('Error fetching devices:', error);
      throw error;
    }
  },

  async getSwitchPorts(serialNumber: string, apiKey: string) {
    if (!apiKey) {
      throw new Error('API key is required');
    }

    try {
      const response = await fetch(`${API_BASE_URL}/devices/${serialNumber}/switch/ports`, {
        headers: {
          'X-Cisco-Meraki-API-Key': apiKey,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching switch ports:', error);
      throw error;
    }
  }
};
