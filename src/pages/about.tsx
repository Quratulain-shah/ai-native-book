import React, { useState, useEffect } from "react";
import Layout from "@theme/Layout";

export default function RobotBlog() {
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [loading, setLoading] = useState(false);
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");

  // Fetch initial blog data
  useEffect(() => {
    fetchBlogs();
    fetchCategories();
  }, []);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      // Simulate API call with mock data
      setTimeout(() => {
        const mockBlogs = [
          {
            id: 1,
            title: "The Future of Humanoid Robotics",
            excerpt:
              "Exploring how humanoid robots are revolutionizing healthcare, education, and daily assistance.",
            fullContent: `Humanoid robots are no longer science fiction. With advancements in AI and materials science, we're seeing robots that can walk, talk, and learn like humans. Boston Dynamics' Atlas and Tesla's Optimus are leading the charge, showing us a future where robots assist in dangerous jobs and elderly care.

**Key Developments:**
- 🤖 **Atlas by Boston Dynamics**: Performs parkour and complex tasks
- 🤖 **Optimus by Tesla**: Affordable humanoid robot for mass production
- 🤖 **Ameca by Engineered Arts**: Most advanced human-like facial expressions

The integration of AI with robotics is creating machines that can adapt to their environment, learn from humans, and even show empathy.`,
            author: "Dr. Alex Chen",
            date: "March 15, 2024",
            readTime: "5 min",
            category: "future",
            views: "2.5K",
            likes: 42,
            image: "🤖",
            color: "#00f3ff",
          },
          {
            id: 2,
            title: "AI-Powered Robot Companions",
            excerpt:
              "How artificial intelligence is creating emotionally intelligent robot companions.",
            fullContent: `Modern robot companions use natural language processing and emotional AI to provide companionship. These robots can recognize human emotions, remember personal details, and engage in meaningful conversations.

**Popular Companion Robots:**
- ❤️ **ElliQ**: Elderly companion robot that promotes social engagement
- ❤️ **Miro**: Bio-inspired robot pet that responds to touch
- ❤️ **Jibo**: Social robot with facial recognition

Studies show these robots can reduce loneliness by 60% in elderly populations.`,
            author: "Sarah Johnson",
            date: "March 12, 2024",
            readTime: "4 min",
            category: "ai",
            views: "1.8K",
            likes: 38,
            image: "💝",
            color: "#ff3366",
          },
          {
            id: 3,
            title: "Robotic Surgery Breakthroughs",
            excerpt:
              "Discover how robotic systems are making surgeries more precise.",
            fullContent: `Da Vinci surgical systems have performed over 10 million procedures worldwide. These robots offer 3D high-definition vision and tiny wristed instruments that bend and rotate far greater than the human hand.

**Advantages:**
- ⚕️ **Precision**: Sub-millimeter accuracy
- ⚕️ **Minimal Invasion**: Smaller incisions
- ⚕️ **Faster Recovery**: 50% quicker than traditional surgery

**Recent Innovations:**
- Autonomous suturing robots
- AI-guided tumor removal
- Remote surgery capabilities`,
            author: "Dr. Michael Rodriguez",
            date: "March 10, 2024",
            readTime: "6 min",
            category: "health",
            views: "3.2K",
            likes: 56,
            image: "⚕️",
            color: "#4ade80",
          },
          {
            id: 4,
            title: "Autonomous Delivery Robots",
            excerpt: "How small robots are transforming last-mile delivery.",
            fullContent: `From Starship's sidewalk robots to Nuro's autonomous delivery vehicles, these machines are changing how we receive packages.

**Current Players:**
- 🚚 **Starship Technologies**: 6-wheeled robots delivering food
- 🚚 **Nuro**: Autonomous pod-like vehicles for groceries
- 🚚 **Amazon Scout**: Electric autonomous delivery devices

**Benefits:**
- 24/7 delivery capability
- Reduced traffic congestion
- Lower carbon emissions
- Contactless delivery option`,
            author: "Jamie Wilson",
            date: "March 8, 2024",
            readTime: "3 min",
            category: "tech",
            views: "1.5K",
            likes: 29,
            image: "🚚",
            color: "#ffcc00",
          },
          {
            id: 5,
            title: "Educational Robots for Kids",
            excerpt: "Teaching children coding through fun robot kits.",
            fullContent: `Robots like LEGO Mindstorms, Sphero, and Anki Cozmo are making learning fun.

**Top Educational Robots:**
- 🎓 **LEGO Mindstorms**: Build and program robots
- 🎓 **Sphero**: Programmable ball robots
- 🎓 **Anki Cozmo**: AI-powered robot with personality
- 🎓 **Makeblock mBot**: Entry-level coding robot

**Learning Outcomes:**
- Develops logical thinking
- Teaches problem-solving
- Introduces programming concepts
- Encourages creativity`,
            author: "Prof. Linda Park",
            date: "March 5, 2024",
            readTime: "4 min",
            category: "education",
            views: "2.1K",
            likes: 47,
            image: "🎓",
            color: "#9d00ff",
          },
          {
            id: 6,
            title: "Space Exploration Robots",
            excerpt: "Meet the robots exploring Mars and beyond.",
            fullContent: `NASA's Perseverance rover, China's Yutu-2, and SpaceX's future lunar robots are expanding our reach in space.

**Notable Space Robots:**
- 🚀 **Perseverance Rover**: Collecting Mars samples
- 🚀 **Yutu-2**: First rover on Moon's far side
- 🚀 **Robonaut 2**: Humanoid robot on ISS
- 🚀 **InSight Lander**: Studying Mars' interior

**Future Missions:**
- Lunar base construction robots
- Asteroid mining robots
- Mars colony preparation robots`,
            author: "Neil Zhang",
            date: "March 3, 2024",
            readTime: "7 min",
            category: "space",
            views: "4.3K",
            likes: 89,
            image: "🚀",
            color: "#0066ff",
          },
        ];
        setBlogs(mockBlogs);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      setTimeout(() => {
        const mockCategories = [
          { id: "all", name: "All Topics", emoji: "🌟", count: 6 },
          { id: "future", name: "Future Tech", emoji: "🔮", count: 1 },
          { id: "ai", name: "AI & ML", emoji: "🧠", count: 1 },
          { id: "health", name: "Healthcare", emoji: "🏥", count: 1 },
          { id: "tech", name: "Technology", emoji: "💻", count: 1 },
          { id: "education", name: "Education", emoji: "📚", count: 1 },
          { id: "space", name: "Space", emoji: "🪐", count: 1 },
        ];
        setCategories(mockCategories);
      }, 300);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchBlogDetails = async (id) => {
    setLoading(true);
    try {
      // Simulate API call for specific blog
      setTimeout(() => {
        const blog = blogs.find((b) => b.id === id);
        if (blog) {
          // Simulate fetching additional data
          const detailedBlog = {
            ...blog,
            comments: [
              {
                id: 1,
                user: "RobotLover",
                comment: "Amazing article! The future is here.",
                time: "2 hours ago",
              },
              {
                id: 2,
                user: "TechEnthusiast",
                comment: "Can't wait to have my own robot companion!",
                time: "5 hours ago",
              },
              {
                id: 3,
                user: "AIResearcher",
                comment: "Great insights into emotional AI.",
                time: "1 day ago",
              },
            ],
            relatedArticles: blogs.filter((b) => b.id !== id).slice(0, 2),
          };
          setSelectedBlog(detailedBlog);
        }
        setLoading(false);
      }, 600);
    } catch (error) {
      console.error("Error fetching blog details:", error);
      setLoading(false);
    }
  };

  const filteredBlogs =
    activeFilter === "all"
      ? blogs
      : blogs.filter((blog) => blog.category === activeFilter);

  const handleBackToList = () => {
    setSelectedBlog(null);
  };

  const handleLikeBlog = (blogId) => {
    setBlogs(
      blogs.map((blog) =>
        blog.id === blogId ? { ...blog, likes: blog.likes + 1 } : blog
      )
    );

    if (selectedBlog && selectedBlog.id === blogId) {
      setSelectedBlog((prev) => ({ ...prev, likes: prev.likes + 1 }));
    }
  };

  return (
    <Layout title="RoboBlog - Robotics News & Articles">
      <div
        style={{
          minHeight: "100vh",
          background:
            "linear-gradient(135deg, #0a0a0a 0%, #111111 50%, #0a0a0a 100%)",
          color: "#fff",
          padding: "2rem 1rem",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background Effects */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `radial-gradient(circle at 20% 80%, rgba(0, 243, 255, 0.1) 0%, transparent 50%),
                      radial-gradient(circle at 80% 20%, rgba(157, 0, 255, 0.1) 0%, transparent 50%)`,
          }}
        ></div>

        {/* Main Content */}
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            position: "relative",
            zIndex: 10,
          }}
        >
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <h1
              style={{
                fontSize: "3.5rem",
                fontWeight: 900,
                background: "linear-gradient(135deg, #00f3ff, #9d00ff)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                marginBottom: "1rem",
              }}
            >
              🤖 RoboBlog
            </h1>
            <p
              style={{
                fontSize: "1.125rem",
                color: "#aaa",
                maxWidth: "600px",
                margin: "0 auto",
              }}
            >
              Explore the latest in robotics, AI, and automation technology
            </p>
          </div>

          {/* Loading State */}
          {loading && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "300px",
              }}
            >
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  border: "3px solid rgba(0, 243, 255, 0.3)",
                  borderTopColor: "#00f3ff",
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite",
                }}
              ></div>
            </div>
          )}

          {/* Blog Detail View */}
          {selectedBlog && !loading && (
            <div
              style={{
                background: "rgba(26, 26, 26, 0.95)",
                backdropFilter: "blur(20px)",
                border: `1px solid ${selectedBlog.color}`,
                borderRadius: "1.5rem",
                padding: "2rem",
                marginBottom: "2rem",
                animation: "fadeIn 0.3s ease-out",
              }}
            >
              {/* Back Button */}
              <button
                onClick={handleBackToList}
                style={{
                  background: "rgba(255, 255, 255, 0.1)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  borderRadius: "0.75rem",
                  padding: "0.5rem 1rem",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  cursor: "pointer",
                  marginBottom: "1.5rem",
                }}
              >
                ← Back to Articles
              </button>

              {/* Blog Header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  marginBottom: "2rem",
                }}
              >
                <div
                  style={{
                    width: "80px",
                    height: "80px",
                    background: selectedBlog.color + "20",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "2.5rem",
                    border: `2px solid ${selectedBlog.color}`,
                  }}
                >
                  {selectedBlog.image}
                </div>
                <div>
                  <div
                    style={{
                      fontSize: "0.875rem",
                      color: selectedBlog.color,
                      fontWeight: 600,
                      textTransform: "uppercase",
                    }}
                  >
                    {selectedBlog.category}
                  </div>
                  <h2
                    style={{
                      fontSize: "2rem",
                      fontWeight: 700,
                      margin: "0.5rem 0",
                    }}
                  >
                    {selectedBlog.title}
                  </h2>
                  <div
                    style={{
                      display: "flex",
                      gap: "1rem",
                      color: "#888",
                      fontSize: "0.875rem",
                    }}
                  >
                    <span>By {selectedBlog.author}</span>
                    <span>•</span>
                    <span>{selectedBlog.date}</span>
                    <span>•</span>
                    <span>{selectedBlog.readTime} read</span>
                  </div>
                </div>
              </div>

              {/* Blog Content */}
              <div
                style={{
                  color: "#ccc",
                  lineHeight: 1.8,
                  fontSize: "1.125rem",
                  marginBottom: "2rem",
                  whiteSpace: "pre-line",
                }}
              >
                {selectedBlog.fullContent}
              </div>

              {/* Stats */}
              <div
                style={{
                  display: "flex",
                  gap: "2rem",
                  padding: "1.5rem",
                  background: "rgba(255, 255, 255, 0.05)",
                  borderRadius: "1rem",
                  marginBottom: "2rem",
                }}
              >
                <div>
                  <div style={{ fontSize: "0.875rem", color: "#888" }}>
                    Views
                  </div>
                  <div
                    style={{
                      fontSize: "1.5rem",
                      fontWeight: "bold",
                      color: selectedBlog.color,
                    }}
                  >
                    {selectedBlog.views}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: "0.875rem", color: "#888" }}>
                    Likes
                  </div>
                  <div
                    style={{
                      fontSize: "1.5rem",
                      fontWeight: "bold",
                      color: "#ff3366",
                    }}
                  >
                    {selectedBlog.likes}
                  </div>
                </div>
                <button
                  onClick={() => handleLikeBlog(selectedBlog.id)}
                  style={{
                    marginLeft: "auto",
                    padding: "0.5rem 1.5rem",
                    background: "#ff336620",
                    border: "1px solid #ff3366",
                    borderRadius: "0.75rem",
                    color: "#ff3366",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    cursor: "pointer",
                  }}
                >
                  ❤️ Like Article
                </button>
              </div>

              {/* Comments */}
              <div style={{ marginBottom: "2rem" }}>
                <h3 style={{ fontSize: "1.25rem", marginBottom: "1rem" }}>
                  💬 Comments ({selectedBlog.comments?.length || 0})
                </h3>
                <div
                  style={{
                    background: "rgba(255, 255, 255, 0.05)",
                    borderRadius: "1rem",
                    padding: "1.5rem",
                  }}
                >
                  {selectedBlog.comments?.map((comment) => (
                    <div
                      key={comment.id}
                      style={{
                        padding: "1rem",
                        borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: "0.5rem",
                        }}
                      >
                        <span
                          style={{
                            fontWeight: "bold",
                            color: selectedBlog.color,
                          }}
                        >
                          {comment.user}
                        </span>
                        <span style={{ fontSize: "0.875rem", color: "#888" }}>
                          {comment.time}
                        </span>
                      </div>
                      <p style={{ color: "#ccc", margin: 0 }}>
                        {comment.comment}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Related Articles */}
              {selectedBlog.relatedArticles &&
                selectedBlog.relatedArticles.length > 0 && (
                  <div>
                    <h3 style={{ fontSize: "1.25rem", marginBottom: "1rem" }}>
                      📚 Related Articles
                    </h3>
                    <div style={{ display: "flex", gap: "1rem" }}>
                      {selectedBlog.relatedArticles.map((article) => (
                        <button
                          key={article.id}
                          onClick={() => fetchBlogDetails(article.id)}
                          style={{
                            flex: 1,
                            background: "rgba(255, 255, 255, 0.05)",
                            border: "1px solid rgba(255, 255, 255, 0.1)",
                            borderRadius: "0.75rem",
                            padding: "1rem",
                            textAlign: "left",
                            cursor: "pointer",
                            transition: "all 0.2s",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "0.5rem",
                              marginBottom: "0.5rem",
                            }}
                          >
                            <span style={{ fontSize: "1.5rem" }}>
                              {article.image}
                            </span>
                            <span
                              style={{
                                color: article.color,
                                fontSize: "0.875rem",
                              }}
                            >
                              {article.category}
                            </span>
                          </div>
                          <div
                            style={{
                              fontWeight: "bold",
                              marginBottom: "0.5rem",
                            }}
                          >
                            {article.title}
                          </div>
                          <div style={{ fontSize: "0.875rem", color: "#888" }}>
                            {article.author}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          )}

          {/* Blog List View */}
          {!selectedBlog && !loading && (
            <>
              {/* Category Filters */}
              <div
                style={{
                  display: "flex",
                  gap: "0.5rem",
                  flexWrap: "wrap",
                  justifyContent: "center",
                  marginBottom: "3rem",
                }}
              >
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveFilter(category.id)}
                    style={{
                      padding: "0.75rem 1.5rem",
                      background:
                        activeFilter === category.id
                          ? `linear-gradient(135deg, ${
                              category.id === "all" ? "#00f3ff" : "#333"
                            }, #111)`
                          : "rgba(255, 255, 255, 0.05)",
                      border: `1px solid ${
                        activeFilter === category.id
                          ? "#00f3ff"
                          : "rgba(255, 255, 255, 0.1)"
                      }`,
                      borderRadius: "2rem",
                      color: activeFilter === category.id ? "#fff" : "#aaa",
                      fontSize: "0.875rem",
                      fontWeight: 600,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <span style={{ fontSize: "1.25rem" }}>
                      {category.emoji}
                    </span>
                    {category.name}
                    <span
                      style={{
                        background:
                          activeFilter === category.id ? "#00f3ff" : "#444",
                        color: activeFilter === category.id ? "#000" : "#aaa",
                        borderRadius: "1rem",
                        padding: "0.125rem 0.5rem",
                        fontSize: "0.75rem",
                      }}
                    >
                      {category.count}
                    </span>
                  </button>
                ))}
              </div>

              {/* Blog Grid */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
                  gap: "2rem",
                }}
              >
                {filteredBlogs.map((blog) => (
                  <div
                    key={blog.id}
                    onClick={() => fetchBlogDetails(blog.id)}
                    style={{
                      background: "rgba(26, 26, 26, 0.8)",
                      backdropFilter: "blur(10px)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      borderRadius: "1.5rem",
                      padding: "1.5rem",
                      cursor: "pointer",
                      transition: "all 0.3s",
                      ":hover": {
                        transform: "translateY(-5px)",
                        borderColor: blog.color,
                        boxShadow: `0 10px 30px ${blog.color}40`,
                      },
                    }}
                  >
                    {/* Blog Header */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "1rem",
                        marginBottom: "1rem",
                      }}
                    >
                      <div
                        style={{
                          width: "60px",
                          height: "60px",
                          background: blog.color + "20",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "2rem",
                          border: `2px solid ${blog.color}`,
                        }}
                      >
                        {blog.image}
                      </div>
                      <div>
                        <div
                          style={{
                            fontSize: "0.75rem",
                            color: blog.color,
                            fontWeight: 600,
                            textTransform: "uppercase",
                          }}
                        >
                          {blog.category}
                        </div>
                        <h3
                          style={{
                            fontSize: "1.25rem",
                            fontWeight: 700,
                            margin: "0.25rem 0",
                          }}
                        >
                          {blog.title}
                        </h3>
                      </div>
                    </div>

                    {/* Excerpt */}
                    <p
                      style={{
                        color: "#ccc",
                        fontSize: "0.875rem",
                        lineHeight: 1.6,
                        marginBottom: "1.5rem",
                      }}
                    >
                      {blog.excerpt}
                    </p>

                    {/* Meta Info */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        paddingTop: "1rem",
                        borderTop: "1px solid rgba(255, 255, 255, 0.1)",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.75rem",
                        }}
                      >
                        <div
                          style={{
                            width: "32px",
                            height: "32px",
                            background: "linear-gradient(135deg, #333, #555)",
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "0.75rem",
                            fontWeight: "bold",
                            color: blog.color,
                          }}
                        >
                          {blog.author
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <div>
                          <div style={{ fontSize: "0.75rem", color: "#888" }}>
                            By
                          </div>
                          <div
                            style={{ fontSize: "0.875rem", fontWeight: 600 }}
                          >
                            {blog.author}
                          </div>
                        </div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: "0.75rem", color: "#888" }}>
                          {blog.date}
                        </div>
                        <div style={{ fontSize: "0.75rem", color: blog.color }}>
                          {blog.readTime}
                        </div>
                      </div>
                    </div>

                    {/* Stats */}
                    <div
                      style={{
                        display: "flex",
                        gap: "1rem",
                        marginTop: "1rem",
                        fontSize: "0.75rem",
                        color: "#888",
                      }}
                    >
                      <span>👁️ {blog.views}</span>
                      <span>❤️ {blog.likes}</span>
                      <span>💬 {Math.floor(blog.likes / 3)}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Load More Button */}
              {filteredBlogs.length > 0 && (
                <div style={{ textAlign: "center", marginTop: "3rem" }}>
                  <button
                    onClick={() => {
                      // Simulate loading more blogs
                      setLoading(true);
                      setTimeout(() => {
                        // Add more blogs logic here
                        setLoading(false);
                      }, 1000);
                    }}
                    style={{
                      padding: "1rem 2rem",
                      background: "linear-gradient(135deg, #00f3ff, #9d00ff)",
                      border: "none",
                      borderRadius: "0.75rem",
                      color: "#fff",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    Load More Articles
                  </button>
                </div>
              )}
            </>
          )}

          {/* No Blogs Message */}
          {!loading && filteredBlogs.length === 0 && !selectedBlog && (
            <div style={{ textAlign: "center", padding: "3rem" }}>
              <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🤖</div>
              <h3 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>
                No articles found
              </h3>
              <p style={{ color: "#888" }}>
                Try selecting a different category
              </p>
            </div>
          )}
        </div>

        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          button:hover {
            transform: translateY(-2px);
            opacity: 0.9;
          }
          div[onClick] {
            cursor: pointer;
          }
          div[onClick]:hover {
            transform: translateY(-5px);
          }
        `}</style>
      </div>
    </Layout>
  );
}
