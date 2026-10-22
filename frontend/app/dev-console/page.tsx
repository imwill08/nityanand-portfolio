/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import "./admin.css";
import { fetchAllData } from "@/services/adminData";
import { apiRequest } from "@/services/api";
import LoginModal from "./components/LoginModal";
import ProfileSection from "./components/ProfileSection";
import SkillsSection from "./components/SkillsSection";
import ProjectsSection from "./components/ProjectsSection";
import TimelineSection from "./components/TimelineSection";
import {
  User,
  Code2,
  FolderGit2,
  Clock,
  Terminal,
  LogIn,
  LogOut,
  CheckCircle2,
  AlertCircle,
  Info,
  Menu,
  Send,
} from "lucide-react";

type Section = "profile" | "skills" | "projects" | "timeline" | "rawapi";

interface Toast { id: number; msg: string; type: string; }

const NAV = [
  { id: "profile", label: "Profile", icon: User },
  { id: "skills", label: "Skills", icon: Code2 },
  { id: "projects", label: "Projects", icon: FolderGit2 },
  { id: "timeline", label: "Timeline", icon: Clock },
  { id: "rawapi", label: "Raw API Tester", icon: Terminal },
] as const;

export default function DevConsole() {
  const [section, setSection] = useState<Section>("profile");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [loginMessage, setLoginMessage] = useState<string | undefined>(undefined);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [, setFetching] = useState(true);
  const toastCounter = useRef(0);

  // Raw API tester state
  const [rawEndpoint, setRawEndpoint] = useState("/api/skills/");
  const [rawMethod, setRawMethod] = useState("GET");
  const [rawBody, setRawBody] = useState("{}");
  const [rawResponse, setRawResponse] = useState<any>(null);
  const [rawLoading, setRawLoading] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("access_token"));
    fetchAllData().finally(() => setFetching(false));
  }, []);

  /* ── Toast helper ── */
  const toast = useCallback((msg: string, type = "success") => {
    const id = ++toastCounter.current;
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500);
  }, []);

  /* ── Auth gate ── */
  const requireAuth = useCallback((cb: () => void) => {
    if (localStorage.getItem("access_token")) { cb(); return; }
    setLoginMessage("Please sign in to save changes.");
    setPendingAction(() => cb);
    setLoginOpen(true);
  }, []);

  function handleLoginSuccess() {
    setIsLoggedIn(true);
    setLoginOpen(false);
    toast("Signed in successfully.", "success");
    if (pendingAction) { pendingAction(); setPendingAction(null); }
  }

  /* ── Logout confirmation ── */
  function promptLogout() {
    setLogoutConfirmOpen(true);
  }

  function confirmLogout() {
    localStorage.removeItem("access_token");
    setIsLoggedIn(false);
    setLogoutConfirmOpen(false);
    toast("Logged out successfully.", "info");
  }

  /* ── Raw API Tester ── */
  async function runRaw() {
    setRawLoading(true); setRawResponse(null);
    try {
      const body = rawMethod !== "GET" && rawMethod !== "DELETE" ? JSON.parse(rawBody) : undefined;
      const data = await apiRequest(rawEndpoint, rawMethod, body);
      setRawResponse(data);
    } catch (e: any) {
      setRawResponse({ error: e.message });
    }
    finally { setRawLoading(false); }
  }

  function navigate(id: Section) { setSection(id); setSidebarOpen(false); }

  const sectionProps = { requireAuth, toast };
  const currentNav = NAV.find(n => n.id === section);
  const CurrentIcon = currentNav?.icon || User;

  return (
    <div className="admin-root">

      {/* ── SIDEBAR BACKDROP (mobile) ── */}
      <div
        className={`sidebar-backdrop${sidebarOpen ? " open" : ""}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* ── SIDEBAR ── */}
      <aside className={`admin-sidebar${sidebarOpen ? " open" : ""}`}>
        <div className="admin-sidebar-logo">
          <div className="logo-badge">Admin</div>
        </div>

        <nav className="admin-nav">
          {NAV.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              className={`admin-nav-item${section === id ? " active" : ""}`}
              onClick={() => navigate(id as Section)}
            >
              <Icon size={16} className="nav-icon" />
              <span>{label}</span>
            </button>
          ))}
        </nav>

        <div style={{ padding: "14px 16px", borderTop: "1px solid var(--admin-border)" }}>
          {isLoggedIn ? (
            <button className="btn btn-ghost btn-sm" style={{ width: "100%", gap: 7 }} onClick={promptLogout}>
              <LogOut size={14} /> Log Out
            </button>
          ) : (
            <button className="btn btn-primary btn-sm" style={{ width: "100%", gap: 7 }} onClick={() => { setLoginMessage(undefined); setLoginOpen(true); }}>
              <LogIn size={14} /> Log In
            </button>
          )}
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main className="admin-main">

        {/* ── TOPBAR ── */}
        <header className="admin-topbar">
          <div className="topbar-left">
            <button className="sidebar-toggle" onClick={() => setSidebarOpen(o => !o)} aria-label="Toggle sidebar">
              <Menu size={18} />
            </button>
            <div className="flex items-center gap-2 topbar-title">
              <CurrentIcon size={18} style={{ color: "var(--admin-accent)" }} />
              <span>{currentNav?.label}</span>
            </div>
          </div>

          <div className="topbar-right">
            <div className={`auth-badge ${isLoggedIn ? "in" : "out"}`}>
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  backgroundColor: isLoggedIn ? "var(--success)" : "var(--danger)",
                  display: "inline-block"
                }}
              />
              <span>{isLoggedIn ? "Active Session" : "Read Only"}</span>
            </div>
            {isLoggedIn ? (
              <button className="btn btn-ghost btn-sm" onClick={promptLogout} style={{ gap: 6 }}>
                <LogOut size={13} /> Log Out
              </button>
            ) : (
              <button className="btn btn-primary btn-sm" onClick={() => { setLoginMessage(undefined); setLoginOpen(true); }} style={{ gap: 6 }}>
                <LogIn size={13} /> Log In
              </button>
            )}
          </div>
        </header>

        {/* ── CONTENT ── */}
        <div className="admin-content">
          {section === "profile" && <ProfileSection  {...sectionProps} />}
          {section === "skills" && <SkillsSection   {...sectionProps} />}
          {section === "projects" && <ProjectsSection {...sectionProps} />}
          {section === "timeline" && <TimelineSection {...sectionProps} />}

          {/* ── RAW API TESTER ── */}
          {section === "rawapi" && (
            <div>
              <div className="section-header">
                <h2>Raw API Explorer</h2>
                <p>Execute direct requests to backend endpoints for verification and testing.</p>
              </div>
              <div className="card">
                <div className="card-title">Request Payload</div>
                <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
                  <select className="form-select" style={{ width: 120, flex: "none" }} value={rawMethod} onChange={e => setRawMethod(e.target.value)}>
                    {["GET", "POST", "PUT", "DELETE", "PATCH"].map(m => <option key={m}>{m}</option>)}
                  </select>
                  <input className="form-input" style={{ flex: 1, minWidth: 200 }} value={rawEndpoint} onChange={e => setRawEndpoint(e.target.value)} placeholder="/api/skills/" />
                </div>
                {rawMethod !== "GET" && rawMethod !== "DELETE" && (
                  <div className="form-group">
                    <label className="form-label">Request Body (JSON)</label>
                    <textarea className="textarea-code" rows={8} value={rawBody} onChange={e => setRawBody(e.target.value)} />
                  </div>
                )}
                <button className="btn btn-primary" disabled={rawLoading} onClick={runRaw} style={{ gap: 6 }}>
                  <Send size={14} /> {rawLoading ? "Sending…" : "Send Request"}
                </button>
              </div>
              <div className="card">
                <div className="card-title">Response</div>
                <pre style={{
                  background: "var(--admin-card)",
                  color: "var(--admin-accent)",
                  border: "1px solid var(--admin-border)",
                  padding: 16,
                  borderRadius: "var(--radius-sm, 4px)",
                  fontSize: "0.82rem",
                  overflowX: "auto",
                  maxHeight: 500,
                  fontFamily: "var(--ff-mono, monospace)"
                }}>
                  {rawResponse ? JSON.stringify(rawResponse, null, 2) : "No response yet."}
                </pre>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ── LOGIN MODAL ── */}
      {loginOpen && (
        <LoginModal
          message={loginMessage}
          onClose={() => { setLoginOpen(false); setPendingAction(null); }}
          onSuccess={handleLoginSuccess}
        />
      )}

      {/* ── LOGOUT CONFIRMATION MODAL ── */}
      {logoutConfirmOpen && (
        <div className="modal-overlay" onClick={() => setLogoutConfirmOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-title">Confirm Logout</div>
            <div className="modal-subtitle">
              Are you sure you want to end your current session? Any unsaved edits will be discarded.
            </div>
            <div className="btn-group" style={{ justifyContent: "flex-end", marginTop: 24, gap: 10 }}>
              <button className="btn btn-ghost" onClick={() => setLogoutConfirmOpen(false)}>
                Cancel
              </button>
              <button className="btn btn-danger" onClick={confirmLogout} style={{ gap: 6 }}>
                <LogOut size={14} /> Confirm Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── TOASTS ── */}
      <div style={{ position: "fixed", bottom: 24, right: 24, display: "flex", flexDirection: "column", gap: 8, zIndex: 2000 }}>
        {toasts.map(t => (
          <div key={t.id} className={`toast toast-${t.type === "error" ? "error" : t.type === "info" ? "info" : "success"}`} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {t.type === "error" ? <AlertCircle size={16} /> : t.type === "info" ? <Info size={16} /> : <CheckCircle2 size={16} />}
            <span>{t.msg}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
