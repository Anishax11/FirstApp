import React, { useState, useEffect } from 'react';
import { auth, db, storage } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { getAuth } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../api';
import './Profile.css';



const Profile = () => {
    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        skills: [],
        resumeUrl: '',
        college: '',
        role: 'Student'
    });
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [skillInput, setSkillInput] = useState('');


    // Additional fields for Basic Info
    const [editMode, setEditMode] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                const userRef = doc(db, "users", currentUser.uid);
                try {
                    const userSnap = await getDoc(userRef);
                    if (userSnap.exists()) {
                        setUserData({ ...userSnap.data() });
                    } else {
                        // Create basic structure if new user
                        const newUserData = {
                            name: currentUser.displayName || "User",
                            email: currentUser.email,
                            photoURL: currentUser.photoURL || "",
                            createdAt: new Date().toISOString(),
                            skills: [],
                            resumeUrl: "",
                            college: "",
                            role: "Student"
                        };
                        // Attempt to save, but if it fails (permissions), just set local state
                        try {
                            await setDoc(userRef, newUserData);
                        } catch (e) {
                            console.warn("Could not create user doc in Firestore:", e);
                        }
                        setUserData(newUserData);
                    }
                } catch (err) {
                    console.error("Error fetching user data:", err);
                }
            } else {
                setUser(null);
                setUserData(null); // Clear data on logout
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleResumeUpload = async (e) => {
        setUploading(true);
        const file = e.target.files[0];
        if (!file) { setUploading(false); return; }

        try {
            const auth = getAuth();
            const token = await auth.currentUser.getIdToken();

            const formData = new FormData();
            formData.append("resume", file);

            const res = await fetch(`${BASE_URL}/upload-resume`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            const data = await res.json();
            console.log("Upload response:", data);

            if (data.success) {
                // Update local state with extracted skills and flag
                if (data.extractedSkills && data.extractedSkills.length > 0) {
                    setUserData(prev => ({
                        ...prev,
                        resumeText: "resume extracted", // optimistic update to hide banner
                        // Merge skills unique
                        skills: Array.from(new Set([...(prev.skills || []), ...data.extractedSkills]))
                    }));
                    alert(`Resume uploaded! Found ${data.extractedSkills.length} skills.`);
                } else {
                    setUserData(prev => ({ ...prev, resumeText: "resume extracted" }));
                    alert("Resume uploaded!");
                }
            } else {
                alert("Upload failed: " + (data.error || "Unknown error"));
            }
        } catch (err) {
            console.error(err);
            alert("Error uploading resume.");
        } finally {
            setUploading(false);
        }
    };

    const handleRemoveSkill = async (skillToRemove) => {
        try {
            const userRef = doc(db, "users", user.uid);
            // Updating backend
            await updateDoc(userRef, {
                skills: arrayRemove(skillToRemove)
            });
            // Updating local UI
            setUserData(prev => ({
                ...prev,
                skills: prev.skills.filter(s => s !== skillToRemove)
            }));
        } catch (error) {
            console.error("Error removing skill:", error);
        }
    };

    const handleAddSkills = async () => {
        if (!skillInput.trim()) return;

        const newSkills = skillInput.split(',').map(skill => skill.trim()).filter(skill => skill !== "");

        try {
            const userRef = doc(db, "users", user.uid);

            // Update Firestore
            await updateDoc(userRef, {
                skills: arrayUnion(...newSkills)
            });

            // Update local state is safer to do after confirmation, but for UI responsiveness we do it here too
            // or fetch usually.
        } catch (error) {
            console.error("Error adding skills:", error);
        }

        // Optimistic update for UI
        setUserData(prev => ({
            ...prev,
            skills: [...(prev.skills || []), ...newSkills.filter(s => !prev.skills?.includes(s))]
        }));
        setSkillInput("");
    };

    const handleInfoUpdate = async (e) => {
        e.preventDefault();
        try {
            const userRef = doc(db, "users", user.uid);
            await updateDoc(userRef, {
                name: userData.name,
                college: userData.college,
                role: userData.role
            });
            alert("Profile updated!");
            setEditMode(false);
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Failed to update profile.");
        }
    };

    if (loading) return <div className="loading-container">Loading Profile...</div>;

    // If no user caused by no data found event though logged in (edge case), or just clean redirect handles this
    if (!userData) {
        // Optionally we could redirect here programmatically, but rendering a clear login prompt is also good UX vs potential infinite redirect loops
        return (
            <div className="access-denied" style={{ textAlign: 'center', padding: '4rem' }}>
                <h2>Please Log In</h2>
                <p>You need to be logged in to view your profile.</p>
                <div style={{ marginTop: '1rem' }}>
                    <a href="/login" style={{ marginRight: '1rem', color: '#2563eb' }}>Login</a>
                    <a href="/signup" style={{ color: '#2563eb' }}>Sign Up</a>
                </div>
            </div>
        );
    }

    return (
        <div className="profile-page">
            <div className="profile-header-card">
                <div className="profile-avatar-container">
                    <img
                        src={user?.photoURL || userData.photoURL || "https://via.placeholder.com/150"}
                        alt="Profile"
                        className="profile-avatar"
                    />
                </div>
                <div className="profile-info">
                    <h1>{userData.name || "User Name"}</h1>
                    <p className="profile-email">{userData.email || "user@example.com"}</p>
                    <p style={{ color: '#6b7280', marginTop: '0.25rem' }}>{userData.role} • {userData.college || "Add College"}</p>
                </div>
            </div>

            <div className="profile-grid">
                <div className="left-column">
                    <div className="card skills-section">
                        <h2>Skills</h2>
                        <div className="skills-input-wrapper">
                            <input
                                type="text"
                                className="form-input"
                                value={skillInput}
                                onChange={(e) => setSkillInput(e.target.value)}
                                placeholder="Add skills (e.g. React, Java, Design)..."
                            />
                            <button onClick={handleAddSkills} className="btn-primary" style={{ padding: '0.5rem 1rem' }}>Add</button>
                        </div>
                        <div className="skills-container">
                            {userData.skills && userData.skills.length > 0 ? (
                                userData.skills.map((skill, index) => (
                                    <span key={index} className="skill-tag">
                                        {skill}
                                        <button
                                            className="remove-skill-btn"
                                            onClick={() => handleRemoveSkill(skill)}
                                            style={{ marginLeft: '6px', background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', fontWeight: 'bold' }}
                                        >
                                            ×
                                        </button>
                                    </span>
                                ))
                            ) : (
                                <p style={{ color: '#9ca3af', fontStyle: 'italic' }}>No skills added yet.</p>
                            )}
                        </div>
                    </div>

                    <div className="card resume-section">
                        <h2>Resume</h2>
                        {userData.resumeUrl ? (
                            <div className="current-resume">
                                <a href={userData.resumeUrl} target="_blank" rel="noopener noreferrer" className="resume-link">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
                                    View Uploaded Resume
                                </a>
                            </div>
                        ) : null}

                        <div className="resume-upload-zone">
                            <label className="upload-label">
                                {uploading ? 'Uploading...' : 'Upload PDF Resume'}
                                <input
                                    type="file"
                                    className="file-input"
                                    accept="application/pdf"
                                    onChange={handleResumeUpload}
                                    disabled={uploading}
                                />
                            </label>
                            <p style={{ margin: '0.5rem 0 0', fontSize: '0.8rem', color: '#9ca3af' }}>Supported formats: PDF only</p>
                        </div>
                    </div>
                </div>

                <div className="right-column">
                    <div className="card basic-info">
                        <h2>Basic Info</h2>
                        <form onSubmit={handleInfoUpdate}>
                            <div className="form-group">
                                <label>Full Name</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={userData.name}
                                    onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Email (Read Only)</label>
                                <input
                                    type="email"
                                    className="form-input"
                                    value={userData.email}
                                    disabled
                                />
                            </div>
                            <div className="form-group">
                                <label>College / University</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={userData.college || ''}
                                    onChange={(e) => setUserData({ ...userData, college: e.target.value })}
                                    placeholder="Enter your college name"
                                />
                            </div>
                            <div className="form-group">
                                <label>Role</label>
                                <select
                                    className="form-input"
                                    value={userData.role || 'Student'}
                                    onChange={(e) => setUserData({ ...userData, role: e.target.value })}
                                >
                                    <option value="Student">Student</option>
                                    <option value="Professional">Professional</option>
                                    <option value="Freelancer">Freelancer</option>
                                </select>
                            </div>
                            <button type="submit" className="btn-primary" style={{ width: '100%' }}>Save Changes</button>
                        </form>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Profile;
