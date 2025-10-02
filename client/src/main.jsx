import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import ClerkProviderWrapper from "./components/clerk-provider.jsx";
import { ProtectedRoute, PublicRoute, ClerkSignIn, ClerkSignUp } from "./components/clerk-auth.jsx";
import Tickets from "./pages/tickets.jsx";
import TicketDetailsPage from "./pages/ticket.jsx";
import Admin from "./pages/admin.jsx";
// Import test utilities for development
import "./utils/test-auth-flow.js";

// Debug: Log environment variables
console.log("Environment check:", {
  VITE_SERVER_URL: import.meta.env.VITE_SERVER_URL,
  VITE_CLERK_PUBLISHABLE_KEY: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY ? "Set" : "Not set"
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ClerkProviderWrapper>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Tickets />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tickets/:id"
            element={
              <ProtectedRoute>
                <TicketDetailsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/sign-in"
            element={
              <PublicRoute>
                <ClerkSignIn />
              </PublicRoute>
            }
          />
          <Route
            path="/sign-up"
            element={
              <PublicRoute>
                <ClerkSignUp />
              </PublicRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly={true}>
                <Admin />
              </ProtectedRoute>
            }
          />
          {/* Legacy routes for backward compatibility */}
          <Route path="/login" element={<Navigate to="/sign-in" replace />} />
          <Route path="/signup" element={<Navigate to="/sign-up" replace />} />
        </Routes>
      </BrowserRouter>
    </ClerkProviderWrapper>
  </StrictMode>
);
