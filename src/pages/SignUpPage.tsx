import { useCallback, useState } from "react";
import { axiosInstance } from "../axiosInstance";
import { useLocalStorage } from "@uidotdev/usehooks";
import { useNavigate } from "react-router-dom";
import InputField from "../components/InputField";

function SignUpPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [accessToken] = useLocalStorage("accessToken");
  const navigate = useNavigate();

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
    },
    []
  );

  const handleSignUp = useCallback(async () => {
    await axiosInstance.post("/sign-up", form);
    navigate("/login");
  }, [form, navigate]);

  if (accessToken) {
    navigate("/");
    return null;
  }

  return (
    <div className="d-flex justify-content-center align-items-center h-100 w-100">
      <div className="w-50">
        <h1>Sign Up</h1>

        <InputField
          name="name"
          type="text"
          placeholder="Enter your name"
          value={form.name}
          label="Name"
          onChange={handleChange}
        />

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

        <button onClick={handleSignUp} className="btn btn-primary">
          Sign Up
        </button>
      </div>
    </div>
  );
}

export default SignUpPage;
