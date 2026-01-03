import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "../firebase";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let unsubscribeSnapshot = null;

        const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            setLoading(true);

            if (user) {
                // Real-time listener for user data
                const userRef = doc(db, "users", user.uid);
                unsubscribeSnapshot = onSnapshot(userRef, (docSnap) => {
                    if (docSnap.exists()) {
                        setUserData(docSnap.data());
                    } else {
                        setUserData(null);
                    }
                    setLoading(false);
                }, (error) => {
                    console.error("Error fetching user data:", error);
                    setUserData(null);
                    setLoading(false);
                });
            } else {
                // Determine if we need to unsubscribe from previous user
                if (unsubscribeSnapshot) {
                    unsubscribeSnapshot();
                    unsubscribeSnapshot = null;
                }
                setUserData(null);
                setLoading(false);
            }
        });

        return () => {
            unsubscribeAuth();
            if (unsubscribeSnapshot) {
                unsubscribeSnapshot();
            }
        };
    }, []);

    const value = {
        currentUser,
        userData, // Expose user data from Firestore
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
