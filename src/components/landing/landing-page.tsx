"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import "./landing.css";

export function LandingPage() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Reads the theme applied by the inline anti-flash script after mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDarkMode(document.documentElement.classList.contains("dark"));
  }, []);

  function toggleTheme() {
    const next = !darkMode;
    setDarkMode(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("taskflow-theme", next ? "dark" : "light");
    } catch {
      // storage can be unavailable (private mode, blocked storage)
    }
  }

  return (
    <main className="tf-landing page">

      {/* ================= NAVBAR ================= */}

      <header className="navbar">
        <Link href="/" className="logo">
          <span className="logo-icon">✓</span>

          <span className="logo-text">
            task<span>flow</span>
          </span>
        </Link>

        <nav className="nav-links">
          <Link href="/how-it-works">How it works</Link>
          <Link href="/faq">FAQ</Link>
          <Link href="/support">Support</Link>
        </nav>

        <div className="nav-actions">

          <button
            className="theme-button"
            onClick={toggleTheme}
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? "☀" : "☾"}
          </button>

          <Link href="/login" className="sign-in">
            Sign in
          </Link>

          <Link href="/register" className="signup-button">
            Sign up
          </Link>

        </div>
      </header>


      {/* ================= HERO ================= */}

      <section className="hero">

        {/* Dashboard behind hero */}

        <div className="dashboard-background" aria-hidden="true" inert>

          <DashboardPreview />

        </div>

        {/* White fade over dashboard */}

        <div className="dashboard-fade" />


        {/* Hero content */}

        <div className="hero-content">

          <h1>
            task<span>flow</span>
          </h1>

          <p>
            Organize your tasks: statuses, priorities,
            deadlines, and a dashboard with
            real-time statistics.
          </p>

          <div className="hero-buttons">

            <Link href="/register" className="primary-button">
              Sign up
            </Link>

            <Link href="/login" className="secondary-button">
              Sign in
            </Link>

          </div>

        </div>

      </section>


      {/* ================= FOOTER ================= */}

      <footer className="footer">

        <Link href="/about">About</Link>
        <Link href="/how-it-works">How it works</Link>
        <Link href="/faq">FAQ</Link>
        <Link href="/support">Support</Link>
        <Link href="/privacy">Privacy</Link>
        <Link href="/terms">Terms of Use</Link>
        <Link href="/cookies">Cookies</Link>

      </footer>

    </main>
  );
}


/* =====================================================
   DASHBOARD PREVIEW
===================================================== */

function DashboardPreview() {
  return (
    <div className="dashboard">

      {/* SIDEBAR */}

      <aside className="sidebar">

        <div className="dashboard-logo">
          task<span>flow</span>
        </div>

        <div className="sidebar-menu">

          <SidebarItem
            icon="▣"
            label="Dashboard"
            active
          />

          <SidebarItem
            icon="□"
            label="Tasks"
          />

          <SidebarItem
            icon="▣"
            label="Calendar"
          />

          <SidebarItem
            icon="⚑"
            label="Projects"
          />

          <SidebarItem
            icon="♧"
            label="Team"
          />

          <SidebarItem
            icon="▥"
            label="Reports"
          />

          <SidebarItem
            icon="⚙"
            label="Settings"
          />

        </div>


        <div className="upgrade-card">

          <div className="upgrade-icon">
            ♛
          </div>

          <strong>Upgrade to Pro</strong>

          <span>
            Unlock more features
          </span>

          <button>
            Upgrade now
          </button>

        </div>

      </aside>


      {/* MAIN DASHBOARD */}

      <section className="dashboard-main">

        {/* HEADER */}

        <div className="dashboard-header">

          <div className="search">
            🔍
            <span>
              Search tasks, projects...
            </span>
          </div>

          <div className="dashboard-user">

            <span>☼</span>

            <span>♧</span>

            <div className="avatar">
              JR
            </div>

            <div className="user-info">
              <strong>John Doe</strong>
              <small>john@example.com</small>
            </div>

            <span>⌄</span>

          </div>

        </div>


        {/* TITLE */}

        <div className="dashboard-title">

          <div>
            <h2>Dashboard</h2>

            <p>
              Overview of your tasks and projects
            </p>
          </div>

          <button className="new-task">
            + New task
          </button>

        </div>


        {/* STATISTICS */}

        <div className="statistics">

          <StatCard
            title="Total tasks"
            value="128"
            change="+12%"
            icon="✓"
          />

          <StatCard
            title="In progress"
            value="64"
            change="+8%"
            icon="⌁"
          />

          <StatCard
            title="Completed"
            value="48"
            change="+16%"
            icon="✓"
          />

          <StatCard
            title="Overdue"
            value="16"
            change="-4%"
            icon="!"
            danger
          />

        </div>


        {/* MAIN GRID */}

        <div className="dashboard-grid">

          {/* CHART */}

          <div className="chart-card">

            <div className="card-header">
              <h3>Task overview</h3>

              <button>
                This week⌄
              </button>
            </div>

            <TaskChart />

          </div>


          {/* DEADLINES */}

          <div className="deadlines-card">

            <div className="card-header">
              <h3>Upcoming deadlines</h3>

              <a href="#">
                View all
              </a>
            </div>

            <Deadline
              title="Design new landing page"
              date="Tomorrow, 10:00 AM"
              priority="High"
            />

            <Deadline
              title="API integration"
              date="May 28, 2024"
              priority="Medium"
            />

            <Deadline
              title="Project report"
              date="May 30, 2024"
              priority="Low"
            />

          </div>

        </div>


        {/* BOTTOM GRID */}

        <div className="bottom-grid">

          {/* RECENT TASKS */}

          <div className="recent-card">

            <div className="card-header">

              <h3>
                Recent tasks
              </h3>

              <a href="#">
                View all
              </a>

            </div>

            <Task
              title="Review new designs"
              project="Website Redesign"
              status="In progress"
              date="May 24"
            />

            <Task
              title="Fix login bug"
              project="Mobile App"
              status="To do"
              date="May 24"
            />

            <Task
              title="Content update"
              project="Marketing"
              status="Done"
              date="May 23"
            />

            <Task
              title="User testing"
              project="Mobile App"
              status="In progress"
              date="May 22"
            />

          </div>


          {/* PROJECT PROGRESS */}

          <div className="progress-card">

            <div className="card-header">
              <h3>
                Project progress
              </h3>
            </div>

            <Progress
              name="Website Redesign"
              value={75}
            />

            <Progress
              name="Mobile App"
              value={45}
            />

            <Progress
              name="Marketing Campaign"
              value={60}
            />

            <Progress
              name="API Development"
              value={90}
            />

          </div>

        </div>

      </section>

    </div>
  );
}


