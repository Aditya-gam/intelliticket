import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function CheckAuth({ children, protected: isProtected }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (isProtected) {
      if (!token) {
        navigate("/login");
      } else {
        setLoading(false);
      }
    } else {
      // For non-protected routes (login/signup), don't redirect if already logged in
      // Allow users to access these pages even when authenticated
      setLoading(false);
    }
  }, [navigate, isProtected]);

  if (loading) {
    return <div>loading...</div>;
  }
  return children;
}

export default CheckAuth;
