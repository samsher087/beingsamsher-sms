import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Public Website Pages
import { PublicLayout } from './components/PublicLayout';
import { HomePage } from './pages/public/HomePage';
import { AcademicsPage } from './pages/public/AcademicsPage';
import { FacilitiesPage } from './pages/public/FacilitiesPage';
import { NoticesPage as PublicNoticesPage } from './pages/public/NoticesPage';
import { AdmissionsPage as PublicAdmissionsPage } from './pages/public/AdmissionsPage';
import { ContactPage } from './pages/public/ContactPage';

// Auth Pages
import { LoginPage } from './pages/auth/LoginPage';

// Dashboard Pages
import { DashboardLayout } from './components/DashboardLayout';
import { DashboardOverview } from './pages/dashboard/DashboardOverview';
import { StudentsPage } from './pages/dashboard/StudentsPage';
import { TeachersPage } from './pages/dashboard/TeachersPage';
import { ClassesPage } from './pages/dashboard/ClassesPage';
import { AttendancePage } from './pages/dashboard/AttendancePage';
import { FeesPage } from './pages/dashboard/FeesPage';
import { ExamsPage } from './pages/dashboard/ExamsPage';
import { TimetablePage } from './pages/dashboard/TimetablePage';
import { AdmissionsPage as DashboardAdmissionsPage } from './pages/dashboard/AdmissionsPage';
import { HomeworkPage } from './pages/dashboard/HomeworkPage';
import { NoticesPage as DashboardNoticesPage } from './pages/dashboard/NoticesPage';
import { LibraryPage } from './pages/dashboard/LibraryPage';
import { TransportPage } from './pages/dashboard/TransportPage';
import { WebsiteCMSPage } from './pages/dashboard/WebsiteCMSPage';
import { SuperAdminTenantsPage } from './pages/dashboard/SuperAdminTenantsPage';
import { AuditLogsPage } from './pages/dashboard/AuditLogsPage';
import { SchoolSettingsPage } from './pages/dashboard/SchoolSettingsPage';

import { RoleProtectedRoute } from './components/RoleProtectedRoute';

export const App: React.FC = () => {
  return (
    <Routes>
      {/* Root redirect to public school website */}
      <Route path="/" element={<Navigate to="/public/dps-rkp" replace />} />

      {/* Public School Website Pages */}
      <Route path="/public/:tenantCode" element={<PublicLayout />}>
        <Route index element={<HomePage />} />
        <Route path="about" element={<HomePage />} />
        <Route path="academics" element={<AcademicsPage />} />
        <Route path="facilities" element={<FacilitiesPage />} />
        <Route path="notices" element={<PublicNoticesPage />} />
        <Route path="admissions" element={<PublicAdmissionsPage />} />
        <Route path="contact" element={<ContactPage />} />
      </Route>

      {/* Authentication */}
      <Route path="/login" element={<LoginPage />} />

      {/* Authenticated Dashboard */}
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<DashboardOverview />} />
        
        {/* Role Protected Routes */}
        <Route
          path="students"
          element={
            <RoleProtectedRoute allowedRoles={['SUPER_ADMIN', 'SCHOOL_ADMIN', 'PRINCIPAL', 'ACCOUNTANT', 'TEACHER']}>
              <StudentsPage />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="teachers"
          element={
            <RoleProtectedRoute allowedRoles={['SUPER_ADMIN', 'SCHOOL_ADMIN', 'PRINCIPAL']}>
              <TeachersPage />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="classes"
          element={
            <RoleProtectedRoute allowedRoles={['SUPER_ADMIN', 'SCHOOL_ADMIN', 'PRINCIPAL']}>
              <ClassesPage />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="attendance"
          element={
            <RoleProtectedRoute allowedRoles={['SUPER_ADMIN', 'SCHOOL_ADMIN', 'PRINCIPAL', 'TEACHER', 'STUDENT', 'PARENT']}>
              <AttendancePage />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="fees"
          element={
            <RoleProtectedRoute allowedRoles={['SUPER_ADMIN', 'SCHOOL_ADMIN', 'PRINCIPAL', 'ACCOUNTANT', 'STUDENT', 'PARENT']}>
              <FeesPage />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="exams"
          element={
            <RoleProtectedRoute allowedRoles={['SUPER_ADMIN', 'SCHOOL_ADMIN', 'PRINCIPAL', 'TEACHER', 'STUDENT', 'PARENT']}>
              <ExamsPage />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="timetable"
          element={
            <RoleProtectedRoute allowedRoles={['SUPER_ADMIN', 'SCHOOL_ADMIN', 'PRINCIPAL', 'TEACHER', 'STUDENT']}>
              <TimetablePage />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="admissions"
          element={
            <RoleProtectedRoute allowedRoles={['SUPER_ADMIN', 'SCHOOL_ADMIN', 'PRINCIPAL']}>
              <DashboardAdmissionsPage />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="homework"
          element={
            <RoleProtectedRoute allowedRoles={['TEACHER', 'STUDENT', 'PARENT']}>
              <HomeworkPage />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="notices"
          element={
            <RoleProtectedRoute allowedRoles={['SUPER_ADMIN', 'SCHOOL_ADMIN', 'PRINCIPAL', 'TEACHER', 'STUDENT', 'PARENT']}>
              <DashboardNoticesPage />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="library"
          element={
            <RoleProtectedRoute allowedRoles={['SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER', 'STUDENT']}>
              <LibraryPage />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="transport"
          element={
            <RoleProtectedRoute allowedRoles={['SUPER_ADMIN', 'SCHOOL_ADMIN', 'PRINCIPAL', 'PARENT']}>
              <TransportPage />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="website-cms"
          element={
            <RoleProtectedRoute allowedRoles={['SUPER_ADMIN', 'SCHOOL_ADMIN']}>
              <WebsiteCMSPage />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="tenants"
          element={
            <RoleProtectedRoute allowedRoles={['SUPER_ADMIN']}>
              <SuperAdminTenantsPage />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="audit-logs"
          element={
            <RoleProtectedRoute allowedRoles={['SUPER_ADMIN', 'SCHOOL_ADMIN']}>
              <AuditLogsPage />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="settings"
          element={
            <RoleProtectedRoute allowedRoles={['SUPER_ADMIN', 'SCHOOL_ADMIN']}>
              <SchoolSettingsPage />
            </RoleProtectedRoute>
          }
        />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/public/dps-rkp" replace />} />
    </Routes>
  );
};

export default App;
