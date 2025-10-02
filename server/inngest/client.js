import { Inngest } from "inngest";

// Configure Inngest for local development
// In production, you would set INNGEST_EVENT_KEY environment variable
const inngestConfig = {
  id: "ticketing-system",
  // For local development, we can use a mock event key or disable cloud features
  ...(process.env.INNGEST_EVENT_KEY && { 
    eventKey: process.env.INNGEST_EVENT_KEY 
  })
};

export const inngest = new Inngest(inngestConfig);
