import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import api from "../api/axios";
import { jwtDecode } from "jwt-decode";

function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        try {
            const res = await api.post(
                "/auth/login",
                { email, password }
            )

            const token = res.data.access_token;
            login(token);

            const decoded: any = jwtDecode(token);

            if (decoded.role === "ADMIN") {
                navigate("/admin");
            } else if (decoded.role === "STORE_OWNER") {
                navigate("/owner");
            } else {
                navigate("/stores");
            }
        } catch (err) {
            console.error(err);
            alert("Login failed");
        }
    }

    return (
        <div className="max-w-md mx-auto mt-16 p-6 bg-white border border-stone-200 rounded">
            <h2 className="text-xl font-bold mb-4">Login</h2>

            <div className="mb-3">
                <label className="block text-sm mb-1">Email</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 border border-stone-300 rounded text-sm focus:outline-none"
                    placeholder="user@example.com"
                />
            </div>

            <div className="mb-4">
                <label className="block text-sm mb-1">Password</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2 border border-stone-300 rounded text-sm focus:outline-none"
                    placeholder="password"
                />
            </div>

            <button 
                onClick={handleLogin}
                className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded text-sm font-medium transition cursor-pointer"
            >
                Login
            </button>

            <p className="mt-4 text-sm text-stone-600">
                Don't have an account?{" "}
                <Link to="/register" className="text-orange-600 hover:underline">
                    Register here
                </Link>
            </p>
        </div>
    )
}

export default Login;