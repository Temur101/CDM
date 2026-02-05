import type { FC } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Courses from './pages/Courses';
import Groups from './pages/Groups';
import Teachers from './pages/Teachers';
import TeacherDetails from './pages/TeacherDetails';
import Payments from './pages/Payments';
import Login from './pages/Login';
import StudentForm from './pages/StudentForm';
import StudentDetails from './pages/StudentDetails';
import TeacherForm from './pages/TeacherForm';
import CourseForm from './pages/CourseForm';
import CourseDetails from './pages/CourseDetails';
import GroupForm from './pages/GroupForm';
import GroupDetails from './pages/GroupDetails';
import { useAuth } from './context/AuthContext';

const ProtectedRoute: FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div>Загрузка...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const App: FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />

          <Route path="students" element={<Students />} />
          <Route path="students/new" element={<StudentForm />} />
          <Route path="students/:id" element={<StudentDetails />} />
          <Route path="students/edit/:id" element={<StudentForm />} />

          <Route path="courses" element={<Courses />} />
          <Route path="courses/new" element={<CourseForm />} />
          <Route path="courses/:id" element={<CourseDetails />} />
          <Route path="courses/edit/:id" element={<CourseForm />} />

          <Route path="groups" element={<Groups />} />
          <Route path="groups/new" element={<GroupForm />} />
          <Route path="groups/:id" element={<GroupDetails />} />
          <Route path="groups/edit/:id" element={<GroupForm />} />

          <Route path="teachers" element={<Teachers />} />
          <Route path="teachers/new" element={<TeacherForm />} />
          <Route path="teachers/:id" element={<TeacherDetails />} />
          <Route path="teachers/edit/:id" element={<TeacherForm />} />

          <Route path="payments" element={<Payments />} />
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
