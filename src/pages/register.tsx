import React, { useState } from "react";
import Layout from "@theme/Layout";
import { authClient } from "../lib/auth-client";
import { useHistory } from "@docusaurus/router";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const { siteConfig } = useDocusaurusContext();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 500000) {
        setError("Image too large. Max 500KB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await authClient.signUp.email({
        email,
        password,
        name,
        image,
      });

      if (error) {
        setError(error.message || "Registration failed.");
      } else {
        history.push(siteConfig.baseUrl);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Register" description="Create an account">
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
        {/* Cyber Grid */}
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

        {/* Neon Border */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "1px",
            background:
              "linear-gradient(to right, transparent, #9d00ff, transparent)",
            animation: "pulse 2s ease-in-out infinite",
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
                background: "linear-gradient(135deg, #9d00ff, #00f3ff)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                marginBottom: "0.5rem",
                letterSpacing: "-0.02em",
              }}
            >
              REGISTER
            </h1>
            <p
              style={{
                color: "#666",
                fontSize: "0.875rem",
                textTransform: "uppercase",
                letterSpacing: "2px",
              }}
            >
              JOIN ROBOTICS AI
            </p>
          </div>

          {/* Register Card */}
          <div style={{ position: "relative" }}>
            {/* Glow Effect */}
            <div
              style={{
                position: "absolute",
                inset: "-4px",
                background: "linear-gradient(135deg, #9d00ff, #00f3ff)",
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
                onSubmit={handleRegister}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1.25rem",
                }}
              >
                {/* Name */}
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
                    FULL NAME
                  </label>
                  <input
                    type="text"
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
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Enter your name"
                  />
                </div>

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
                    minLength={8}
                    placeholder="••••••••"
                  />
                </div>

                {/* Profile Picture */}
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
                    PROFILE IMAGE
                  </label>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "1rem",
                    }}
                  >
                    {image && (
                      <div
                        style={{
                          width: "3rem",
                          height: "3rem",
                          borderRadius: "50%",
                          overflow: "hidden",
                          border: "2px solid rgba(0, 243, 255, 0.3)",
                        }}
                      >
                        <img
                          src={image}
                          alt="Preview"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      </div>
                    )}
                    <label style={{ flex: 1, cursor: "pointer" }}>
                      <div
                        style={{
                          padding: "0.875rem 1rem",
                          background: "rgba(255, 255, 255, 0.05)",
                          border: "1px solid rgba(255, 255, 255, 0.1)",
                          borderRadius: "0.75rem",
                          color: image ? "#fff" : "#666",
                          fontSize: "0.875rem",
                          textAlign: "center",
                          transition: "all 0.2s",
                        }}
                      >
                        {image ? "Change Image" : "Upload Image"}
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={handleImageChange}
                      />
                    </label>
                  </div>
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

                {/* Terms */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "0.75rem",
                  }}
                >
                  <input
                    id="terms"
                    type="checkbox"
                    style={{
                      marginTop: "0.25rem",
                      accentColor: "#00f3ff",
                    }}
                    required
                  />
                  <label
                    htmlFor="terms"
                    style={{
                      color: "#999",
                      fontSize: "0.875rem",
                      lineHeight: 1.4,
                    }}
                  >
                    I agree to the{" "}
                    <a
                      href="#"
                      style={{ color: "#00f3ff", textDecoration: "none" }}
                    >
                      Terms and Conditions
                    </a>
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  style={{
                    width: "100%",
                    padding: "1rem",
                    background: "linear-gradient(135deg, #9d00ff, #0066ff)",
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
                      CREATING ACCOUNT...
                    </span>
                  ) : (
                    "REGISTER"
                  )}
                </button>

                {/* Login Link */}
                <div
                  style={{
                    textAlign: "center",
                    paddingTop: "1rem",
                    borderTop: "1px solid rgba(255, 255, 255, 0.1)",
                  }}
                >
                  <p style={{ color: "#666", fontSize: "0.875rem" }}>
                    ALREADY HAVE AN ACCOUNT?{" "}
                    <a
                      href="/login"
                      style={{
                        color: "#00f3ff",
                        textDecoration: "none",
                        fontWeight: 600,
                      }}
                    >
                      LOGIN
                    </a>
                  </p>
                </div>
              </form>
            </div>
          </div>

          {/* Footer */}
          <div
            style={{
              textAlign: "center",
              marginTop: "1.5rem",
              color: "#555",
              fontSize: "0.75rem",
              letterSpacing: "1px",
            }}
          >
            <span>ROBOTICS AI SYSTEMS</span>
          </div>
        </div>

        <style>
          {`
            @keyframes pulse {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.5; }
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
              box-shadow: 0 10px 20px rgba(157, 0, 255, 0.3);
            }
            
            label:hover > div {
              border-color: rgba(0, 243, 255, 0.3);
              color: #fff;
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
