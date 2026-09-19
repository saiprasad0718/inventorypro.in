import "@/App.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import { AuthProvider } from "@/app/AuthContext";
import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import AppShell from "@/app/AppShell";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/app/*" element={<AppShell />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster theme="dark" position="top-center" richColors />
      </AuthProvider>
    </BrowserRouter>
  );
}
