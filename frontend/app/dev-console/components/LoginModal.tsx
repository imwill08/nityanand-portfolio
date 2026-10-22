"use client";
import { useState } from "react";
import { login } from "@/services/auth";
import { Eye, EyeOff, LogIn } from "lucide-react";

interface Props {
    onClose: () => void;
    onSuccess: () => void;
    message?: string;
}

export default function LoginModal({ onClose, onSuccess, message }: Props) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPw, setShowPw] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleLogin() {
        if (!email || !password) { setError("Please fill in all fields."); return; }
        setLoading(true); setError("");
        try {
            await login(email, password);
            onSuccess();
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : "Authentication failed.");
        } finally { setLoading(false); }
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-title flex items-center gap-2">
                    <LogIn size={20} style={{ color: "var(--admin-accent)" }} />
                    <span>Admin Authentication</span>
                </div>
                <div className="modal-subtitle">{message || "Sign in to modify portfolio content."}</div>
                {error && <div className="alert alert-error">{error}</div>}

                <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input
                        className="form-input"
                        type="email"
                        placeholder="admin@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">Password</label>
                    <div style={{ position: "relative" }}>
                        <input
                            className="form-input"
                            type={showPw ? "text" : "password"}
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                            style={{ paddingRight: 40 }}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPw(!showPw)}
                            style={{
                                position: "absolute",
                                right: 10,
                                top: "50%",
                                transform: "translateY(-50%)",
                                background: "none",
                                border: "none",
                                color: "var(--admin-text-dim)",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center"
                            }}
                            aria-label={showPw ? "Hide password" : "Show password"}
                        >
                            {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>
                </div>

                <div className="btn-group" style={{ marginTop: 22 }}>
                    <button className="btn btn-primary" onClick={handleLogin} disabled={loading} style={{ flex: 1, gap: 6 }}>
                        <LogIn size={14} />
                        {loading ? "Authenticating…" : "Sign In"}
                    </button>
                    <button className="btn btn-ghost" onClick={onClose}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}
