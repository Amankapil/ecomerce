"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState({ name: "", price: "", category: "", stock: "" });

  useEffect(() => {
    async function fetchProduct() {
      const res = await fetch(`/api/add`);
      const data = await res.json();
      const target = data.data.find((p) => p._id === id);
      setProduct(target);
    }
    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(`/api/add/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    });

    if (res.ok) {
      alert("Product updated!");
      router.push("/producs");
    } else {
      alert("Update failed.");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Edit Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          value={product.name}
          onChange={handleChange}
          className="border p-2 w-full"
          placeholder="Name"
        />
        <input
          name="price"
          value={product.price}
          onChange={handleChange}
          className="border p-2 w-full"
          placeholder="Price"
        />
        <input
          name="category"
          value={product.category}
          onChange={handleChange}
          className="border p-2 w-full"
          placeholder="Category"
        />
        <input
          name="stock"
          value={product.stock}
          onChange={handleChange}
          className="border p-2 w-full"
          placeholder="Stock"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Save Changes
        </button>
      </form>
    </div>
  );
}