/* =====================================================
   COMPONENTS
===================================================== */

interface SidebarItemProps {
  icon: string;
  label: string;
  active?: boolean;
}

function SidebarItem({
  icon,
  label,
  active = false,
}: SidebarItemProps) {

  return (
    <div
      className={
        active
          ? "sidebar-item active"
          : "sidebar-item"
      }
    >
      <span>{icon}</span>
      {label}
    </div>
  );
}


interface StatCardProps {
  title: string;
  value: string;
  change: string;
  icon: string;
  danger?: boolean;
}

function StatCard({
  title,
  value,
  change,
  icon,
  danger = false,
}: StatCardProps) {

  return (
    <div className="stat-card">

      <div>
        <span className="stat-title">
          {title}
        </span>

        <strong>
          {value}
        </strong>

        <small className={danger ? "danger" : ""}>
          {change} from last week
        </small>
      </div>

      <div className="stat-icon">
        {icon}
      </div>

    </div>
  );
}


interface DeadlineProps {
  title: string;
  date: string;
  priority: "High" | "Medium" | "Low";
}

function Deadline({
  title,
  date,
  priority,
}: DeadlineProps) {

  return (
    <div className="deadline">

      <div className={`deadline-dot ${priority.toLowerCase()}`} />

      <div>
        <strong>
          {title}
        </strong>

        <span>
          {date}
        </span>
      </div>

      <em className={priority.toLowerCase()}>
        {priority}
      </em>

    </div>
  );
}


interface TaskProps {
  title: string;
  project: string;
  status: "In progress" | "To do" | "Done";
  date: string;
}

function Task({
  title,
  project,
  status,
  date,
}: TaskProps) {

  return (
    <div className="task">

      <input type="checkbox" />

      <div className="task-info">

        <strong>
          {title}
        </strong>

        <span>
          ● {project}
        </span>

      </div>

      <em className={`status ${status
        .toLowerCase()
        .replace(" ", "-")}`}>
        {status}
      </em>

      <small>
        {date}
      </small>

    </div>
  );
}


interface ProgressProps {
  name: string;
  value: number;
}

function Progress({
  name,
  value,
}: ProgressProps) {

  return (
    <div className="progress">

      <div className="progress-label">

        <span>
          {name}
        </span>

        <strong>
          {value}%
        </strong>

      </div>

      <div className="progress-background">

        <div
          className="progress-value"
          style={{ width: `${value}%` }}
        />

      </div>

    </div>
  );
}


/* =====================================================
   SIMPLE SVG CHART
===================================================== */

function TaskChart() {

  return (
    <div className="chart">

      <div className="chart-y">
        <span>100</span>
        <span>80</span>
        <span>60</span>
        <span>40</span>
        <span>20</span>
        <span>0</span>
      </div>

      <svg
        viewBox="0 0 700 260"
        preserveAspectRatio="none"
      >

        <defs>

          <linearGradient
            id="greenGradient"
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >

            <stop
              offset="0%"
              stopColor="#00c96b"
              stopOpacity="0.20"
            />

            <stop
              offset="100%"
              stopColor="#00c96b"
              stopOpacity="0"
            />

          </linearGradient>

        </defs>

        <path
          d="
            M 20 205
            L 125 165
            L 230 180
            L 335 95
            L 440 65
            L 545 135
            L 680 45
            L 680 260
            L 20 260
            Z
          "
          fill="url(#greenGradient)"
        />

        <path
          d="
            M 20 205
            L 125 165
            L 230 180
            L 335 95
            L 440 65
            L 545 135
            L 680 45
          "
          fill="none"
          stroke="#00b85f"
          strokeWidth="3"
        />

        {[20, 125, 230, 335, 440, 545, 680].map(
          (x, index) => {

            const y = [
              205,
              165,
              180,
              95,
              65,
              135,
              45,
            ][index];

            return (
              <circle
                key={x}
                cx={x}
                cy={y}
                r="5"
                fill="#00b85f"
              />
            );
          }
        )}

      </svg>

      <div className="chart-days">

        <span>Mon</span>
        <span>Tue</span>
        <span>Wed</span>
        <span>Thu</span>
        <span>Fri</span>
        <span>Sat</span>
        <span>Sun</span>

      </div>

    </div>
  );
}
