
// Mock Meraki API implementation for demonstration
// In a real implementation, you would use actual Meraki API endpoints with proper authentication

const API_KEY = "d0d45bd7c3fb27eb517c9ae209e5c20dab91fc5d";
const API_BASE_URL = "https://api.meraki.com/api/v1";

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

  async getWirelessSSIDs(networkId: string) {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // Mock data - replace with actual API call
    return [
      { number: 0, name: "Corporate WiFi", enabled: true },
      { number: 1, name: "Guest Network", enabled: true },
      { number: 2, name: "IoT Devices", enabled: true },
      { number: 3, name: "Employee WiFi", enabled: false }
    ].filter(ssid => ssid.enabled);
  },

  async getNetworkDevices(networkId: string) {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock data - replace with actual API call - only MS devices
    const devicesByNetwork = {
      "net1": [
        { serial: "Q2XX-XXXX-XX01", name: "Main Switch 1", model: "MS250-24" },
        { serial: "Q2XX-XXXX-XX02", name: "Main Switch 2", model: "MS250-48" },
        { serial: "Q2XX-XXXX-XX03", name: "Access Switch 1", model: "MS120-24" }
      ],
      "net2": [
        { serial: "Q2XX-XXXX-XX04", name: "NYC Core Switch", model: "MS350-24X" },
        { serial: "Q2XX-XXXX-XX05", name: "NYC Access Switch", model: "MS220-24" }
      ],
      "net3": [
        { serial: "Q2XX-XXXX-XX06", name: "Warehouse Switch", model: "MS390-24" }
      ]
    };
    
    const devices = devicesByNetwork[networkId as keyof typeof devicesByNetwork] || [];
    // Filter only MS devices
    return devices.filter(device => device.model && device.model.startsWith('MS'));
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
