import { ClerkProvider, ClerkLoaded, ClerkLoading } from "@clerk/clerk-react";

// Get the publishable key from environment variables
const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!clerkPubKey) {
  throw new Error("Missing Publishable Key. Please set VITE_CLERK_PUBLISHABLE_KEY in your .env file");
}

// Loading component
function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="flex flex-col items-center space-y-4">
        <div className="loading loading-spinner loading-lg"></div>
        <p className="text-lg">Loading...</p>
      </div>
    </div>
  );
}

// Main Clerk Provider component
export default function ClerkProviderWrapper({ children }) {
  console.log("ClerkProviderWrapper rendering with key:", clerkPubKey ? "Set" : "Not set");
  
  return (
    <ClerkProvider
      publishableKey={clerkPubKey}
      afterSignInUrl="/"
      afterSignUpUrl="/"
    >
      <ClerkLoading>
        <LoadingSpinner />
      </ClerkLoading>
      <ClerkLoaded>
        {children}
      </ClerkLoaded>
    </ClerkProvider>
  );
}
