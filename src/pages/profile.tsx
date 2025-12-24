import React from "react";
import Layout from "@theme/Layout";
import { authClient } from "../lib/auth-client";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Link from "@docusaurus/Link";

export default function Profile() {
  const { siteConfig } = useDocusaurusContext();
  const { data: session, isPending, error } = authClient.useSession();

  // Loading State
  if (isPending) {
    return (
      <Layout title="Profile" noFooter>
        <div
          style={{
            minHeight: "calc(100vh - 60px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background:
              "linear-gradient(135deg, #0a0a0a 0%, #111111 50%, #0a0a0a 100%)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Animated Background */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(45deg, #00f3ff22, #9d00ff22)",
              animation: "pulse 2s ease-in-out infinite",
            }}
          ></div>

          <div
            style={{
              width: "3rem",
              height: "3rem",
              border: "3px solid rgba(0, 243, 255, 0.3)",
              borderTopColor: "#00f3ff",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
            }}
          ></div>
        </div>
        <style>{`
          @keyframes pulse { 
            0%, 100% { opacity: 0.2; } 
            50% { opacity: 0.4; } 
          }
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
      </Layout>
    );
  }

  // Not Logged In State
  if (!session) {
    return (
      <Layout title="Profile Not Found" noFooter>
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
          }}
        >
          {/* Grid Background */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `linear-gradient(to right, #1a1a1a 1px, transparent 1px),
                        linear-gradient(to bottom, #1a1a1a 1px, transparent 1px)`,
              backgroundSize: "50px 50px",
              opacity: 0.1,
            }}
          ></div>

          {/* Sad Robot SVG */}
          <div
            style={{
              position: "absolute",
              top: "20%",
              left: "10%",
              opacity: 0.1,
              transform: "scale(2)",
            }}
          >
            <svg width="100" height="100" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="#333"
                stroke="#666"
                strokeWidth="2"
              />
              <circle cx="35" cy="40" r="5" fill="#00f3ff" />
              <circle cx="65" cy="40" r="5" fill="#00f3ff" />
              <path
                d="M40,65 Q50,75 60,65"
                stroke="#9d00ff"
                strokeWidth="3"
                fill="none"
              />
              <circle cx="50" cy="30" r="3" fill="#666" />
            </svg>
          </div>

          <div
            style={{
              textAlign: "center",
              position: "relative",
              zIndex: 10,
              maxWidth: "500px",
            }}
          >
            <div
              style={{
                width: "5rem",
                height: "5rem",
                margin: "0 auto 2rem",
                background: "linear-gradient(135deg, #ff5555, #ff3366)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                animation: "bounce 1s ease-in-out infinite alternate",
              }}
            >
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#fff"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>

            <h1
              style={{
                fontSize: "2.5rem",
                fontWeight: 900,
                background: "linear-gradient(135deg, #ff5555, #ff3366)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                marginBottom: "1rem",
              }}
            >
              Access Required
            </h1>

            <p
              style={{
                color: "#aaa",
                fontSize: "1.125rem",
                marginBottom: "2rem",
                lineHeight: 1.6,
              }}
            >
              Please sign in to view your robotic profile and access the
              dashboard.
            </p>

            <div
              style={{ display: "flex", gap: "1rem", justifyContent: "center" }}
            >
              <button
                onClick={async () => {
                  await authClient.signIn.social({
                    provider: "google",
                    callbackURL: "/profile",
                  });
                  window.location.href = "/profile";
                }}
                style={{
                  padding: "1rem 2rem",
                  background: "linear-gradient(135deg, #0066ff, #9d00ff)",
                  border: "none",
                  borderRadius: "0.75rem",
                  color: "#fff",
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  transition: "all 0.2s",
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                Sign In
              </button>

              <Link
                to="/"
                style={{
                  padding: "1rem 2rem",
                  background: "transparent",
                  border: "1px solid #444",
                  borderRadius: "0.75rem",
                  color: "#ddd",
                  fontWeight: 600,
                  textDecoration: "none",
                  transition: "all 0.2s",
                }}
              >
                Go Home
              </Link>
            </div>
          </div>
          <style>{`
            @keyframes bounce { 
              0% { transform: translateY(0); } 
              100% { transform: translateY(-10px); } 
            }
            button:hover { transform: translateY(-2px); box-shadow: 0 10px 20px rgba(0, 102, 255, 0.3); }
            a:hover { background: rgba(255, 255, 255, 0.1); border-color: #666; }
          `}</style>
        </div>
      </Layout>
    );
  }

  // Main Profile Page
  return (
    <Layout title={`${session.user.name} - Profile`} noFooter>
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
            opacity: 0.1,
          }}
        ></div>

        {/* Floating Robot */}
        <div
          style={{
            position: "absolute",
            right: "10%",
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 1,
            animation: "float 6s ease-in-out infinite",
          }}
        >
          <svg
            width="200"
            height="300"
            viewBox="0 0 200 300"
            style={{ filter: "drop-shadow(0 0 20px rgba(0, 243, 255, 0.3))" }}
          >
            {/* Robot Body */}
            <rect
              x="50"
              y="100"
              width="100"
              height="120"
              rx="20"
              fill="#222"
              stroke="#00f3ff"
              strokeWidth="3"
            />

            {/* Head */}
            <circle
              cx="100"
              cy="80"
              r="30"
              fill="#222"
              stroke="#9d00ff"
              strokeWidth="3"
            />

            {/* Eyes */}
            <circle cx="85" cy="75" r="8" fill="#00f3ff">
              <animate
                attributeName="r"
                values="8;5;8"
                dur="2s"
                repeatCount="indefinite"
              />
            </circle>
            <circle cx="115" cy="75" r="8" fill="#00f3ff">
              <animate
                attributeName="r"
                values="8;5;8"
                dur="2s"
                repeatCount="indefinite"
              />
            </circle>

            {/* Antenna */}
            <line
              x1="100"
              y1="50"
              x2="100"
              y2="30"
              stroke="#9d00ff"
              strokeWidth="2"
            >
              <animate
                attributeName="y2"
                values="30;35;30"
                dur="1s"
                repeatCount="indefinite"
              />
            </line>
            <circle cx="100" cy="28" r="6" fill="#ff3366">
              <animate
                attributeName="fill"
                values="#ff3366;#ffcc00;#ff3366"
                dur="3s"
                repeatCount="indefinite"
              />
            </circle>

            {/* Mouth */}
            <path
              d="M80,85 Q100,95 120,85"
              stroke="#fff"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            >
              <animate
                attributeName="d"
                values="M80,85 Q100,95 120,85;M80,87 Q100,92 120,87;M80,85 Q100,95 120,85"
                dur="4s"
                repeatCount="indefinite"
              />
            </path>

            {/* Arms */}
            <rect x="25" y="120" width="25" height="8" rx="4" fill="#333" />
            <rect x="150" y="120" width="25" height="8" rx="4" fill="#333" />

            {/* Legs */}
            <rect
              x="65"
              y="220"
              width="20"
              height="40"
              rx="10"
              fill="#222"
              stroke="#00f3ff"
              strokeWidth="2"
            />
            <rect
              x="115"
              y="220"
              width="20"
              height="40"
              rx="10"
              fill="#222"
              stroke="#00f3ff"
              strokeWidth="2"
            />

            {/* Chest Panel */}
            <rect
              x="70"
              y="130"
              width="60"
              height="40"
              rx="8"
              fill="#111"
              stroke="#9d00ff"
              strokeWidth="2"
            />
            <circle cx="100" cy="150" r="6" fill="#00f3ff">
              <animate
                attributeName="opacity"
                values="1;0.3;1"
                dur="1.5s"
                repeatCount="indefinite"
              />
            </circle>
          </svg>
        </div>

        {/* Profile Card */}
        <div
          style={{
            width: "100%",
            maxWidth: "800px",
            position: "relative",
            zIndex: 10,
            display: "flex",
            gap: "3rem",
            alignItems: "center",
          }}
        >
          <div
            style={{
              background: "rgba(26, 26, 26, 0.9)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "1.5rem",
              padding: "2.5rem",
              flex: 1,
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Glow Effect */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "3px",
                background: "linear-gradient(90deg, #00f3ff, #9d00ff)",
                filter: "blur(2px)",
              }}
            ></div>

            {/* Header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1.5rem",
                marginBottom: "2rem",
              }}
            >
              {/* Avatar */}
              <div style={{ position: "relative" }}>
                <div
                  style={{
                    position: "absolute",
                    inset: "-3px",
                    background: "linear-gradient(135deg, #00f3ff, #9d00ff)",
                    borderRadius: "50%",
                    filter: "blur(4px)",
                    opacity: 0.5,
                  }}
                ></div>
                <div
                  style={{
                    width: "6rem",
                    height: "6rem",
                    borderRadius: "50%",
                    overflow: "hidden",
                    border: "3px solid rgba(255, 255, 255, 0.1)",
                    position: "relative",
                    background: session.user.image
                      ? "transparent"
                      : "linear-gradient(135deg, #222, #444)",
                  }}
                >
                  {session.user.image ? (
                    <img
                      src={session.user.image}
                      alt={session.user.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "2.5rem",
                        fontWeight: "bold",
                        color: "#00f3ff",
                      }}
                    >
                      {session.user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
              </div>

              {/* Name and Status */}
              <div>
                <h1
                  style={{
                    fontSize: "2.25rem",
                    fontWeight: 900,
                    background: "linear-gradient(135deg, #fff, #ccc)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    marginBottom: "0.5rem",
                  }}
                >
                  {session.user.name}
                </h1>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    padding: "0.5rem 1rem",
                    background: "rgba(0, 243, 255, 0.1)",
                    border: "1px solid rgba(0, 243, 255, 0.3)",
                    borderRadius: "2rem",
                    color: "#00f3ff",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                  }}
                >
                  <span
                    style={{
                      width: "8px",
                      height: "8px",
                      background: "#00f3ff",
                      borderRadius: "50%",
                      animation: "pulse 2s ease-in-out infinite",
                    }}
                  ></span>
                  Active • Robotic Companion
                </div>
              </div>
            </div>

            {/* Info Grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "1rem",
                marginBottom: "2rem",
              }}
            >
              {/* Email */}
              <div
                style={{
                  padding: "1.25rem",
                  background: "rgba(255, 255, 255, 0.05)",
                  borderRadius: "1rem",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  transition: "all 0.2s",
                }}
              >
                <div
                  style={{
                    fontSize: "0.875rem",
                    color: "#888",
                    marginBottom: "0.5rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <span>📧</span> Email
                </div>
                <div
                  style={{
                    fontFamily: "monospace",
                    color: "#fff",
                    fontSize: "0.9rem",
                    wordBreak: "break-all",
                  }}
                >
                  {session.user.email}
                </div>
              </div>

              {/* Member Since */}
              <div
                style={{
                  padding: "1.25rem",
                  background: "rgba(255, 255, 255, 0.05)",
                  borderRadius: "1rem",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  transition: "all 0.2s",
                }}
              >
                <div
                  style={{
                    fontSize: "0.875rem",
                    color: "#888",
                    marginBottom: "0.5rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <span>📅</span> Member Since
                </div>
                <div style={{ color: "#fff", fontWeight: 500 }}>
                  {new Date(session.user.createdAt).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
                </div>
              </div>

              {/* User ID */}
              <div
                style={{
                  padding: "1.25rem",
                  background: "rgba(255, 255, 255, 0.05)",
                  borderRadius: "1rem",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  transition: "all 0.2s",
                }}
              >
                <div
                  style={{
                    fontSize: "0.875rem",
                    color: "#888",
                    marginBottom: "0.5rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <span>🆔</span> User ID
                </div>
                <div
                  style={{
                    fontFamily: "monospace",
                    color: "#00f3ff",
                    fontSize: "0.85rem",
                    wordBreak: "break-all",
                  }}
                >
                  {session.user.id.slice(0, 8)}...
                </div>
              </div>

              {/* Status */}
              <div
                style={{
                  padding: "1.25rem",
                  background: "rgba(255, 255, 255, 0.05)",
                  borderRadius: "1rem",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  transition: "all 0.2s",
                }}
              >
                <div
                  style={{
                    fontSize: "0.875rem",
                    color: "#888",
                    marginBottom: "0.5rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <span>✅</span> Status
                </div>
                <div
                  style={{
                    color: "#4ade80",
                    fontWeight: 500,
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <span
                    style={{
                      width: "8px",
                      height: "8px",
                      background: "#4ade80",
                      borderRadius: "50%",
                    }}
                  ></span>
                  Verified & Active
                </div>
              </div>
            </div>

            {/* Quote */}
            <div
              style={{
                padding: "1.25rem",
                background:
                  "linear-gradient(135deg, rgba(0, 243, 255, 0.1), rgba(157, 0, 255, 0.1))",
                borderRadius: "1rem",
                border: "1px solid rgba(0, 243, 255, 0.2)",
                marginBottom: "2rem",
                position: "relative",
              }}
            >
              <div
                style={{
                  fontSize: "1.5rem",
                  color: "#00f3ff",
                  marginBottom: "0.5rem",
                  textAlign: "center",
                }}
              >
                "Hello, I'm your robotic companion! 🤖"
              </div>
              <div
                style={{
                  color: "#aaa",
                  fontSize: "0.875rem",
                  textAlign: "center",
                  fontStyle: "italic",
                }}
              >
                Welcome to the future of human-robot interaction
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                onClick={async () => {
                  await authClient.signOut();
                  localStorage.removeItem("auth_token");
                  window.location.href = "/";
                }}
                style={{
                  padding: "0.875rem 2rem",
                  background: "linear-gradient(135deg, #ff5555, #ff3366)",
                  border: "none",
                  borderRadius: "0.75rem",
                  color: "#fff",
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  transition: "all 0.2s",
                }}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#fff"
                  strokeWidth="2"
                >
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 12-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                Sign Out
              </button>
            </div>
          </div>
        </div>

        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(-50%) translateY(0px); }
            50% { transform: translateY(-50%) translateY(-20px); }
          }
          @keyframes pulse { 
            0%, 100% { opacity: 1; } 
            50% { opacity: 0.5; } 
          }
          div[style*="background: rgba"]:hover {
            border-color: rgba(0, 243, 255, 0.3) !important;
            transform: translateY(-2px);
          }
          button:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(255, 51, 102, 0.3);
          }
        `}</style>
      </div>
    </Layout>
  );
}
