import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import MatchingInternships from './components/MatchingInternships';
import InternshipList from './components/InternshipList';
import Profile from './pages/Profile';
import About from './pages/About';
import Opportunities from './pages/Opportunities';
import './App.css';
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Header />
          <main className="main-content">
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/about" element={<About />} />
              <Route path="/opportunities" element={<Opportunities />} />

              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/" element={
                  <>
                    <MatchingInternships />
                    <InternshipList />
                  </>
                } />
                <Route path="/profile" element={<Profile />} />
                <Route path="/internships" element={<InternshipList />} />
              </Route>
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
