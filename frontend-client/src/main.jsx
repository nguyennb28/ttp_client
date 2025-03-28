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

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <LoadingProvider>
        <Router>
          <GlobalLoading />
          <Header />
          <Routes>
            <Route path="/" element={<HomePage />} />
          </Routes>
          <Footer />
        </Router>
      </LoadingProvider>
    </AuthProvider>
  </StrictMode>
);
