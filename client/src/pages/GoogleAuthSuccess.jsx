import { useEffect } from "react";

const GoogleAuthSuccess = () => {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const user = params.get("user");

    if (token && user) {
      localStorage.setItem("token", token);
      localStorage.setItem("user", user);

      const parsedUser = JSON.parse(user);

      // navigate ki jagah hard redirect — page reload hoga
      // AuthProvider localStorage se fresh user read karega
      window.location.href = parsedUser.role === "admin" ? "/admin" : "/dashboard";
    } else {
      window.location.href = "/login";
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-sm text-gray-400">Logging you in...</p>
    </div>
  );
};

export default GoogleAuthSuccess;