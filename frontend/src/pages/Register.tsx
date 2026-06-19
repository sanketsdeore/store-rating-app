import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    password: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  }

  const handleRegister = async () => {
    try {
      await api.post("/auth/register", form);
      alert("Registration successful");
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Registration failed");
    }
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); handleRegister(); }} className="max-w-md mx-auto mt-16 p-6 bg-white border border-stone-200 rounded">
      <h2 className="text-xl font-bold mb-4">Register</h2>

      <div className="mb-3">
        <label className="block text-sm mb-1">Name (Min 20, Max 60 chars)</label>
        <input
          name="name"
          onChange={handleChange}
          className="w-full p-2 border border-stone-300 rounded text-sm focus:outline-none"
          placeholder="John Doe"
          required
          minLength={20}
          maxLength={60}
        />
      </div>

      <div className="mb-3">
        <label className="block text-sm mb-1">Email</label>
        <input
          name="email"
          type="email"
          onChange={handleChange}
          className="w-full p-2 border border-stone-300 rounded text-sm focus:outline-none"
          placeholder="email@example.com"
          required
        />
      </div>

      <div className="mb-3">
        <label className="block text-sm mb-1">Address (Max 400 chars)</label>
        <input
          name="address"
          onChange={handleChange}
          className="w-full p-2 border border-stone-300 rounded text-sm focus:outline-none"
          placeholder="123 Street Name"
          required
          maxLength={400}
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm mb-1">Password (8-16 chars, 1 uppercase, 1 special)</label>
        <input
          type="password"
          name="password"
          onChange={handleChange}
          className="w-full p-2 border border-stone-300 rounded text-sm focus:outline-none"
          placeholder="Password"
          required
          minLength={8}
          maxLength={16}
          pattern="^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?\&quot;:{}|<>]).+$"
          title="Password must contain at least one uppercase letter and one special character"
        />
      </div>

      <button 
        type="submit"
        className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded text-sm font-medium transition cursor-pointer w-full sm:w-auto"
      >
        Register
      </button>

      <p className="mt-4 text-sm text-stone-600">
        Already have an account?{" "}
        <Link to="/" className="text-orange-600 hover:underline">
          Login here
        </Link>
      </p>
    </form>
  );
}

export default Register;