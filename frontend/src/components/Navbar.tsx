import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

function Navbar() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: ""
  });

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.patch("/auth/change-password", passwordForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Password updated successfully");
      setPasswordForm({ currentPassword: "", newPassword: "" });
      setShowPasswordModal(false);
    } catch (err) {
      console.error(err);
      alert("Failed to update password");
    }
  };

  return (
    <nav className="bg-white border-b border-stone-200 py-3 px-4 relative z-40">
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        <span className="text-lg font-bold text-stone-900 select-none">
          Store<span className="text-orange-600">Rating</span>
        </span>
        <div className="flex items-center gap-4 text-sm">
          {user ? (
            <>
              {user.role === "USER" && <Link to="/stores" className="hover:underline text-stone-600">Stores</Link>}
              {user.role === "ADMIN" && <Link to="/admin" className="hover:underline text-stone-600">Dashboard</Link>}
              {user.role === "STORE_OWNER" && <Link to="/owner" className="hover:underline text-stone-600">My Store</Link>}
              
              <div className="relative">
                <button 
                  onClick={() => setShowDropdown(!showDropdown)} 
                  className="text-stone-700 font-medium hover:text-stone-950 focus:outline-none flex items-center gap-1 cursor-pointer select-none"
                >
                  <span>{user.email}</span>
                  <span className="text-[8px] text-stone-400 relative top-[1px]">▼</span>
                </button>
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-44 bg-white border border-stone-200 rounded shadow z-50 py-1">
                    <button 
                      onClick={() => { setShowPasswordModal(true); setShowDropdown(false); }} 
                      className="w-full text-left px-3 py-2 text-stone-700 hover:bg-stone-50 cursor-pointer text-xs"
                    >
                      Change Password
                    </button>
                    <button 
                      onClick={() => { handleLogout(); setShowDropdown(false); }} 
                      className="w-full text-left px-3 py-2 text-red-600 hover:bg-stone-50 cursor-pointer font-medium text-xs border-t border-stone-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/" className="hover:underline">Login</Link>
              <Link to="/register" className="hover:underline">Register</Link>
            </>
          )}
        </div>
      </div>

      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <form onSubmit={handleChangePassword} className="p-6 border border-stone-200 bg-white rounded w-full max-w-md shadow-lg relative text-left">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg text-stone-900">Change Password</h3>
              <button 
                type="button" 
                onClick={() => setShowPasswordModal(false)} 
                className="text-stone-400 hover:text-stone-600 text-xl font-bold cursor-pointer"
              >
                &times;
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-stone-500 mb-1">Current Password</label>
                <input
                  type="password"
                  placeholder="Current password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  className="w-full p-2 border border-stone-300 rounded text-sm focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-500 mb-1">New Password (min 8 chars)</label>
                <input
                  type="password"
                  placeholder="New password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  className="w-full p-2 border border-stone-300 rounded text-sm focus:outline-none"
                  required
                />
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button 
                  type="button" 
                  onClick={() => setShowPasswordModal(false)} 
                  className="px-4 py-2 border border-stone-300 rounded text-sm hover:bg-stone-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button type="submit" className="bg-orange-600 text-white px-4 py-2 rounded text-sm cursor-pointer">
                  Update Password
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
