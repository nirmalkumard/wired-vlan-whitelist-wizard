
// Mock Meraki API implementation for demonstration
// In a real implementation, you would use actual Meraki API endpoints with proper authentication

export const merakiApi = {
  async getOrganizations() {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock data - replace with actual API call
    return [
      { id: "org1", name: "Acme Corporation" },
      { id: "org2", name: "TechCorp Industries" },
      { id: "org3", name: "Global Networks Ltd" },
      { id: "org4", name: "Enterprise Solutions Inc" }
    ];
  },

  async getNetworks(organizationId: string) {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mock data - replace with actual API call
    const networksByOrg = {
      "org1": [
        { id: "net1", name: "Headquarters" },
        { id: "net2", name: "Branch Office - NYC" },
        { id: "net3", name: "Warehouse - Chicago" }
      ],
      "org2": [
        { id: "net4", name: "Main Campus" },
        { id: "net5", name: "Research Lab" },
        { id: "net6", name: "Data Center" }
      ],
      "org3": [
        { id: "net7", name: "London Office" },
        { id: "net8", name: "Paris Office" },
        { id: "net9", name: "Berlin Office" }
      ],
      "org4": [
        { id: "net10", name: "Corporate HQ" },
        { id: "net11", name: "Manufacturing" },
        { id: "net12", name: "Distribution Center" }
      ]
    };
    
    return networksByOrg[organizationId as keyof typeof networksByOrg] || [];
  },

  async getDevices(organizationId: string) {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    // Mock data - replace with actual API call
    const devicesByOrg = {
      "org1": [
        { serial: "Q2XX-XXXX-XX01", name: "Main Switch 1", model: "MS250-24" },
        { serial: "Q2XX-XXXX-XX02", name: "Main Switch 2", model: "MS250-48" },
        { serial: "Q2XX-XXXX-XX03", name: "Access Switch 1", model: "MS120-24" }
      ],
      "org2": [
        { serial: "Q2XX-XXXX-XX04", name: "Core Switch", model: "MS350-24X" },
        { serial: "Q2XX-XXXX-XX05", name: "Lab Switch", model: "MS220-24" },
        { serial: "Q2XX-XXXX-XX06", name: "DC Switch", model: "MS390-24" }
      ],
      "org3": [
        { serial: "Q2XX-XXXX-XX07", name: "London Core", model: "MS250-24" },
        { serial: "Q2XX-XXXX-XX08", name: "Paris Access", model: "MS120-48" },
        { serial: "Q2XX-XXXX-XX09", name: "Berlin Dist", model: "MS220-24" }
      ],
      "org4": [
        { serial: "Q2XX-XXXX-XX10", name: "HQ Core Switch", model: "MS350-48" },
        { serial: "Q2XX-XXXX-XX11", name: "Mfg Floor Switch", model: "MS250-24" },
        { serial: "Q2XX-XXXX-XX12", name: "Warehouse Switch", model: "MS120-24" }
      ]
    };
    
    return devicesByOrg[organizationId as keyof typeof devicesByOrg] || [];
  },

  async getSwitchPorts(serialNumber: string) {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // Mock data - replace with actual API call
    // Generate ports based on switch model from serial
    const ports = [];
    const portCount = serialNumber.includes("48") ? 48 : 24;
    
    for (let i = 1; i <= portCount; i++) {
      ports.push({
        portId: i.toString(),
        name: `Port ${i}`,
        enabled: true,
        type: "access"
      });
    }
    
    return ports;
  }
};

// In a real implementation, you would configure the API like this:
/*
import axios from 'axios';

const API_BASE_URL = 'https://api.meraki.com/api/v1';
const API_KEY = process.env.MERAKI_API_KEY; // Store in environment variables

const merakiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'X-Cisco-Meraki-API-Key': API_KEY,
    'Content-Type': 'application/json'
  }
});

export const merakiApi = {
  async getOrganizations() {
    const response = await merakiClient.get('/organizations');
    return response.data;
  },

  async getNetworks(organizationId: string) {
    const response = await merakiClient.get(`/organizations/${organizationId}/networks`);
    return response.data;
  },

  async getDevices(organizationId: string) {
    const response = await merakiClient.get(`/organizations/${organizationId}/devices`);
    // Filter for switches
    return response.data.filter(device => 
      device.model && device.model.includes('MS')
    );
  },

  async getSwitchPorts(serialNumber: string) {
    const response = await merakiClient.get(`/devices/${serialNumber}/switch/ports`);
    return response.data;
  }
};
*/
