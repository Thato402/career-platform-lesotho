import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import { auth } from './services/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { getUserProfile } from './services/realtimeDb';
import './styles/App.css';

// ✅ Public Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Institutions from './pages/Institutions';
import Courses from './pages/Courses';
import Jobs from './pages/Jobs';
import About from './pages/About';

// ✅ User Pages
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Applications from './pages/Applications';
import Transcripts from './pages/Transcripts';

// ✅ Institution Pages
import InstitutionDashboard from './pages/InstitutionDashboard';
import InstitutionCourses from './pages/InstitutionCourses';
import InstitutionApplications from './pages/InstitutionApplications';
import InstitutionAnalytics from './pages/InstitutionAnalytics';
import InstitutionProfile from './pages/InstitutionProfile';
import InstituteStudents from './pages/InstituteStudents';

// ✅ Company Pages
import CompanyDashboard from './pages/CompanyDashboard';
import QualifiedApplicants from './pages/QualifiedApplicants';
import HiringMetrics from './pages/HiringMetrics';
import InterviewManagement from './pages/InterviewManagement';
import CompanyManagement from './pages/CompanyManagement'; // ✅ Added Company Management

// ✅ Admin Pages
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminInstitutions from './pages/AdminInstitutions';
import AdminReports from './pages/AdminReports';
import AdminSettings from './pages/AdminSettings';

function App() {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        console.log('Firebase user detected:', firebaseUser.uid);
        try {
          const profile = await getUserProfile(firebaseUser.uid);
          const userData = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            name: firebaseUser.displayName || profile?.name,
            role: profile?.role || 'student',
            institution: profile?.institution
          };
          setUser(userData);
          setUserProfile(profile);
        } catch (error) {
          console.error('Error fetching user profile:', error);
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            name: firebaseUser.displayName || firebaseUser.email.split('@')[0],
            role: 'student'
          });
        }
      } else {
        console.log('No Firebase user, checking localStorage');
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          const userData = JSON.parse(savedUser);
          setUser(userData);
          setUserProfile({
            name: userData.name,
            role: userData.role,
            institution: userData.institution
          });
        } else {
          setUser(null);
          setUserProfile(null);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = (userData) => {
    console.log('Handling login for user:', userData);
    setUser(userData);
    setUserProfile({
      name: userData.name,
      role: userData.role,
      institution: userData.institution
    });
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = async () => {
    try {
      const AuthService = await import('./services/authService');
      await AuthService.default.logoutUser();
    } catch (error) {
      console.error('Error signing out from Firebase:', error);
    } finally {
      setUser(null);
      setUserProfile(null);
      localStorage.removeItem('user');
    }
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading CareerPath Lesotho...</p>
      </div>
    );
  }

  return (
    <div className="App">
      <Header user={user} userProfile={userProfile} onLogout={handleLogout} />
      <main>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register onLogin={handleLogin} />} />
          <Route path="/institutions" element={<Institutions />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/companies" element={<CompanyManagement />} /> {/* ✅ Added public companies route */}

          {/* User Routes */}
          <Route path="/dashboard" element={<Dashboard user={user} userProfile={userProfile} />} />
          <Route path="/profile" element={<Profile user={user} userProfile={userProfile} />} />
          <Route path="/applications" element={<Applications user={user} userProfile={userProfile} />} />
          <Route path="/transcripts" element={<Transcripts user={user} userProfile={userProfile} />} />

          {/* Institution Routes */}
          <Route path="/institution-dashboard" element={<InstitutionDashboard user={user} userProfile={userProfile} />} />
          <Route path="/institution/courses" element={<InstitutionCourses user={user} userProfile={userProfile} />} />
          <Route path="/institution/applications" element={<InstitutionApplications user={user} userProfile={userProfile} />} />
          <Route path="/institution/analytics" element={<InstitutionAnalytics user={user} userProfile={userProfile} />} />
          <Route path="/institution/profile" element={<InstitutionProfile user={user} userProfile={userProfile} />} />
          <Route path="/institution/students" element={<InstituteStudents user={user} userProfile={userProfile} />} />

          {/* Company Routes */}
          <Route path="/company-dashboard" element={<CompanyDashboard user={user} userProfile={userProfile} />} />
          <Route path="/candidates" element={<QualifiedApplicants user={user} userProfile={userProfile} />} />
          <Route path="/analytics" element={<HiringMetrics user={user} userProfile={userProfile} />} />
          <Route path="/interviews" element={<InterviewManagement user={user} userProfile={userProfile} />} />
          <Route path="/company/management" element={<CompanyManagement user={user} userProfile={userProfile} />} /> {/* ✅ Added company management route */}

          {/* Admin Routes */}
          <Route path="/admin-dashboard" element={<AdminDashboard user={user} userProfile={userProfile} />} />
          <Route path="/admin/users" element={<AdminUsers user={user} userProfile={userProfile} />} />
          <Route path="/admin/institutions" element={<AdminInstitutions user={user} userProfile={userProfile} />} />
          <Route path="/admin/reports" element={<AdminReports user={user} userProfile={userProfile} />} />
          <Route path="/admin/settings" element={<AdminSettings user={user} userProfile={userProfile} />} />
          <Route path="/admin/companies" element={<CompanyManagement user={user} userProfile={userProfile} />} /> {/* ✅ Updated to use actual CompanyManagement component */}

          {/* Catch-all route for 404 pages */}
          <Route path="*" element={
            <div className="page-placeholder">
              <h1>404 - Page Not Found</h1>
              <p>The page you're looking for doesn't exist.</p>
              <div className="placeholder-actions">
                <button onClick={() => window.history.back()} className="btn btn-primary">
                  Go Back
                </button>
                <button onClick={() => window.location.href = '/'} className="btn btn-outline">
                  Go Home
                </button>
              </div>
            </div>
          } />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;