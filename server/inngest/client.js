import { Inngest } from "inngest";

// Configure Inngest for both development and production
const inngestConfig = {
  id: "ticketing-system",
  // Use event key for production, fallback to local development
  ...(process.env.INNGEST_EVENT_KEY && { 
    eventKey: process.env.INNGEST_EVENT_KEY 
  }),
  // Add signing key for webhook verification in production
  ...(process.env.INNGEST_SIGNING_KEY && {
    signingKey: process.env.INNGEST_SIGNING_KEY
  })
};

export const inngest = new Inngest(inngestConfig);
