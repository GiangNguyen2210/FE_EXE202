import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "../components/auth/LoginForm";

const LoginPage = ({ setUser }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      navigate("/"); // Redirect to main page if already logged in
    }
  }, [navigate]);

  return (
    // <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
    <main className="min-h-screen">
      <LoginForm setUser={setUser} />
    </main>
  );
};

export default LoginPage;
