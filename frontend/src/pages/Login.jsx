import { useState } from "react";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import { useNavigate, Link } from "react-router-dom";
import "./Auth.css"; // New Premium Dark Theme

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
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M23.52 12.29C23.52 11.43 23.44 10.61 23.3 9.82H12V14.45H18.46C18.18 15.92 17.33 17.16 16.06 18.01V20.98H19.93C22.19 18.9 23.52 15.83 23.52 12.29Z" fill="#4285F4" />
                        <path d="M12 24C15.24 24 17.96 22.92 19.93 21.1L16.06 18.13C14.99 18.85 13.62 19.27 12 19.27C8.87 19.27 6.22 17.16 5.27 14.36H1.27V17.46C3.25 21.39 7.32 24 12 24Z" fill="#34A853" />
                        <path d="M5.27 14.36C4.78 12.89 4.78 11.11 5.27 9.64V6.54H1.27C-0.42 9.89 -0.42 14.11 1.27 17.46L5.27 14.36Z" fill="#FBBC05" />
                        <path d="M12 4.73C13.72 4.73 15.27 5.34 16.48 6.5L19.98 3C17.82 0.97 14.99 -0.13 12 0.04C7.32 0.04 3.25 2.65 1.27 6.58L5.27 9.68C6.22 6.88 8.87 4.73 12 4.73Z" fill="#EA4335" />
                    </svg>
                    Login with Google
                </button>

                <p className="auth-footer">
                    Don't have an account? <Link to="/signup">Sign up</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
