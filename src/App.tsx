import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import MainPage from './pages/MainPage/MainPage';
import AdminLayout from './layouts/AdminLayout';
import NotFoundPage from './pages/NotFoundPage/NotFoundPage';
import Organization from './pages/Admin/Organization/Organization';
import AddUserPage from './pages/Admin/Organization/AddUserPage/AddUserPage';

export default function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <MainLayout>
            <MainPage />
          </MainLayout>
        }
      />
      <Route path="/admin" element={<AdminLayout />}>
        <Route path="/admin/organization" element={<Organization />} />
        <Route path="/admin/addUser" element={<AddUserPage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
