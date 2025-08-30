import { nanoid } from "nanoid";

export const db = {
  users: [
    { id: "u_demo", name: "Demo User", email: "demo@nereus.app", password: "demo123" }
  ],
  incidents: [],
  alerts: [
    { id: nanoid(), title: "High Tide Advisory", description: "Tide expected +0.9m above MSL near Marine Drive.", location: "Mumbai, IN", severity: "Moderate", timestamp: Date.now() - 1000*60*30 },
    { id: nanoid(), title: "Storm Surge Risk", description: "IMD bulletin indicates possible surge in next 12h.", location: "Kolkata, IN", severity: "High", timestamp: Date.now() - 1000*60*90 },
    { id: nanoid(), title: "Algal Bloom Watch", description: "Chlorophyll-a spike detected in satellite pass.", location: "Panaji, IN", severity: "Low", timestamp: Date.now() - 1000*60*180 }
  ]
};
