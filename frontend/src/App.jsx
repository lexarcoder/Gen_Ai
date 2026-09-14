import React from 'react'
import AiRoutes from './Chat/routes/AiRoutes';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from './store/userContext';
import AuthRoutes from "./auth/routes/AuthRouter"
function App() {
  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <AuthRoutes/>
          <AiRoutes />
        </AuthProvider>
      </BrowserRouter>
    </>
  );
}

export default App
