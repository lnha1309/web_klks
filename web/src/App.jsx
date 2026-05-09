import React from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext.jsx';
import { Toaster } from './components/ui/sonner';
import ScrollToTop from './components/ScrollToTop';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import HomePage from './pages/HomePage.jsx';
import CheckerPage from './pages/CheckerPage.jsx';
import EducationPage from './pages/EducationPage.jsx';
import MyHistoryPage from './pages/MyHistoryPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import SignupPage from './pages/SignupPage.jsx';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="flex flex-col min-h-screen">
          <ScrollToTop />
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/checker" element={<CheckerPage />} />
              <Route path="/education" element={<EducationPage />} />
              <Route 
                path="/history" 
                element={
                  <ProtectedRoute>
                    <MyHistoryPage />
                  </ProtectedRoute>
                } 
              />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
            </Routes>
          </main>
          <Footer />
          <Toaster />
        </div>
      </AuthProvider>
    </Router>
  );
}
export default App;
