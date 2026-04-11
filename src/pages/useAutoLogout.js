import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function useAutoLogout() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) return;

    try {
      const decoded = jwtDecode(token);

      if (!decoded.exp) return;

      const expiryTime = decoded.exp * 1000; // convert to ms
      const currentTime = Date.now();

      // ⏳ time remaining
      const timeout = expiryTime - currentTime;

      if (timeout <= 0) {
        logout();
      } else {
        setTimeout(logout, timeout);
      }
    } catch (err) {
      logout();
    }

    function logout() {
      localStorage.clear();
      navigate("/login");
    }
  }, [navigate]);
}