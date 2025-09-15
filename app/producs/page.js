"use client";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { addtocart } from "../redux/reducer/cartSlice";
import { useRouter } from "next/navigation";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch();
  const router = useRouter();

  // Fetch products
  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/add");
      const data = await res.json();
      setProducts(data.data || []);
    } catch (err) {
      console.error("Failed to fetch:", err.message);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Add to cart
  const handleAddToCart = (item) => {
    dispatch(addtocart(item));

    const existingCart = JSON.parse(localStorage.getItem("cart")) || [];
    const isDuplicate = existingCart.some((cartItem) => cartItem._id === item._id);

    if (!isDuplicate) {
      const updatedCart = [...existingCart, item];
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      console.log("Item added to localStorage cart:", item);
      alert("Item added to cart")
    } else {
      console.log("Item already exists in cart. Skipping duplicate.");
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    const confirmed = confirm("Are you sure you want to delete this product?");
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/add/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        alert("Product deleted successfully.");
        fetchProducts(); // Refresh the product list
      } else {
        alert("Failed to delete product.");
      }
    } catch (err) {
      console.error("Delete error:", err.message);
    }
  };

  // Redirect to edit page
  const handleEdit = (id) => {
    router.push(`/edit/${id}`); // You need to create this page
  };

  // Filtered products
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border rounded w-full"
        />
      </div>

      {filteredProducts.length === 0 && <p>No products found.</p>}

      {filteredProducts.map((item) => (
        <div key={item._id} className="p-4 border mb-4 rounded shadow-sm">
          <h2 className="font-bold text-lg">Name: {item.name}</h2>
          <p>Price: ${item.price}</p>
          <p>Category: {item.category}</p>
          <p>Stock: {item.stock}</p>
          <p>description: {item?.description || "description not available"} </p>

          <div className="mt-2 flex gap-2">
            <button
              onClick={() => handleAddToCart(item)}
              className="p-2 bg-green-200 rounded"
            >
              Add to Cart
            </button>
            <button
              onClick={() => handleEdit(item._id)}
              className="p-2 bg-blue-200 rounded"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(item._id)}
              className="p-2 bg-red-200 rounded"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
