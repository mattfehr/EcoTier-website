// src/pages/Login.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function AuthForm() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // 👈 for redirecting

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isRegistering) {
        // 🆕 Sign up
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        console.log("✅ Signed up");
      } else {
        // 🔑 Log in
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        console.log("✅ Logged in");
      }

      // ✅ Redirect to home after success
      navigate("/");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[70vh]">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white shadow-md rounded-lg p-6 space-y-4"
      >
        <h1 className="text-xl font-bold text-center">
          {isRegistering ? "Sign Up" : "Log In"}
        </h1>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border rounded-md"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border rounded-md"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full ${
            isRegistering
              ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
              : "bg-green-600 text-white hover:bg-green-700"
          } py-2 rounded-md`}
        >
          {loading
            ? isRegistering
              ? "Signing up..."
              : "Logging in..."
            : isRegistering
            ? "Sign Up"
            : "Log In"}
        </button>

        <button
          type="button"
          onClick={() => setIsRegistering((prev) => !prev)}
          className="w-full text-sm text-blue-600 hover:underline"
        >
          {isRegistering
            ? "Already have an account? Log In"
            : "Need an account? Sign Up"}
        </button>
      </form>
    </div>
  );
}
