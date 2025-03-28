import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./AuthContext";
import { LoadingProvider } from "./provider/LoadingProvider";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import GlobalLoading from "./pages/GlobalLoading";
import LoginPage from "./pages/LoginPage";
import Layout from "./pages/Layout";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <LoadingProvider>
        <Router>
          <GlobalLoading />
          <Header />
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<HomePage />} />
            </Route>
            <Route path="/login" element={<LoginPage />} />
          </Routes>
          {/* <Footer /> */}
        </Router>
      </LoadingProvider>
    </AuthProvider>
  </StrictMode>
);
