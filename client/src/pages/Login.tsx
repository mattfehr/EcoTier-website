import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { routes } from "../utils/routes"; // ✅ import route helpers

export default function AuthForm() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [loginMode, setLoginMode] = useState<"email" | "username">("email");
  const [username, setUsername] = useState("");
  const [loginIdentifier, setLoginIdentifier] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isRegistering) {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;

        if (data.user) {
          const { error: dbError } = await supabase.from("users").insert({
            id: data.user.id,
            username,
            email,
          });
          if (dbError) throw dbError;
        }

        console.log("✅ Signed up & inserted into users");
      } else {
        let loginEmail = loginIdentifier;

        if (loginMode === "username") {
          const sessionCheck = await supabase.auth.getSession();
          console.log("🔐 Current session before username lookup:", sessionCheck);

          const { data: userRow, error: lookupError } = await supabase
            .from("users")
            .select("email")
            .eq("username", loginIdentifier)
            .single();

          console.log("🧪 userRow from username lookup:", userRow);

          if (lookupError || !userRow?.email) {
            throw lookupError || new Error("Username not found or missing email");
          }

          loginEmail = userRow.email;
        }

        const { error: loginError } = await supabase.auth.signInWithPassword({
          email: loginEmail,
          password,
        });

        if (loginError) {
          console.error("🔐 Login error:", loginError);
          throw loginError;
        }

        console.log("✅ Logged in");
      }

      navigate(routes.home); // ✅ now using route helper
    } catch (err: any) {
      console.error("❌ Auth error:", err);
      setError(err.message || "An unknown error occurred");
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

        {isRegistering ? (
          <>
            <input
              type="text"
              placeholder="Username"
              className="w-full p-2 border rounded-md"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full p-2 border rounded-md"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </>
        ) : (
          <>
            <div className="flex border-b">
              <button
                type="button"
                onClick={() => setLoginMode("email")}
                className={`flex-1 py-2 text-sm font-medium ${
                  loginMode === "email"
                    ? "border-b-2 border-green-600 text-green-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                With Email
              </button>
              <button
                type="button"
                onClick={() => setLoginMode("username")}
                className={`flex-1 py-2 text-sm font-medium ${
                  loginMode === "username"
                    ? "border-b-2 border-green-600 text-green-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                With Username
              </button>
            </div>

            <input
              type={loginMode === "email" ? "email" : "text"}
              placeholder={loginMode === "email" ? "Email" : "Username"}
              className="w-full p-2 border rounded-md"
              value={loginIdentifier}
              onChange={(e) => setLoginIdentifier(e.target.value)}
              required
            />
          </>
        )}

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
