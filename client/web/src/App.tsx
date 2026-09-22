import { Routes, Route } from "react-router-dom"

import SignUpPage from "./pages/auth/sign-up"
import SignInPage from "./pages/auth/sign-in"
import CheckEmailPage from "./pages/auth/check-email"
import Dashboard from "./pages/dashboard"
import { Toaster } from "@/components/ui/sonner"
import PrivateLayout from "./components/private-layout"
import GuestLayout from "./components/guest-layout"
import ForgotPasswordPage from "./pages/auth/forgot-password"
import ResetPasswordPage from "./pages/auth/reset-password"
import HomePage from "./pages/home"

const App = () => {
  return (
    <>
      <Toaster richColors position="top-right" />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route element={<PrivateLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
        <Route element={<GuestLayout />}>
          <Route path="/sign-up" element={<SignUpPage />} />
          <Route path="/sign-in" element={<SignInPage />} />
          <Route path="/check-email" element={<CheckEmailPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
