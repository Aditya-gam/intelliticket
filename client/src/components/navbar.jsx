import { Link } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { ClerkUserButton } from "./clerk-auth.jsx";

export default function Navbar() {
  const { user, isSignedIn } = useUser();

  return (
    <div className="navbar bg-base-200">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost text-xl">
          Ticket AI
        </Link>
      </div>
      <div className="flex gap-2 items-center">
        {!isSignedIn ? (
          <>
            <Link to="/sign-up" className="btn btn-sm">
              Sign Up
            </Link>
            <Link to="/sign-in" className="btn btn-sm">
              Sign In
            </Link>
          </>
        ) : (
          <>
            <span className="text-sm">
              Hi, {user?.firstName || user?.emailAddresses?.[0]?.emailAddress}
            </span>
            {user?.publicMetadata?.role === "admin" && (
              <Link to="/admin" className="btn btn-sm">
                Admin
              </Link>
            )}
            <ClerkUserButton />
          </>
        )}
      </div>
    </div>
  );
}
