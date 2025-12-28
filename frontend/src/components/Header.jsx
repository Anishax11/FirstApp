import React, { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../firebase';
import './Header.css';

const Header = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/login');
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    return (
        <header className="header">
            <div className="header-content">
                <Link to="/" className="logo-link">
                    <h1 className="logo">SkillLens</h1>
                </Link>

                <nav className="nav-menu">
                    <NavLink to="/about" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                        About
                    </NavLink>
                    <NavLink to="/opportunities" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                        Opportunities
                    </NavLink>
                    <NavLink
                    to="/internships"
                    className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
                    >
                    Internships
                    </NavLink>
                    {user && (
                    <NavLink
                    to="/"
                    className={({ isActive }) =>
                        isActive ? "nav-link active" : "nav-link"
                    }
                    >
                    Recommended
                    </NavLink>
                )}
                </nav>

                <div className="profile-section">
                    {user ? (
                        <div className="user-controls">
                            <Link to="/profile" className="profile-icon" title="Go to Profile">
                                {user.photoURL ? (
                                    <img src={user.photoURL} alt="Profile" className="header-profile-img" />
                                ) : (
                                    <div className="default-avatar">{user.email?.charAt(0).toUpperCase()}</div>
                                )}
                            </Link>
                            <button onClick={handleLogout} className="logout-btn">Logout</button>
                        </div>
                    ) : (
                        <div className="auth-buttons">
                            <Link to="/login" className="auth-btn login-btn">Login</Link>
                            <Link to="/signup" className="auth-btn signup-btn">Sign Up</Link>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
