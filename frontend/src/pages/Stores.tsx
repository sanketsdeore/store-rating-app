import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

function Stores() {
    const { token } = useAuth();
    const [stores, setStores] = useState<any[]>([]);
    const [search, setSearch] = useState("");

    const [sort, setSort] = useState({ key: "name", direction: "asc" });

    useEffect(() => {
        fetchStores();
    }, [])

    const fetchStores = async () => {
        try {
            const res = await api.get("/stores", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setStores(res.data);
        } catch (err) {
            console.error(err);
        }
    }

    const searchStores = async () => {
        try {
            const res = await api.get(
                `/stores/search?q=${search}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )
            setStores(res.data);
        } catch (err) {
            console.error(err);
        }
    }

    const submitRating = async (storeId: number, rating: number) => {
        try {
            await api.post(
                "/ratings",
                { storeId, rating },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )
            fetchStores();
        } catch (err) {
            console.error(err);
        }
    }

    const handleSort = (key: string) => {
        let direction = "asc";
        if (sort.key === key && sort.direction === "asc") {
            direction = "desc";
        }
        setSort({ key, direction });
    };

    const sortedStores = [...stores].sort((a, b) => {
        const aValue = a[sort.key] || 0;
        const bValue = b[sort.key] || 0;
        if (aValue < bValue) return sort.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sort.direction === "asc" ? 1 : -1;
        return 0;
    });

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Stores</h1>
            </div>

            <div className="flex gap-2 mb-6">
                <input
                    placeholder="Search stores..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="p-2 border border-stone-300 rounded text-sm w-64 focus:outline-none"
                />
                <button 
                    onClick={searchStores}
                    className="bg-stone-800 hover:bg-stone-900 text-white px-4 py-2 rounded text-sm cursor-pointer"
                >
                    Search
                </button>
            </div>

            <div className="overflow-x-auto border border-stone-200 rounded bg-white">
                <table className="w-full border-collapse text-sm text-left">
                    <thead>
                        <tr className="bg-stone-50 border-b border-stone-200 font-semibold text-stone-600 select-none">
                            <th onClick={() => handleSort("name")} className="p-3 border-r border-stone-200 cursor-pointer hover:bg-stone-150">
                                Store Name {sort.key === "name" && <span className="text-[10px] ml-1">{sort.direction === "asc" ? "▲" : "▼"}</span>}
                            </th>
                            <th onClick={() => handleSort("address")} className="p-3 border-r border-stone-200 cursor-pointer hover:bg-stone-150">
                                Address {sort.key === "address" && <span className="text-[10px] ml-1">{sort.direction === "asc" ? "▲" : "▼"}</span>}
                            </th>
                            <th onClick={() => handleSort("overallRating")} className="p-3 border-r border-stone-200 cursor-pointer hover:bg-stone-150 text-center">
                                Overall Rating {sort.key === "overallRating" && <span className="text-[10px] ml-1">{sort.direction === "asc" ? "▲" : "▼"}</span>}
                            </th>
                            <th onClick={() => handleSort("userRating")} className="p-3 border-r border-stone-200 cursor-pointer hover:bg-stone-150 text-center">
                                Your Rating {sort.key === "userRating" && <span className="text-[10px] ml-1">{sort.direction === "asc" ? "▲" : "▼"}</span>}
                            </th>
                            <th className="p-3 text-center">Rate</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedStores.map((store) => (
                            <tr key={store.id} className="border-b border-stone-100">
                                <td className="p-3 border-r border-stone-200 font-medium text-stone-950">{store.name}</td>
                                <td className="p-3 border-r border-stone-200 text-stone-600">{store.address}</td>
                                <td className="p-3 border-r border-stone-200 text-center">
                                    {store.overallRating !== null && store.overallRating !== undefined ? (
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-orange-50 border border-orange-200 text-orange-600 rounded-lg text-xs font-bold select-none">
                                            ★ {Number(store.overallRating).toFixed(1)}
                                        </span>
                                    ) : (
                                        <span className="text-stone-400">None</span>
                                    )}
                                </td>
                                <td className="p-3 border-r border-stone-200 text-center">
                                    {store.userRating !== null && store.userRating !== undefined ? (
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-orange-50 border border-orange-200 text-orange-600 rounded-lg text-xs font-bold select-none">
                                            ★ {store.userRating}
                                        </span>
                                    ) : (
                                        <span className="text-stone-400">—</span>
                                    )}
                                </td>
                                <td className="p-3 text-center">
                                    <div className="flex justify-center gap-1">
                                        {[1, 2, 3, 4, 5].map((num) => (
                                            <button
                                                key={num}
                                                onClick={() => submitRating(store.id, num)}
                                                className={`px-2 py-0.5 text-xs rounded border transition cursor-pointer ${
                                                    store.userRating === num
                                                        ? "bg-orange-600 text-white border-orange-600 font-semibold"
                                                        : "bg-stone-100 hover:bg-orange-600 hover:text-white border-stone-200 text-stone-850"
                                                }`}
                                            >
                                                {num}
                                            </button>
                                        ))}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Stores;