import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

function OwnerDashboard() {
  const { token } = useAuth();
  const [data, setData] = useState<any>(null);

  const [sort, setSort] = useState({ key: "name", direction: "asc" });

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await api.get(
        "/owner/dashboard",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSort = (key: string) => {
    let direction = "asc";
    if (sort.key === key && sort.direction === "asc") {
        direction = "desc";
    }
    setSort({ key, direction });
  };

  if (!data) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-stone-500 text-sm">
        Loading...
      </div>
    );
  }

  const sortedRatings = [...(data.ratings || [])].sort((a, b) => {
    let aValue = "";
    let bValue = "";
    if (sort.key === "name") {
      aValue = a.user?.name || "";
      bValue = b.user?.name || "";
    } else if (sort.key === "email") {
      aValue = a.user?.email || "";
      bValue = b.user?.email || "";
    } else if (sort.key === "rating") {
      const aNum = a.rating || 0;
      const bNum = b.rating || 0;
      return sort.direction === "asc" ? aNum - bNum : bNum - aNum;
    }

    if (aValue < bValue) return sort.direction === "asc" ? -1 : 1;
    if (aValue > bValue) return sort.direction === "asc" ? 1 : -1;
    return 0;
  });

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-2xl font-bold">{data.storeName}</h1>
      </div>
      
      <div className="flex items-center gap-2 mb-6 select-none">
        <span className="text-sm text-stone-600 font-medium">Average Rating:</span>
        {data.averageRating !== null && data.averageRating !== undefined ? (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-orange-50 border border-orange-200 text-orange-600 rounded-lg text-sm font-bold">
            ★ {Number(data.averageRating).toFixed(1)}
          </span>
        ) : (
          <span className="text-stone-400 text-sm">None</span>
        )}
      </div>

      <h2 className="text-lg font-semibold mb-2">Ratings</h2>

      <table className="w-full border-collapse border border-stone-200 bg-white text-sm text-left">
        <thead>
          <tr className="bg-stone-50 border-b border-stone-200 font-semibold text-stone-600 select-none">
            <th onClick={() => handleSort("name")} className="p-3 border-r border-stone-200 cursor-pointer hover:bg-stone-150">
              User {sort.key === "name" && <span className="text-[10px] ml-1">{sort.direction === "asc" ? "▲" : "▼"}</span>}
            </th>
            <th onClick={() => handleSort("email")} className="p-3 border-r border-stone-200 cursor-pointer hover:bg-stone-150">
              Email {sort.key === "email" && <span className="text-[10px] ml-1">{sort.direction === "asc" ? "▲" : "▼"}</span>}
            </th>
            <th onClick={() => handleSort("rating")} className="p-3 cursor-pointer hover:bg-stone-150">
              Rating {sort.key === "rating" && <span className="text-[10px] ml-1">{sort.direction === "asc" ? "▲" : "▼"}</span>}
            </th>
          </tr>
        </thead>

        <tbody>
          {sortedRatings.map((rating: any, index: number) => (
            <tr key={index} className="border-b border-stone-100">
              <td className="p-3 border-r border-stone-200">{rating.user.name}</td>
              <td className="p-3 border-r border-stone-200">{rating.user.email}</td>
              <td className="p-3 font-semibold text-stone-755">{rating.rating} ★</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default OwnerDashboard;