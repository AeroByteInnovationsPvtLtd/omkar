import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { SignIn, SignUp } from "@clerk/clerk-react";

import AppLayout from "./layouts/app-layout";
import ProtectedRoute from "./components/protected-route";
import { ThemeProvider } from "./components/theme-provider";

import LandingPage from "./pages/landing";
import Onboarding from "./pages/onboarding";
import PostJob from "./pages/post-job";
import JobListing from "./pages/jobListing";
import MyJobs from "./pages/my-jobs";
import SavedJobs from "./pages/saved-jobs";
import JobPage from "./pages/job";

import "./App.css";

/* =========================
   ROUTER CONFIGURATION
========================= */

const router = createBrowserRouter([
  // 🔹 AUTH ROUTES (NO LAYOUT)
  {
    path: "/sign-in/*",
    element: (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <SignIn
          routing="path"
          path="/sign-in"
          signUpUrl="/sign-up"
          fallbackRedirectUrl="/onboarding"
        />
      </div>
    ),
  },
  {
    path: "/sign-up/*",
    element: (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <SignUp
          routing="path"
          path="/sign-up"
          signInUrl="/sign-in"
          fallbackRedirectUrl="/onboarding"
        />
      </div>
    ),
  },

  // 🔹 MAIN APPLICATION (WITH LAYOUT)
  {
    element: <AppLayout />,
    children: [
      { path: "/", element: <LandingPage /> },

      {
        path: "/onboarding",
        element: (
          <ProtectedRoute>
            <Onboarding />
          </ProtectedRoute>
        ),
      },

      {
        path: "/jobs",
        element: (
          <ProtectedRoute>
            <JobListing />
          </ProtectedRoute>
        ),
      },

      {
        path: "/post-job",
        element: (
          <ProtectedRoute>
            <PostJob />
          </ProtectedRoute>
        ),
      },

      {
        path: "/my-jobs",
        element: (
          <ProtectedRoute>
            <MyJobs />
          </ProtectedRoute>
        ),
      },

      {
        path: "/saved-jobs",
        element: (
          <ProtectedRoute>
            <SavedJobs />
          </ProtectedRoute>
        ),
      },

      {
        path: "/job/:id",
        element: (
          <ProtectedRoute>
            <JobPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

/* =========================
   APP ROOT
========================= */

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;