import React, { useState } from "react";
import Layout from "@theme/Layout";
import { authClient } from "../lib/auth-client";
import { useHistory } from "@docusaurus/router";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const { siteConfig } = useDocusaurusContext();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await authClient.signIn.email({
        email,
        password,
      });

      if (error) {
        setError(error.message || "Login failed.");
      } else {
        if (data?.token) {
          localStorage.setItem("auth_token", data.token);
        } else if (data?.session?.token) {
          localStorage.setItem("auth_token", data.session.token);
        }

        setTimeout(() => {
          window.location.href = siteConfig.baseUrl;
        }, 100);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Login" description="Login to your account">
      <div
        style={{
          minHeight: "calc(100vh - 60px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "1rem",
          background:
            "linear-gradient(135deg, #0a0a0a 0%, #111111 50%, #0a0a0a 100%)",
          position: "relative",
          overflow: "hidden",
          fontFamily: "'Inter', sans-serif",
        }}
      >
        {/* Cyber Grid Background */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(to right, #1a1a1a 1px, transparent 1px),
                      linear-gradient(to bottom, #1a1a1a 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
            opacity: 0.2,
          }}
        ></div>

        {/* Neon Lines */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "1px",
            background:
              "linear-gradient(to right, transparent, #00f3ff, transparent)",
            animation: "scan 3s linear infinite",
          }}
        ></div>

        <div
          style={{
            width: "100%",
            maxWidth: "400px",
            position: "relative",
            zIndex: 10,
          }}
        >
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <h1
              style={{
                fontSize: "2.5rem",
                fontWeight: 900,
                background: "linear-gradient(135deg, #00f3ff, #9d00ff)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                marginBottom: "0.5rem",
                letterSpacing: "-0.02em",
              }}
            >
              ACCESS
            </h1>
            <p
              style={{
                color: "#666",
                fontSize: "0.875rem",
                textTransform: "uppercase",
                letterSpacing: "2px",
              }}
            >
              ROBOTIC CONTROL PANEL
            </p>
          </div>

          {/* Login Card */}
          <div style={{ position: "relative" }}>
            {/* Outer Glow */}
            <div
              style={{
                position: "absolute",
                inset: "-4px",
                background: "linear-gradient(135deg, #00f3ff, #9d00ff)",
                borderRadius: "1rem",
                filter: "blur(8px)",
                opacity: 0.3,
                transition: "opacity 0.3s",
              }}
            ></div>

            {/* Card */}
            <div
              style={{
                position: "relative",
                background: "rgba(26, 26, 26, 0.9)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "1rem",
                padding: "2rem",
                boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)",
              }}
            >
              <form
                onSubmit={handleLogin}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1.5rem",
                }}
              >
                {/* Email */}
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.875rem",
                      color: "#ccc",
                      marginBottom: "0.5rem",
                      fontWeight: 500,
                    }}
                  >
                    EMAIL
                  </label>
                  <input
                    type="email"
                    style={{
                      width: "100%",
                      padding: "0.875rem 1rem",
                      background: "rgba(255, 255, 255, 0.05)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      borderRadius: "0.75rem",
                      color: "#fff",
                      fontSize: "0.875rem",
                      transition: "all 0.2s",
                    }}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="user@robotics.ai"
                  />
                </div>

                {/* Password */}
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.875rem",
                      color: "#ccc",
                      marginBottom: "0.5rem",
                      fontWeight: 500,
                    }}
                  >
                    PASSWORD
                  </label>
                  <input
                    type="password"
                    style={{
                      width: "100%",
                      padding: "0.875rem 1rem",
                      background: "rgba(255, 255, 255, 0.05)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      borderRadius: "0.75rem",
                      color: "#fff",
                      fontSize: "0.875rem",
                      transition: "all 0.2s",
                    }}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                  />
                </div>

                {/* Error */}
                {error && (
                  <div
                    style={{
                      padding: "1rem",
                      background: "rgba(220, 38, 38, 0.1)",
                      border: "1px solid rgba(220, 38, 38, 0.3)",
                      borderRadius: "0.75rem",
                      color: "#fca5a5",
                      fontSize: "0.875rem",
                    }}
                  >
                    {error}
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  style={{
                    width: "100%",
                    padding: "1rem",
                    background: "linear-gradient(135deg, #0066ff, #9d00ff)",
                    border: "none",
                    borderRadius: "0.75rem",
                    color: "#fff",
                    fontWeight: 600,
                    fontSize: "0.875rem",
                    cursor: loading ? "not-allowed" : "pointer",
                    opacity: loading ? 0.7 : 1,
                    transition: "all 0.2s",
                  }}
                  disabled={loading}
                >
                  {loading ? (
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "0.5rem",
                      }}
                    >
                      <div
                        style={{
                          width: "1rem",
                          height: "1rem",
                          border: "2px solid rgba(255, 255, 255, 0.3)",
                          borderTopColor: "#fff",
                          borderRadius: "50%",
                          animation: "spin 1s linear infinite",
                        }}
                      ></div>
                      AUTHENTICATING...
                    </span>
                  ) : (
                    "LOGIN"
                  )}
                </button>

                {/* Register Link */}
                <div
                  style={{
                    textAlign: "center",
                    paddingTop: "1rem",
                    borderTop: "1px solid rgba(255, 255, 255, 0.1)",
                  }}
                >
                  <p style={{ color: "#666", fontSize: "0.875rem" }}>
                    NEW USER?{" "}
                    <a
                      href="/register"
                      style={{
                        color: "#00f3ff",
                        textDecoration: "none",
                        fontWeight: 600,
                      }}
                    >
                      REGISTER
                    </a>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>

        <style>
          {`
            @keyframes scan {
              0% { transform: translateX(-100%); }
              100% { transform: translateX(100%); }
            }
            
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
            
            input:focus {
              outline: none;
              border-color: #00f3ff !important;
              box-shadow: 0 0 0 2px rgba(0, 243, 255, 0.2);
            }
            
            button:hover:not(:disabled) {
              transform: translateY(-2px);
              box-shadow: 0 10px 20px rgba(0, 102, 255, 0.3);
            }
            
            a:hover {
              opacity: 0.8;
            }
          `}
        </style>
      </div>
    </Layout>
  );
}
