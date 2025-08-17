import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import BooksList from "./pages/BooksList";
import BookDetails from "./pages/BookDetails";
import BookForm from "./pages/BookForm";
import { useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <>
      <Navbar />
      <div style={{ padding: 20 }}>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/books" element={<BooksList />} />
          <Route path="/books/:id" element={<BookDetails />} />
          <Route
            path="/books/create"
            element={
              <ProtectedRoute>
                <BookForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/books/:id/edit"
            element={
              <ProtectedRoute>
                <BookForm />
              </ProtectedRoute>
            }
          />
          {/* admin-only delete handled in BooksList UI and API role check */}
        </Routes>
          {/* Toastify container */}
      <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </>
  );
};
export default App;
