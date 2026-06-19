import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

function AdminDashboard() {
    const { token } = useAuth();
    const [stats, setStats] = useState<any>(null);
    const [users, setUsers] = useState<any[]>([]);
    const [stores, setStores] = useState<any[]>([]);

    const [showUserForm, setShowUserForm] = useState(false);
    const [showOwnerForm, setShowOwnerForm] = useState(false);

    const [userForm, setUserForm] = useState({
        name: "",
        email: "",
        address: "",
        password: "",
        role: "USER"
    });

    const [ownerForm, setOwnerForm] = useState({
        name: "",
        email: "",
        address: "",
        password: "",
        storeName: "",
        storeAddress: ""
    });

    const [userFilter, setUserFilter] = useState({ name: "", email: "", address: "", role: "" });
    const [storeFilter, setStoreFilter] = useState({ name: "", email: "", address: "" });

    const [userSort, setUserSort] = useState({ key: "name", direction: "asc" });
    const [storeSort, setStoreSort] = useState({ key: "name", direction: "asc" });

    useEffect(() => {
        fetchDashboard();
        fetchUsers();
        fetchStores();
    }, []);

    const fetchDashboard = async () => {
        try {
            const res = await api.get("/admin/dashboard", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStats(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchUsers = async () => {
        try {
            const res = await api.get("/admin/users", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchStores = async () => {
        try {
            const res = await api.get("/admin/stores", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStores(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post("/admin/users", userForm, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("User created successfully");
            setUserForm({ name: "", email: "", address: "", password: "", role: "USER" });
            setShowUserForm(false);
            fetchUsers();
            fetchDashboard();
        } catch (err) {
            console.error(err);
            alert("Failed to create user");
        }
    };

    const handleCreateOwner = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post("/admin/store-owner", ownerForm, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Store owner and store created successfully");
            setOwnerForm({
                name: "",
                email: "",
                address: "",
                password: "",
                storeName: "",
                storeAddress: ""
            });
            setShowOwnerForm(false);
            fetchUsers();
            fetchStores();
            fetchDashboard();
        } catch (err) {
            console.error(err);
            alert("Failed to create store owner");
        }
    };

    const handleUserSort = (key: string) => {
        let direction = "asc";
        if (userSort.key === key && userSort.direction === "asc") {
            direction = "desc";
        }
        setUserSort({ key, direction });
    };

    const handleStoreSort = (key: string) => {
        let direction = "asc";
        if (storeSort.key === key && storeSort.direction === "asc") {
            direction = "desc";
        }
        setStoreSort({ key, direction });
    };

    const sortedUsers = [...users]
        .filter((u) => {
            return (
                (u.name || "").toLowerCase().includes(userFilter.name.toLowerCase()) &&
                (u.email || "").toLowerCase().includes(userFilter.email.toLowerCase()) &&
                (u.address || "").toLowerCase().includes(userFilter.address.toLowerCase()) &&
                (u.role || "").toLowerCase().includes(userFilter.role.toLowerCase())
            );
        })
        .sort((a, b) => {
            const aValue = a[userSort.key] || "";
            const bValue = b[userSort.key] || "";
            if (aValue < bValue) return userSort.direction === "asc" ? -1 : 1;
            if (aValue > bValue) return userSort.direction === "asc" ? 1 : -1;
            return 0;
        });

    const sortedStores = [...stores]
        .filter((s) => {
            return (
                (s.name || "").toLowerCase().includes(storeFilter.name.toLowerCase()) &&
                (s.email || "").toLowerCase().includes(storeFilter.email.toLowerCase()) &&
                (s.address || "").toLowerCase().includes(storeFilter.address.toLowerCase())
            );
        })
        .sort((a, b) => {
            const aValue = a[storeSort.key] || 0;
            const bValue = b[storeSort.key] || 0;
            if (aValue < bValue) return storeSort.direction === "asc" ? -1 : 1;
            if (aValue > bValue) return storeSort.direction === "asc" ? 1 : -1;
            return 0;
        });

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                <div className="flex gap-3">
                    <button
                        onClick={() => { setShowUserForm(!showUserForm); setShowOwnerForm(false); }}
                        className="bg-stone-800 hover:bg-stone-900 text-white px-3 py-1.5 rounded text-sm cursor-pointer"
                    >
                        Add User
                    </button>
                    <button
                        onClick={() => { setShowOwnerForm(!showOwnerForm); setShowUserForm(false); }}
                        className="bg-orange-600 hover:bg-orange-700 text-white px-3 py-1.5 rounded text-sm cursor-pointer"
                    >
                        Add Store Owner
                    </button>
                </div>
            </div>

            {stats && (
                <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="p-4 border border-stone-200 bg-white rounded">
                        <span className="text-stone-500 text-xs uppercase font-semibold">Total Users</span>
                        <div className="text-xl font-bold">{stats.totalUsers}</div>
                    </div>
                    <div className="p-4 border border-stone-200 bg-white rounded">
                        <span className="text-stone-500 text-xs uppercase font-semibold">Total Stores</span>
                        <div className="text-xl font-bold">{stats.totalStores}</div>
                    </div>
                    <div className="p-4 border border-stone-200 bg-white rounded">
                        <span className="text-stone-500 text-xs uppercase font-semibold">Total Ratings</span>
                        <div className="text-xl font-bold text-orange-600">{stats.totalRatings}</div>
                    </div>
                </div>
            )}

            {showUserForm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <form onSubmit={handleCreateUser} className="p-6 border border-stone-200 bg-white rounded w-full max-w-md shadow-lg relative">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-lg">Add Standard User</h3>
                            <button 
                                type="button" 
                                onClick={() => setShowUserForm(false)} 
                                className="text-stone-400 hover:text-stone-600 text-xl font-bold cursor-pointer"
                            >
                                &times;
                            </button>
                        </div>
                        <div className="space-y-3">
                            <input
                                placeholder="Name (Min 20, Max 60 chars)"
                                value={userForm.name}
                                onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                                className="w-full p-2 border border-stone-300 rounded text-sm focus:outline-none"
                                required
                                minLength={20}
                                maxLength={60}
                            />
                            <input
                                type="email"
                                placeholder="Email"
                                value={userForm.email}
                                onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                                className="w-full p-2 border border-stone-300 rounded text-sm focus:outline-none"
                                required
                            />
                            <input
                                placeholder="Address (Max 400 chars)"
                                value={userForm.address}
                                onChange={(e) => setUserForm({ ...userForm, address: e.target.value })}
                                className="w-full p-2 border border-stone-300 rounded text-sm focus:outline-none"
                                required
                                maxLength={400}
                            />
                            <input
                                type="password"
                                placeholder="Password (8-16 chars, 1 uppercase, 1 special)"
                                value={userForm.password}
                                onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                                className="w-full p-2 border border-stone-300 rounded text-sm focus:outline-none"
                                required
                                minLength={8}
                                maxLength={16}
                                pattern="^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?\&quot;:{}|<>]).+$"
                                title="Password must contain at least one uppercase letter and one special character"
                            />
                            <select
                                value={userForm.role}
                                onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
                                className="w-full p-2 border border-stone-300 rounded text-sm focus:outline-none bg-white text-stone-700"
                                required
                            >
                                <option value="USER">Normal User</option>
                                <option value="ADMIN">System Administrator</option>
                            </select>
                            <div className="flex justify-end gap-2 mt-4">
                                <button 
                                    type="button" 
                                    onClick={() => setShowUserForm(false)} 
                                    className="px-4 py-2 border border-stone-300 rounded text-sm hover:bg-stone-50 cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="bg-stone-800 text-white px-4 py-2 rounded text-sm cursor-pointer">
                                    Create User
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            )}

            {showOwnerForm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <form onSubmit={handleCreateOwner} className="p-6 border border-stone-200 bg-white rounded w-full max-w-md shadow-lg relative">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-lg">Add Store Owner & Store</h3>
                            <button 
                                type="button" 
                                onClick={() => setShowOwnerForm(false)} 
                                className="text-stone-400 hover:text-stone-600 text-xl font-bold cursor-pointer"
                            >
                                &times;
                            </button>
                        </div>
                        <div className="space-y-3">
                            <input
                                placeholder="Owner Name (Min 20, Max 60 chars)"
                                value={ownerForm.name}
                                onChange={(e) => setOwnerForm({ ...ownerForm, name: e.target.value })}
                                className="w-full p-2 border border-stone-300 rounded text-sm focus:outline-none"
                                required
                                minLength={20}
                                maxLength={60}
                            />
                            <input
                                type="email"
                                placeholder="Owner Email"
                                value={ownerForm.email}
                                onChange={(e) => setOwnerForm({ ...ownerForm, email: e.target.value })}
                                className="w-full p-2 border border-stone-300 rounded text-sm focus:outline-none"
                                required
                            />
                            <input
                                placeholder="Owner Address (Max 400 chars)"
                                value={ownerForm.address}
                                onChange={(e) => setOwnerForm({ ...ownerForm, address: e.target.value })}
                                className="w-full p-2 border border-stone-300 rounded text-sm focus:outline-none"
                                required
                                maxLength={400}
                            />
                            <input
                                type="password"
                                placeholder="Owner Password (8-16 chars, 1 uppercase, 1 special)"
                                value={ownerForm.password}
                                onChange={(e) => setOwnerForm({ ...ownerForm, password: e.target.value })}
                                className="w-full p-2 border border-stone-300 rounded text-sm focus:outline-none"
                                required
                                minLength={8}
                                maxLength={16}
                                pattern="^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?\&quot;:{}|<>]).+$"
                                title="Password must contain at least one uppercase letter and one special character"
                            />
                            <input
                                placeholder="Store Name"
                                value={ownerForm.storeName}
                                onChange={(e) => setOwnerForm({ ...ownerForm, storeName: e.target.value })}
                                className="w-full p-2 border border-stone-300 rounded text-sm focus:outline-none"
                                required
                            />
                            <input
                                placeholder="Store Address"
                                value={ownerForm.storeAddress}
                                onChange={(e) => setOwnerForm({ ...ownerForm, storeAddress: e.target.value })}
                                className="w-full p-2 border border-stone-300 rounded text-sm focus:outline-none"
                                required
                            />
                            <div className="flex justify-end gap-2 mt-4">
                                <button 
                                    type="button" 
                                    onClick={() => setShowOwnerForm(false)} 
                                    className="px-4 py-2 border border-stone-300 rounded text-sm hover:bg-stone-50 cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="bg-orange-600 text-white px-4 py-2 rounded text-sm cursor-pointer">
                                    Create Owner
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            )}

            <div className="space-y-6">
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <h2 className="text-lg font-semibold">Users</h2>
                        <div className="flex gap-2">
                            <input
                                placeholder="Filter Name"
                                value={userFilter.name}
                                onChange={(e) => setUserFilter({ ...userFilter, name: e.target.value })}
                                className="p-1.5 border border-stone-300 rounded text-xs w-28 focus:outline-none"
                            />
                            <input
                                placeholder="Filter Email"
                                value={userFilter.email}
                                onChange={(e) => setUserFilter({ ...userFilter, email: e.target.value })}
                                className="p-1.5 border border-stone-300 rounded text-xs w-28 focus:outline-none"
                            />
                            <input
                                placeholder="Filter Address"
                                value={userFilter.address}
                                onChange={(e) => setUserFilter({ ...userFilter, address: e.target.value })}
                                className="p-1.5 border border-stone-300 rounded text-xs w-28 focus:outline-none"
                            />
                            <select
                                value={userFilter.role}
                                onChange={(e) => setUserFilter({ ...userFilter, role: e.target.value })}
                                className="p-1.5 border border-stone-300 rounded text-xs w-28 focus:outline-none bg-white text-stone-700"
                            >
                                <option value="">All Roles</option>
                                <option value="ADMIN">ADMIN</option>
                                <option value="USER">USER</option>
                                <option value="STORE_OWNER">STORE_OWNER</option>
                            </select>
                        </div>
                    </div>

                    <table className="w-full border-collapse border border-stone-200 bg-white text-sm text-left">
                        <thead>
                            <tr className="bg-stone-50 border-b border-stone-200 font-semibold text-stone-600 select-none">
                                <th onClick={() => handleUserSort("name")} className="p-3 border-r border-stone-200 cursor-pointer hover:bg-stone-150">
                                    Name {userSort.key === "name" && <span className="text-[10px] ml-1">{userSort.direction === "asc" ? "▲" : "▼"}</span>}
                                </th>
                                <th onClick={() => handleUserSort("email")} className="p-3 border-r border-stone-200 cursor-pointer hover:bg-stone-150">
                                    Email {userSort.key === "email" && <span className="text-[10px] ml-1">{userSort.direction === "asc" ? "▲" : "▼"}</span>}
                                </th>
                                <th onClick={() => handleUserSort("address")} className="p-3 border-r border-stone-200 cursor-pointer hover:bg-stone-150">
                                    Address {userSort.key === "address" && <span className="text-[10px] ml-1">{userSort.direction === "asc" ? "▲" : "▼"}</span>}
                                </th>
                                <th onClick={() => handleUserSort("role")} className="p-3 cursor-pointer hover:bg-stone-150">
                                    Role {userSort.key === "role" && <span className="text-[10px] ml-1">{userSort.direction === "asc" ? "▲" : "▼"}</span>}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedUsers.map((user) => (
                                <tr key={user.id} className="border-b border-stone-100">
                                    <td className="p-3 border-r border-stone-200">{user.name}</td>
                                    <td className="p-3 border-r border-stone-200">{user.email}</td>
                                    <td className="p-3 border-r border-stone-200">{user.address}</td>
                                    <td className="p-3">
                                        {user.role} 
                                        {user.role === "STORE_OWNER" && user.averageRating !== null && (
                                            <span className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 bg-orange-50 border border-orange-200 text-orange-600 rounded-lg text-xs font-bold select-none">
                                                ★ {Number(user.averageRating).toFixed(1)}
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div>
                    <div className="flex justify-between items-center mb-2">
                        <h2 className="text-lg font-semibold">Stores</h2>
                        <div className="flex gap-2">
                            <input
                                placeholder="Filter Name"
                                value={storeFilter.name}
                                onChange={(e) => setStoreFilter({ ...storeFilter, name: e.target.value })}
                                className="p-1.5 border border-stone-300 rounded text-xs w-28 focus:outline-none"
                            />
                            <input
                                placeholder="Filter Email"
                                value={storeFilter.email}
                                onChange={(e) => setStoreFilter({ ...storeFilter, email: e.target.value })}
                                className="p-1.5 border border-stone-300 rounded text-xs w-28 focus:outline-none"
                            />
                            <input
                                placeholder="Filter Address"
                                value={storeFilter.address}
                                onChange={(e) => setStoreFilter({ ...storeFilter, address: e.target.value })}
                                className="p-1.5 border border-stone-300 rounded text-xs w-28 focus:outline-none"
                            />
                        </div>
                    </div>

                    <table className="w-full border-collapse border border-stone-200 bg-white text-sm text-left">
                        <thead>
                            <tr className="bg-stone-50 border-b border-stone-200 font-semibold text-stone-600 select-none">
                                <th onClick={() => handleStoreSort("name")} className="p-3 border-r border-stone-200 cursor-pointer hover:bg-stone-150">
                                    Name {storeSort.key === "name" && <span className="text-[10px] ml-1">{storeSort.direction === "asc" ? "▲" : "▼"}</span>}
                                </th>
                                <th onClick={() => handleStoreSort("email")} className="p-3 border-r border-stone-200 cursor-pointer hover:bg-stone-150">
                                    Email {storeSort.key === "email" && <span className="text-[10px] ml-1">{storeSort.direction === "asc" ? "▲" : "▼"}</span>}
                                </th>
                                <th onClick={() => handleStoreSort("address")} className="p-3 border-r border-stone-200 cursor-pointer hover:bg-stone-150">
                                    Address {storeSort.key === "address" && <span className="text-[10px] ml-1">{storeSort.direction === "asc" ? "▲" : "▼"}</span>}
                                </th>
                                <th onClick={() => handleStoreSort("averageRating")} className="p-3 cursor-pointer hover:bg-stone-150">
                                    Average Rating {storeSort.key === "averageRating" && <span className="text-[10px] ml-1">{storeSort.direction === "asc" ? "▲" : "▼"}</span>}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedStores.map((store) => (
                                <tr key={store.id} className="border-b border-stone-100">
                                    <td className="p-3 border-r border-stone-200">{store.name}</td>
                                    <td className="p-3 border-r border-stone-200">{store.email}</td>
                                    <td className="p-3 border-r border-stone-200">{store.address}</td>
                                    <td className="p-3">
                                        {store.averageRating !== null && store.averageRating !== undefined ? (
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-orange-50 border border-orange-200 text-orange-600 rounded-lg text-xs font-bold select-none">
                                                ★ {Number(store.averageRating).toFixed(1)}
                                            </span>
                                        ) : (
                                            <span className="text-stone-400">None</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;