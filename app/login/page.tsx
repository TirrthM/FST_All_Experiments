"use client";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";

export default function LoginPage() {
  const [loading, setLoading] = useState<string | null>(null);

  const handleLogin = async (provider: "github" | "google") => {
    setLoading(provider);
    try {
      const { data, error } = await authClient.signIn.social({
        provider,
        callbackURL: "/", // Redirect after login
      });
      
      if (error) {
        alert(`Login failed: ${error.message || "Please check server console and .env configuration."}`);
      }
    } catch (error: any) {
      console.error(error);
      alert(`An error occurred: ${error.message}`);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-md border border-gray-100">
        <h2 className="text-3xl font-bold text-center text-gray-900">
          Sign In
        </h2>

        <div className="space-y-4 pt-4">
          <button
            onClick={() => handleLogin("google")}
            disabled={loading !== null}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-700 hover:bg-gray-50 font-medium transition-colors disabled:opacity-50"
          >
            {loading === "google" ? "Connecting..." : "Continue with Google"}
          </button>

          <button
            onClick={() => handleLogin("github")}
            disabled={loading !== null}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-transparent rounded-lg shadow-sm text-white bg-gray-900 hover:bg-gray-800 font-medium transition-colors disabled:opacity-50"
          >
            {loading === "github" ? "Connecting..." : "Continue with GitHub"}
          </button>
        </div>
      </div>
    </div>
  );
}
