import type { ReactNode } from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";

import Heading from "@theme/Heading";

import styles from "./styles.module.css";

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();

  return (
    <header className={clsx(styles.heroContainer)}>
      {/* Animated 3D Background with Floating Elements */}
      <div className={styles.background3D}>
        <div className={styles.robotArm}></div>
        <div className={styles.floatingCircuit}></div>
        <div className={styles.neuralNetwork}></div>
        <div className={styles.geometricShapes}>
          <div className={styles.shape1}></div>
          <div className={styles.shape2}></div>
          <div className={styles.shape3}></div>
          <div className={styles.shape4}></div>
        </div>
        <div className={styles.glowEffect}></div>
        <div className={styles.particleContainer}>
          {[...Array(50)].map((_, i) => (
            <div key={i} className={styles.particle}></div>
          ))}
        </div>
      </div>

      <div className={clsx("container", styles.heroContent)}>
        <div className={styles.titleWrapper}>
          {/* Premium Badge with Microchip Design */}
          <div className={styles.premiumBadge}>
            <div className={styles.badgeInner}>
              <span className={styles.badgeIcon}>⚡</span>
              <span>ENTERPRISE EDITION</span>
            </div>
          </div>

          <div className={styles.titleContainer}>
            <Heading as="h1" className={styles.heroTitle}>
              <span className={styles.titlePretext}>Master</span>
              <span className={styles.titleGradient}>
                Physical AI & Humanoid Robotics
              </span>
            </Heading>
            <div className={styles.titleUnderline}>
              <div className={styles.underlineGlow}></div>
            </div>
          </div>

          <p className={styles.heroSubtitle}>
            <span className={styles.subtitleHighlight}>
              Comprehensive 13-Week Curriculum • ROS 2 • Digital Twin • NVIDIA
              Isaac • VLA Systems
            </span>
          </p>

          <div className={styles.taglineContainer}>
            <p className={styles.premiumTagline}>
              <span className={styles.highlight}>
                Theory → Simulation → Physical Deployment
              </span>
              <br />
              The ultimate guide to building intelligent humanoid systems
            </p>
          </div>

          {/* Enhanced CTA Buttons with Icons */}
          <div className={styles.ctaButtons}>
            <Link
              className={clsx(styles.primaryButton, styles.buttonGlow)}
              to="/docs/syllabus"
            >
              <span className={styles.buttonIcon}>📚</span>
              <span className={styles.buttonText}>
                <span className={styles.buttonMain}>Start Learning</span>
                <span className={styles.buttonSub}>13-Week Curriculum</span>
              </span>
              <span className={styles.buttonArrow}>→</span>
            </Link>

            <div className={styles.buttonGroup}>
              <Link
                className={clsx(styles.secondaryButton, styles.buttonWithHover)}
                to="/docs/overview"
              >
                <span className={styles.buttonIcon}>🤖</span>
                <span>ROS 2 Fundamentals</span>
              </Link>
              <Link
                className={clsx(styles.tertiaryButton, styles.buttonWithHover)}
                to="/docs/overview"
              >
                <span className={styles.buttonIcon}>🌐</span>
                <span>Digital Twin</span>
              </Link>
            </div>

            <Link className={styles.premiumButton} to="/docs/overview">
              <span className={styles.premiumIcon}>🔥</span>
              <span>NVIDIA Isaac Ecosystem</span>
              <span className={styles.badgeNew}>NEW</span>
            </Link>
          </div>

          {/* Enhanced Stats Bar */}
          <div className={styles.statsBar}>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>📖</div>
              <div className={styles.statContent}>
                <div className={styles.statNumber}>13</div>
                <div className={styles.statLabel}>Comprehensive Weeks</div>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>⚙️</div>
              <div className={styles.statContent}>
                <div className={styles.statNumber}>4</div>
                <div className={styles.statLabel}>Core Technologies</div>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>🎯</div>
              <div className={styles.statContent}>
                <div className={styles.statNumber}>100%</div>
                <div className={styles.statLabel}>Hands-on Projects</div>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>🚀</div>
              <div className={styles.statContent}>
                <div className={styles.statNumber}>VLA</div>
                <div className={styles.statLabel}>Vision-Language-Action</div>
              </div>
            </div>
          </div>

          {/* Tech Stack Badges */}
          <div className={styles.techBadges}>
            <div className={styles.techBadgeItem}>
              <span className={styles.techLogo}>ROS2</span>
              <span className={styles.techVersion}>Humble</span>
            </div>
            <div className={styles.techBadgeItem}>
              <span className={styles.techLogo}>NVIDIA</span>
              <span className={styles.techVersion}>Isaac</span>
            </div>
            <div className={styles.techBadgeItem}>
              <span className={styles.techLogo}>PyTorch</span>
              <span className={styles.techVersion}>2.0+</span>
            </div>
            <div className={styles.techBadgeItem}>
              <span className={styles.techLogo}>Gazebo</span>
              <span className={styles.techVersion}>Sim</span>
            </div>
          </div>
        </div>

        {/* Interactive 3D Humanoid Robot Preview */}
        <div className={styles.robotPreview}>
          <div className={styles.previewContainer}>
            <div className={styles.robotScene}>
              <div className={styles.robotBase}>
                <div className={styles.robotHead}>
                  <div className={styles.robotFace}>
                    <div className={styles.robotEye}></div>
                    <div className={styles.robotEye}></div>
                    <div className={styles.robotMouth}></div>
                  </div>
                  <div className={styles.robotAntenna}></div>
                </div>
                <div className={styles.robotBody}>
                  <div className={styles.robotShoulder}>
                    <div className={styles.robotArmLeft}>
                      <div className={styles.armJoint}></div>
                      <div className={styles.armSegment}></div>
                      <div className={styles.armJoint}></div>
                    </div>
                    <div className={styles.robotChest}>
                      <div className={styles.chestPanel}></div>
                      <div className={styles.chestLights}>
                        <div className={styles.light}></div>
                        <div className={styles.light}></div>
                        <div className={styles.light}></div>
                      </div>
                    </div>
                    <div className={styles.robotArmRight}>
                      <div className={styles.armJoint}></div>
                      <div className={styles.armSegment}></div>
                      <div className={styles.armJoint}></div>
                    </div>
                  </div>
                  <div className={styles.robotHips}>
                    <div className={styles.robotLegLeft}></div>
                    <div className={styles.robotLegRight}></div>
                  </div>
                </div>
              </div>

              {/* Simulation Environment */}
              <div className={styles.simulationGrid}></div>
              <div className={styles.dataStream}>
                {[...Array(10)].map((_, i) => (
                  <div key={i} className={styles.dataPoint}></div>
                ))}
              </div>
            </div>

            <div className={styles.previewInfo}>
              <div className={styles.previewBadge}>LIVE SIMULATION</div>
              <h3 className={styles.previewTitle}>
                Interactive Humanoid Robot
              </h3>
              <p className={styles.previewDesc}>
                Real-time Digital Twin simulation with ROS 2 control
              </p>
              <div className={styles.simulationControls}>
                <button className={styles.controlBtn}>
                  <span>▶️</span> Start Sim
                </button>
                <button className={styles.controlBtn}>
                  <span>⚙️</span> Configure
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title="Physical AI & Humanoid Robotics | Complete 13-Week Curriculum"
      description="Master ROS 2, Digital Twin simulations, NVIDIA Isaac ecosystem, and Vision-Language-Action systems. Theory → Simulation → Physical Deployment pedagogy."
    >
      <HomepageHeader />
      <main className={styles.mainContent}>
        {/* Curriculum Overview */}
        <section className={styles.curriculumSection}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionBadge}>CURRICULUM</div>
            <h2 className={styles.sectionTitle}>13-Week Learning Journey</h2>
            <p className={styles.sectionSubtitle}>
              From fundamentals to advanced humanoid robotics deployment
            </p>
          </div>

          <div className={styles.curriculumTimeline}>
            {[
              { week: 1, title: "ROS 2 Fundamentals", color: "#00f7ff" },
              { week: 2, title: "Robot Kinematics", color: "#0080ff" },
              { week: 3, title: "Sensor Integration", color: "#00ff88" },
              { week: 4, title: "Digital Twin Setup", color: "#ff00ff" },
              { week: 5, title: "Motion Planning", color: "#ffaa00" },
              { week: 6, title: "NVIDIA Isaac Intro", color: "#aa00ff" },
              { week: 7, title: "VLA Systems", color: "#00ffaa" },
              { week: 8, title: "Simulation Testing", color: "#ff5500" },
              { week: 9, title: "Humanoid Control", color: "#5500ff" },
              { week: 10, title: "AI Integration", color: "#00aaff" },
              { week: 11, title: "Real Deployment", color: "#ff0080" },
              { week: 12, title: "Advanced Topics", color: "#aaff00" },
              { week: 13, title: "Capstone Project", color: "#ff00aa" },
            ].map((item, index) => (
              <div key={index} className={styles.timelineItem}>
                <div
                  className={styles.timelineDot}
                  style={{ borderColor: item.color }}
                >
                  <span className={styles.weekNumber}>W{item.week}</span>
                </div>
                <div className={styles.timelineContent}>
                  <h4>{item.title}</h4>
                  <div className={styles.progressBar}>
                    <div
                      className={styles.progressFill}
                      style={{
                        backgroundColor: item.color,
                        width: `${(index + 1) * 7.7}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        

        {/* Technology Stack */}
        <section className={styles.techSection}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionBadge}>TECH STACK</div>
            <h2 className={styles.sectionTitle}>
              Enterprise-Grade Technologies
            </h2>
            <p className={styles.sectionSubtitle}>
              Industry-standard tools for professional robotics development
            </p>
          </div>

          <div className={styles.techGrid}>
            {[
              {
                icon: "🤖",
                name: "ROS 2",
                desc: "Robot Operating System",
                highlight: "Humble Hawksbill",
              },
              {
                icon: "🌐",
                name: "Digital Twin",
                desc: "High-fidelity simulation",
                highlight: "Gazebo/Isaac Sim",
              },
              {
                icon: "🔥",
                name: "NVIDIA Isaac",
                desc: "AI robotics platform",
                highlight: "GPU Accelerated",
              },
              {
                icon: "👁️",
                name: "VLA Systems",
                desc: "Vision-Language-Action",
                highlight: "Multi-modal AI",
              },
              {
                icon: "🧠",
                name: "PyTorch",
                desc: "Deep Learning",
                highlight: "2.0+",
              },
              {
                icon: "⚡",
                name: "Docker",
                desc: "Containerization",
                highlight: "ROS 2 Containers",
              },
              {
                icon: "🔧",
                name: "MoveIt 2",
                desc: "Motion Planning",
                highlight: "Real-time",
              },
              {
                icon: "📊",
                name: "RViz2",
                desc: "Visualization",
                highlight: "3D Tools",
              },
            ].map((tech, index) => (
              <div key={index} className={styles.techCard}>
                <div className={styles.techIcon}>{tech.icon}</div>
                <div className={styles.techInfo}>
                  <h3>{tech.name}</h3>
                  <p>{tech.desc}</p>
                  <div className={styles.techHighlight}>{tech.highlight}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Learning Methodology */}
        <section className={styles.methodologySection}>
          <div className={styles.methodologyContainer}>
            <div className={styles.methodologyHeader}>
              <h2>Pedagogical Flow</h2>
              <p>The proven path from theory to real-world deployment</p>
            </div>

            <div className={styles.flowSteps}>
              <div className={styles.flowStep}>
                <div className={styles.stepNumber}>01</div>
                <div className={styles.stepContent}>
                  <h3>Theory & Concepts</h3>
                  <p>Fundamental principles of robotics and AI</p>
                </div>
                <div className={styles.stepArrow}>→</div>
              </div>

              <div className={styles.flowStep}>
                <div className={styles.stepNumber}>02</div>
                <div className={styles.stepContent}>
                  <h3>Simulation</h3>
                  <p>Digital Twin development and testing</p>
                </div>
                <div className={styles.stepArrow}>→</div>
              </div>

              <div className={styles.flowStep}>
                <div className={styles.stepNumber}>03</div>
                <div className={styles.stepContent}>
                  <h3>Physical Deployment</h3>
                  <p>Real-world robot implementation</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Start Section */}
        <section className={styles.quickStartSection}>
          <div className={styles.quickStartContainer}>
            <div className={styles.quickStartContent}>
              <h2>Ready to Start Building?</h2>
              <p>
                Get immediate access to the complete curriculum and all
                resources
              </p>

              <div className={styles.actionButtons}>
                <Link
                  className={styles.downloadButton}
                  to="/docs/overview"
                >
                  <span className={styles.downloadIcon}>📥</span>
                  Download Full Curriculum
                </Link>
                <Link className={styles.demoButton} to="/docs/overview">
                  <span className={styles.demoIcon}>🎮</span>
                  View Live Demos
                </Link>
              </div>

              <div className={styles.featureList}>
                <div className={styles.featureItem}>
                  <span>✅</span> Complete source code
                </div>
                <div className={styles.featureItem}>
                  <span>✅</span> Simulation files
                </div>
                <div className={styles.featureItem}>
                  <span>✅</span> Step-by-step tutorials
                </div>
                <div className={styles.featureItem}>
                  <span>✅</span> Community support
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
