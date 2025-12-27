import { useState } from "react";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate("/profile");
        } catch (err) {
            setError("Failed to login. Please check your credentials.");
            console.error(err);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
            navigate("/profile");
        } catch (err) {
            setError("Google login failed.");
            console.error(err);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Welcome Back</h2>
                <p className="auth-subtitle">Login to access your profile and opportunities</p>

                {error && <div className="auth-error">{error}</div>}

                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            className="form-input"
                            placeholder="Enter your email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            className="form-input"
                            placeholder="Enter your password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn-primary auth-submit">Login</button>
                </form>

                <div className="divider">
                    <span>OR</span>
                </div>

                <button onClick={handleGoogleLogin} className="google-btn">
                    Login with Google
                </button>

                <p className="auth-footer">
                    Don't have an account? <Link to="/signup">Sign up</Link>
                </p>
            </div>

            <style>{`
                .auth-container {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 80vh;
                    padding: 1rem;
                }
                .auth-card {
                    background: white;
                    padding: 2.5rem;
                    border-radius: 12px;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                    width: 100%;
                    max-width: 400px;
                }
                .auth-card h2 {
                    text-align: center;
                    margin-bottom: 0.5rem;
                    color: #1f2937;
                }
                .auth-subtitle {
                    text-align: center;
                    color: #6b7280;
                    margin-bottom: 2rem;
                }
                .auth-error {
                    background: #fee2e2;
                    color: #ef4444;
                    padding: 0.75rem;
                    border-radius: 6px;
                    margin-bottom: 1rem;
                    font-size: 0.875rem;
                }
                .form-group {
                    margin-bottom: 1rem;
                }
                .form-group label {
                    display: block;
                    font-size: 0.875rem;
                    font-weight: 500;
                    color: #374151;
                    margin-bottom: 0.5rem;
                }
                .form-input {
                    width: 100%;
                    padding: 0.75rem;
                    border: 1px solid #d1d5db;
                    border-radius: 6px;
                    box-sizing: border-box;
                }
                .btn-primary {
                    background: #2563eb;
                    color: white;
                    border: none;
                    padding: 0.75rem;
                    border-radius: 6px;
                    font-weight: 600;
                    cursor: pointer;
                    width: 100%;
                    font-size: 1rem;
                }
                .btn-primary:hover {
                    background: #1d4ed8;
                }
                .divider {
                    text-align: center;
                    margin: 1.5rem 0;
                    position: relative;
                }
                .divider::before {
                    content: '';
                    position: absolute;
                    top: 50%;
                    left: 0;
                    width: 100%;
                    height: 1px;
                    background: #e5e7eb;
                    z-index: 0;
                }
                .divider span {
                    background: white;
                    padding: 0 1rem;
                    color: #6b7280;
                    font-size: 0.875rem;
                    position: relative;
                    z-index: 1;
                }
                .google-btn {
                    width: 100%;
                    padding: 0.75rem;
                    background: white;
                    border: 1px solid #d1d5db;
                    border-radius: 6px;
                    color: #374151;
                    font-weight: 500;
                    cursor: pointer;
                    transition: background 0.2s;
                }
                .google-btn:hover {
                    background: #f9fafb;
                }
                .auth-footer {
                    text-align: center;
                    margin-top: 1.5rem;
                    font-size: 0.875rem;
                    color: #6b7280;
                }
                .auth-footer a {
                    color: #2563eb;
                    text-decoration: none;
                    font-weight: 500;
                }
            `}</style>
        </div>
    );
};

export default Login;
