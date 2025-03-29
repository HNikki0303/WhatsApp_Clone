import React from "react";
import { Navigate } from "react-router-dom";

function Protected_Route({ isLoggedIn, children }) {
  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }
  return children;
}

export default Protected_Route;
