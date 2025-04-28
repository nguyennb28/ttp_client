import { useEffect } from "react";
import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignInForm from "../../components/auth/SignInForm";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router";

export default function SignIn() {
  const { login, checkAuth } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (
    tax_code: string,
    username: string,
    password: string
  ) => {
    try {
      const response = await login(tax_code, username, password);
      if (response) {
        navigate("/", { replace: true });
      }
    } catch (err: any) {
      console.error(err);
      alert("Login failed");
    }
  };

  useEffect(() => {
    checkAuth();
    const access = localStorage.getItem("access");
    if (access) {
      navigate("/", { replace: true });
    }
  }, []);

  return (
    <>
      <PageMeta title="Sign In" description="Sign In" />
      <AuthLayout>
        <SignInForm onSubmit={onSubmit} />
      </AuthLayout>
    </>
  );
}
