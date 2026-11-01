import { useState } from "react";
import type { FormEvent } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  UtensilsCrossed,
  UserRound,
} from "lucide-react";
import { API_BASE_URL } from "./api";
import "./LoginPage.css";

export type AuthUser = {
  id: number | string;
  name: string;
  email: string;
};

type LoginPageProps = {
  onBack: () => void;
  onAuthenticated: (user: AuthUser) => void;
};

type AuthResponse = {
  message?: string;
  user?: AuthUser;
};

export default function LoginPage({ onBack, onAuthenticated }: LoginPageProps) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function changeMode(nextMode: "login" | "register") {
    setMode(nextMode);
    setError("");
    setSuccess("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (mode === "register" && password !== confirmPassword) {
      setError("Passwords do not match. Please check them and try again.");
      return;
    }

    if (mode === "register" && password.length < 8) {
      setError("Please use a password with at least 8 characters.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(
          mode === "register"
            ? { name: name.trim(), email: email.trim().toLowerCase(), password }
            : { email: email.trim().toLowerCase(), password }
        ),
      });

      const data = (await response.json().catch(() => ({}))) as AuthResponse;

      if (!response.ok) {
        throw new Error(data.message || "Unable to sign in. Please try again.");
      }

      if (!data.user) {
        throw new Error("The server response was incomplete. Please try again.");
      }

      setSuccess(mode === "register" ? "Account created successfully." : "Signed in successfully.");
      onAuthenticated(data.user);
    } catch (caughtError) {
      const message =
        caughtError instanceof TypeError
          ? "Could not connect to the backend. Start the Express server and PostgreSQL, then try again."
          : caughtError instanceof Error
            ? caughtError.message
            : "Something went wrong. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="cb-login-screen" role="dialog" aria-modal="true" aria-labelledby="cb-login-title">
      <div className="cb-login-left">
        <div className="cb-login-brand">
          <span className="cb-login-brand-icon"><UtensilsCrossed size={25} /></span>
          <span>Crave<span>Buddy</span></span>
        </div>

        <button type="button" className="cb-login-back cb-login-back-mobile" onClick={onBack}>
          <ArrowLeft size={16} /> Back to menu
        </button>

        <div className="cb-login-hero-copy">
          <span className="cb-login-eyebrow">GOOD FOOD. GOOD MOOD.</span>
          <h1>Every craving has a <span>happy place.</span></h1>
          <p>Sign in to keep your favourites close, build your own thali and make every meal count.</p>
          <div className="cb-login-perks">
            <span><CheckCircle2 size={17} /> Your favourite meals in one place</span>
            <span><CheckCircle2 size={17} /> Build a thali your way</span>
            <span><CheckCircle2 size={17} /> Track your orders with ease</span>
          </div>
        </div>

        <div className="cb-login-food-art" aria-hidden="true">
          <div className="cb-login-food-orbit cb-login-food-orbit-one" />
          <div className="cb-login-food-orbit cb-login-food-orbit-two" />
          <img
            src="https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=85"
            alt=""
          />
          <span className="cb-login-floating cb-login-floating-top">🍛 Made for your cravings</span>
          <span className="cb-login-floating cb-login-floating-bottom">🥗 Fresh picks, happy bites</span>
        </div>

        <div className="cb-login-left-footer">A little joy, delivered on a plate.</div>
      </div>

      <div className="cb-login-right">
        <button type="button" className="cb-login-back cb-login-back-desktop" onClick={onBack}>
          <ArrowLeft size={16} /> Back to menu
        </button>

        <div className="cb-login-form-wrap">
          <div className="cb-login-mobile-brand">
            <span className="cb-login-brand-icon"><UtensilsCrossed size={23} /></span>
            <span>Crave<span>Buddy</span></span>
          </div>

          <div className="cb-login-tabs" aria-label="Login or create account">
            <button
              type="button"
              className={mode === "login" ? "active" : ""}
              onClick={() => changeMode("login")}
            >
              Login
            </button>
            <button
              type="button"
              className={mode === "register" ? "active" : ""}
              onClick={() => changeMode("register")}
            >
              Create account
            </button>
          </div>

          <div className="cb-login-heading">
            <span className="cb-login-small-eyebrow">WELCOME TO CRAVEBUDDY</span>
            <h2 id="cb-login-title">{mode === "login" ? "Welcome back!" : "Create your account"}</h2>
            <p>
              {mode === "login"
                ? "Sign in to pick up where your cravings left off."
                : "Join us and start building your perfect meal."}
            </p>
          </div>

          <form className="cb-login-form" onSubmit={handleSubmit}>
            {mode === "register" && (
              <label className="cb-login-field">
                <span>Full name</span>
                <div className="cb-login-input-wrap">
                  <UserRound size={18} />
                  <input
                    type="text"
                    autoComplete="name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Enter your full name"
                    minLength={2}
                    required
                  />
                </div>
              </label>
            )}

            <label className="cb-login-field">
              <span>Email address</span>
              <div className="cb-login-input-wrap">
                <Mail size={18} />
                <input
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </div>
            </label>

            <label className="cb-login-field">
              <span>Password</span>
              <div className="cb-login-input-wrap">
                <LockKeyhole size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  autoComplete={mode === "register" ? "new-password" : "current-password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder={mode === "register" ? "At least 8 characters" : "Enter your password"}
                  minLength={mode === "register" ? 8 : undefined}
                  required
                />
                <button
                  type="button"
                  className="cb-login-show-password"
                  onClick={() => setShowPassword((shown) => !shown)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </label>

            {mode === "register" && (
              <label className="cb-login-field">
                <span>Confirm password</span>
                <div className="cb-login-input-wrap">
                  <LockKeyhole size={18} />
                  <input
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    placeholder="Enter your password again"
                    minLength={8}
                    required
                  />
                </div>
              </label>
            )}

            {error && <div className="cb-login-alert cb-login-alert-error" role="alert">{error}</div>}
            {success && <div className="cb-login-alert cb-login-alert-success" role="status">{success}</div>}

            <button type="submit" className="cb-login-submit" disabled={loading}>
              {loading ? "Please wait..." : mode === "login" ? "Login to CraveBuddy" : "Create my account"}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          <div className="cb-login-switch">
            {mode === "login" ? "New to CraveBuddy?" : "Already have an account?"}{" "}
            <button type="button" onClick={() => changeMode(mode === "login" ? "register" : "login")}>
              {mode === "login" ? "Create an account" : "Login instead"}
            </button>
          </div>

          <div className="cb-login-security-note">
            <LockKeyhole size={14} /> Your password is securely hashed on the server.
          </div>
        </div>

        <div className="cb-login-right-footer">© 2026 CraveBuddy · Food made more joyful</div>
      </div>
    </div>
  );
}
