import { Routes, Route, Navigate } from 'react-router-dom'
import useAuthStore from './store/authStore'

// Pages
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import StudentDashboard from './pages/StudentDashboard'
import AdminDashboard from './pages/AdminDashboard'
import CompanyDashboard from './pages/CompanyDashboard'
import JobsPage from './pages/JobsPage'
import JobDetailPage from './pages/JobDetailPage'
import ProfilePage from './pages/ProfilePage'
import RoadmapPage from './pages/RoadmapPage'
import ApplicationsPage from './pages/ApplicationsPage'

// Protected Route Component
function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, user } = useAuthStore()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to={`/${user?.role}`} replace />
  }
  return children
}

export default function App() {
  const { isAuthenticated, user } = useAuthStore()

  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={
        isAuthenticated ? <Navigate to={`/${user.role}`} replace /> : <LoginPage />
      } />
      <Route path="/register" element={
        isAuthenticated ? <Navigate to={`/${user.role}`} replace /> : <RegisterPage />
      } />

      {/* Student Routes */}
      <Route path="/student" element={
        <ProtectedRoute allowedRoles={['student']}>
          <StudentDashboard />
        </ProtectedRoute>
      } />
      <Route path="/student/profile" element={
        <ProtectedRoute allowedRoles={['student']}>
          <ProfilePage />
        </ProtectedRoute>
      } />
      <Route path="/student/applications" element={
        <ProtectedRoute allowedRoles={['student']}>
          <ApplicationsPage />
        </ProtectedRoute>
      } />
      <Route path="/student/roadmap/:jobId" element={
        <ProtectedRoute allowedRoles={['student']}>
          <RoadmapPage />
        </ProtectedRoute>
      } />

      {/* Admin Routes */}
      <Route path="/admin" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <AdminDashboard />
        </ProtectedRoute>
      } />

      {/* Company Routes */}
      <Route path="/company" element={
        <ProtectedRoute allowedRoles={['company']}>
          <CompanyDashboard />
        </ProtectedRoute>
      } />

      {/* Shared */}
      <Route path="/jobs" element={
        <ProtectedRoute allowedRoles={['student', 'admin', 'company']}>
          <JobsPage />
        </ProtectedRoute>
      } />
      <Route path="/jobs/:id" element={
        <ProtectedRoute allowedRoles={['student', 'admin', 'company']}>
          <JobDetailPage />
        </ProtectedRoute>
      } />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
