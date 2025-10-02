import { SignIn, SignUp, UserButton, useUser, useAuth } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";

// Sign In Component
export function ClerkSignIn() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-full max-w-md shadow-xl bg-base-100">
        <div className="card-body">
          <h2 className="card-title justify-center mb-4">Sign In</h2>
          <SignIn 
            appearance={{
              elements: {
                formButtonPrimary: "btn btn-primary w-full",
                card: "shadow-none",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
                socialButtonsBlockButton: "btn btn-outline w-full mb-2",
                formFieldInput: "input input-bordered w-full",
                footerActionLink: "link link-primary",
              }
            }}
            redirectUrl="/"
          />
        </div>
      </div>
    </div>
  );
}

// Sign Up Component
export function ClerkSignUp() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-full max-w-md shadow-xl bg-base-100">
        <div className="card-body">
          <h2 className="card-title justify-center mb-4">Sign Up</h2>
          <SignUp 
            appearance={{
              elements: {
                formButtonPrimary: "btn btn-primary w-full",
                card: "shadow-none",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
                socialButtonsBlockButton: "btn btn-outline w-full mb-2",
                formFieldInput: "input input-bordered w-full",
                footerActionLink: "link link-primary",
              }
            }}
            redirectUrl="/"
          />
        </div>
      </div>
    </div>
  );
}

// User Profile Button Component
export function ClerkUserButton() {
  return (
    <UserButton 
      appearance={{
        elements: {
          avatarBox: "w-8 h-8",
          userButtonPopoverCard: "bg-base-100 border border-base-300",
          userButtonPopoverActionButton: "text-base-content hover:bg-base-200",
          userButtonPopoverActionButtonText: "text-base-content",
        }
      }}
      afterSignOutUrl="/sign-in"
    />
  );
}

// Protected Route Component
export function ProtectedRoute({ children, adminOnly = false }) {
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();

  console.log("ProtectedRoute state:", { isSignedIn, isLoaded, user: user?.id });

  // Show loading while Clerk is initializing
  if (!isLoaded) {
    console.log("Clerk not loaded yet, showing loading spinner");
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <div className="flex flex-col items-center space-y-4">
          <div className="loading loading-spinner loading-lg"></div>
          <p className="text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to sign in if not authenticated
  if (!isSignedIn) {
    return <Navigate to="/sign-in" replace />;
  }

  // Check admin role if required
  if (adminOnly && user?.publicMetadata?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-lg mb-4">You need admin privileges to access this page.</p>
          <a href="/" className="btn btn-primary">Go Home</a>
        </div>
      </div>
    );
  }

  return children;
}

// Public Route Component (redirects if already signed in)
export function PublicRoute({ children }) {
  const { isSignedIn, isLoaded } = useAuth();

  // Show loading while Clerk is initializing
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <div className="flex flex-col items-center space-y-4">
          <div className="loading loading-spinner loading-lg"></div>
          <p className="text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to home if already signed in
  if (isSignedIn) {
    return <Navigate to="/" replace />;
  }

  return children;
}
