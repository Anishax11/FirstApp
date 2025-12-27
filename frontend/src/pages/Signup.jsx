import { useState } from "react";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider, db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";

const Signup = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            const res = await createUserWithEmailAndPassword(auth, email, password);
            // Create user document
            await setDoc(doc(db, "users", res.user.uid), {
                email: res.user.email,
                skills: [],
                resumeUrl: "",
                createdAt: new Date().toISOString(),
                role: "Student"
            });
            navigate("/profile");
        } catch (err) {
            setError("Failed to create account. " + err.message);
            console.error(err);
        }
    };

    const handleGoogleSignup = async () => {
        try {
            const res = await signInWithPopup(auth, googleProvider);
            // Check if user exists before overwriting? setDoc with merge: true is safer usually, 
            // but for simple signup we can just set. Ideally we should check existence.
            // Using setDoc with merge:true to be safe for existing google users
            await setDoc(doc(db, "users", res.user.uid), {
                email: res.user.email,
                name: res.user.displayName,
                skills: [], // Be careful not to wipe existing data if they login again
                resumeUrl: ""
            }, { merge: true });

            navigate("/profile");
        } catch (err) {
            setError("Google signup failed.");
            console.error(err);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Create Account</h2>
                <p className="auth-subtitle">Join SkillLens to boost your career</p>

                {error && <div className="auth-error">{error}</div>}

                <form onSubmit={handleSignup}>
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
                            placeholder="Create a password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn-primary auth-submit">Sign Up</button>
                </form>

                <div className="divider">
                    <span>OR</span>
                </div>

                <button onClick={handleGoogleSignup} className="google-btn">
                    Sign up with Google
                </button>

                <p className="auth-footer">
                    Already have an account? <Link to="/login">Login</Link>
                </p>
            </div>

            {/* Reusing styles from Login page via global CSS or inline-style duplication for safety in this specific task context where I can't browse all CSS files easily */}
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

export default Signup;
