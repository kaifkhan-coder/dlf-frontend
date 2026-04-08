// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { apiGet } from "../services/api";

// export default function ClaimPage() {
//   const { id } = useParams();
//   const [item, setItem] = useState(null);

//   useEffect(() => {
//     const load = async () => {
//       try {
//         const res = await apiGet(`/api/items/${id}`);
//         setItem(res.item);
//       } catch (err) {
//         console.log(err);
//       }
//     };
//     load();
//   }, [id]);

//   if (!item) return <p className="p-10">Loading...</p>;

//   return (
//     <div className="p-6 max-w-xl mx-auto">
//       <h1 className="text-2xl font-bold mb-4">Claim Item</h1>

//       <div className="border p-4 rounded-xl">
//         <img src={item.image} className="w-full h-48 object-cover rounded-lg" />

//         <h2 className="text-xl font-bold mt-3">{item.title}</h2>
//         <p className="text-gray-600">{item.category} • {item.location}</p>

//         <p className="mt-3">{item.description}</p>

//         <div className="mt-4">
//           <p><b>Color:</b> {item.color}</p>
//           <p><b>Date:</b> {item.date}</p>
//         </div>

//         <div className="mt-6 bg-yellow-100 p-3 rounded-lg">
//           Go to <b>Security Office</b> with this ID:
//           <p className="font-bold">{item._id}</p>
//         </div>
//       </div>
//     </div>
//   );
// }

// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { apiGet, apiPost } from "../services/api";

// export default function ClaimPage() {
//   const { id } = useParams();
//   const [item, setItem] = useState(null);

//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     color: "",
//     description: "",
//   });

//   useEffect(() => {
//   const loadItem = async () => {
//     try {
//       console.log("Fetching item...");
//       const data = await apiGet(`/api/items/${id}`);
//       console.log("API RESPONSE:", data);

//       setItem(data.item);
//     } catch (err) {
//       console.error("ERROR:", err);
//     }
//   };

//   loadItem();
// }, [id]);

//   useEffect(() => {
//     const load = async () => {
//       try {
//         const res = await apiGet(`/api/items/${id}`);
//         setItem(res.item);
//       } catch (err) {
//         console.error(err);
//       }
//     };
//     load();
//   }, [id]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       await apiPost(`/api/claims/${id}`, form);
//       alert("✅ Claim submitted successfully");
//     } catch (err) {
//       alert(err.message);
//     }
//   };

//   if (!item) return <p className="p-10">Loading...</p>;

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
//       <div className="bg-white p-6 rounded-xl shadow-xl max-w-xl w-full">
//         <h1 className="text-2xl font-bold mb-4 text-center">
//           Claim Item
//         </h1>

//         <img
//           src={item.image || `https://via.placeholder.com/400x300?text=${item.title}`}
//           className="w-full h-48 object-cover rounded-lg"
//         />

//         <h2 className="text-xl font-bold mt-3">{item.title}</h2>

//         {/* FORM */}
//         <form onSubmit={handleSubmit} className="mt-6 space-y-4">
//           <input
//             placeholder="Your Name"
//             className="w-full border p-2 rounded"
//             onChange={(e) =>
//               setForm({ ...form, name: e.target.value })
//             }
//           />

//           <input
//             placeholder="Your Email"
//             className="w-full border p-2 rounded"
//             onChange={(e) =>
//               setForm({ ...form, email: e.target.value })
//             }
//           />

//           <input
//             placeholder="Item Color"
//             className="w-full border p-2 rounded"
//             onChange={(e) =>
//               setForm({ ...form, color: e.target.value })
//             }
//           />

//           <textarea
//             placeholder="Describe item (marks, stickers...)"
//             className="w-full border p-2 rounded"
//             onChange={(e) =>
//               setForm({ ...form, description: e.target.value })
//             }
//           />

//           <button className="w-full bg-blue-600 text-white py-2 rounded">
//             Submit Claim
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

// import React from "react";
// import { useParams } from "react-router-dom";

// export default function ClaimPage() {
//   const { id } = useParams();

//   return (
//     <div style={{ background: "white", color: "black", height: "100vh", padding: "50px" }}>
//       <h1>Claim Page Working ✅</h1>
//       <p>ID: {id}</p>
//     </div>
//   );
// }


// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { apiGet } from "../services/api";

// export default function ClaimPage() {
//   const { id } = useParams();
//   const [item, setItem] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const loadItem = async () => {
//       try {
//         const data = await apiGet(`/api/items/${id}`);
//         setItem(data.item);
//       } catch (err) {
//         console.error("CLAIM PAGE ERROR:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadItem();
//   }, [id]);

//   if (loading) {
//     return (
//       <div className="h-screen flex items-center justify-center">
//         Loading Claim Page...
//       </div>
//     );
//   }

//   if (!item) {
//     return (
//       <div className="h-screen flex items-center justify-center text-red-500">
//         Item not found ❌
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-slate-100 p-6">
//       <div className="bg-white p-6 rounded-2xl shadow-xl max-w-md w-full">
//         <h1 className="text-xl font-bold mb-3">Claim Item</h1>

//         <img
//           src={item.image || `https://picsum.photos/seed/${item._id}/400/250`}
//           className="w-full h-40 object-cover rounded-lg"
//         />

//         <h2 className="text-lg font-bold mt-3">{item.title}</h2>
//         <p className="text-sm text-gray-600">{item.location}</p>

//         <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm">
//           📍 Visit security office with proof to claim this item.
//         </div>

//         <div className="mt-4 text-xs text-gray-500">
//           Item ID: {item._id}
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiGet } from "../services/api";

export default function ClaimPage() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        console.log("Fetching item:", id);

        const res = await apiGet(`/api/items/${id}`);
        console.log("API RESPONSE:", res);

        setItem(res.item);
      } catch (err) {
        console.error("ERROR:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  // ✅ ALWAYS show something
  if (loading) {
    return (
      <div style={{ color: "black", textAlign: "center", marginTop: "50px" }}>
        ⏳ Loading claim page...
      </div>
    );
  }

  if (!item) {
    return (
      <div style={{ color: "red", textAlign: "center", marginTop: "50px" }}>
        ❌ Item not found
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", color: "black" }}>
      <h1>✅ Claim Item Page</h1>

      <img
        src={item.image || `https://picsum.photos/seed/${item._id}/400/250`}
        style={{ width: "100%", maxWidth: "400px" }}
      />

      <h2>{item.title}</h2>
      <p>{item.location}</p>

      <p><b>ID:</b> {item._id}</p>
    </div>
  );
}