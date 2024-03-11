import { useCallback, useState } from "react";
import { axiosInstance } from "../axiosInstance";
import { useLocalStorage } from "@uidotdev/usehooks";
import { useNavigate } from "react-router-dom";
import InputField from "../components/InputField";

function LoginPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [accessToken, setAccessToken] = useLocalStorage("accessToken", "");
  const [, setRefreshToken] = useLocalStorage("refreshToken", "");
  const navigate = useNavigate();

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
    },
    []
  );

  const handleLogin = useCallback(async () => {
    const response = await axiosInstance.post("/login", form);
    const { accessToken = "", refreshToken = "" } = response.data ?? {};
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);
    navigate("/");
  }, [form, navigate, setAccessToken, setRefreshToken]);

  if (accessToken) {
    navigate("/");
    return null;
  }

  return (
    <div className="d-flex justify-content-center align-items-center h-100 w-100">
      <div className="w-50">
        <h1>Login</h1>
        <InputField
          name="email"
          type="text"
          placeholder="Enter your email"
          value={form.email}
          label="Email"
          onChange={handleChange}
        />
        <InputField
          name="password"
          type="password"
          placeholder="Enter your password"
          value={form.password}
          label="Password"
          onChange={handleChange}
        />
        <button onClick={handleLogin} className="btn btn-primary">
          Login
        </button>
      </div>
    </div>
  );
}

export default LoginPage;
