import React, { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

const AIChatBot = lazy(() => import("../page/AIChatBot"));
const UserProfile = lazy(() => import("../page/UserProfile"));
const Contact = lazy(() => import("../../email/components/Contact"));
const Protected = lazy(() => import("../../auth/components/Protected"));
const AiRoutes = () => {
  return (
    <Suspense fallback={null}>
      <Routes>
        <Route path="/" element={<AIChatBot />} />
        <Route
          path="/profile"
          element={
            <Protected>
              <UserProfile />
            </Protected>
          }
        />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </Suspense>
  );
};

export default AiRoutes;