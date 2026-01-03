import { useState } from "react";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider, db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import "./Auth.css"; // Shared Premium Dark Theme

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
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M23.52 12.29C23.52 11.43 23.44 10.61 23.3 9.82H12V14.45H18.46C18.18 15.92 17.33 17.16 16.06 18.01V20.98H19.93C22.19 18.9 23.52 15.83 23.52 12.29Z" fill="#4285F4" />
                        <path d="M12 24C15.24 24 17.96 22.92 19.93 21.1L16.06 18.13C14.99 18.85 13.62 19.27 12 19.27C8.87 19.27 6.22 17.16 5.27 14.36H1.27V17.46C3.25 21.39 7.32 24 12 24Z" fill="#34A853" />
                        <path d="M5.27 14.36C4.78 12.89 4.78 11.11 5.27 9.64V6.54H1.27C-0.42 9.89 -0.42 14.11 1.27 17.46L5.27 14.36Z" fill="#FBBC05" />
                        <path d="M12 4.73C13.72 4.73 15.27 5.34 16.48 6.5L19.98 3C17.82 0.97 14.99 -0.13 12 0.04C7.32 0.04 3.25 2.65 1.27 6.58L5.27 9.68C6.22 6.88 8.87 4.73 12 4.73Z" fill="#EA4335" />
                    </svg>
                    Sign up with Google
                </button>

                <p className="auth-footer">
                    Already have an account? <Link to="/login">Login</Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;
