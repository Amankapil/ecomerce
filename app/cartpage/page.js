"use client";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import {addtocart} from "../redux/reducer/cartSlice"
export default function Cart() {
  // const {cart} = useSelector((state) => state.cart);
  const cartItems = useSelector((state) => state.cart.cart);
  const cart = useSelector((state) => state.cart);
  console.log(cart);
  console.log("Cart items:", cart);
  console.log(cartItems);

    const [products, setProducts] = useState([]);
    const [paidFor, setPaidFor] = useState(false);
    const [error, setError] = useState(null);
    const router = useRouter();
    const [email, setEmail] = useState("");

  const { cartItemss } = useSelector((state) => state.cart.cart);
  // const total = useSelector((state) => state.cart.total);
  const [savedCartItems, setSavedCartItems] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      const items = JSON.parse(savedCart);
      setSavedCartItems(items);
      // ✅ Calculate total price
      const totalPrice = items.reduce((sum, item) => {
        return sum + parseFloat(item.price || 0);
      }, 0);

      setTotal(totalPrice.toFixed(2));
      console.log("✅ Loaded unique cart from localStorage:", items);
    }
  }, []);

  console.log("🛒 Cart Items:", cartItemss);

  useEffect(() => {
      async function fetchProducts() {
        try {
          const res = await fetch("/api/add");
          const data = await res.json();
          setProducts(data.data || []);
          console.log(" Fetched products:", data.data);
        } catch (err) {
          console.error(" Failed to fetch:", err.message);
        }
      }
  
      fetchProducts();
    }, []);
 // Sum up prices of all products
  const totalAmount = products
    .reduce((acc, item) => acc + parseFloat(item.price), 0)
    .toFixed(2);

  // PayPal createOrder handler
  const createOrder = async () => {
    const res = await fetch("/api/paypal/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: totalAmount}),
    });
    const order = await res.json();
    if (res.ok) return order.id;
    else throw new Error(order.error?.message || "Order creation failed");
  };

  const onApprove = async (data) => {
    const res = await fetch("/api/paypal/capture-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderID: data.orderID }),
    });
    const captureData = await res.json();

    if (res.ok && captureData.status === "COMPLETED") {
      setPaidFor(true);
      // Redirect to thank you page or show message
      router.push("/thankyou");
    } else {
      setError("Payment failed: " + (captureData.error?.message || ""));
    }
  };

  const onError = (err) => {
    console.error("PayPal error:", err);
    setError("Payment error: " + err);
  };
  return (
    <PayPalScriptProvider
      options={{ "client-id": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID }}
    >






    
      <div>
        <h1>Your Saved Cart</h1>
        {savedCartItems.length > 0 ? (
          <>
            <ul className="flex flex-col gap-3">
              {savedCartItems.map((item, i) => (
                <li className=" bg-green-300" key={i}>
                  {item.name} - ${item.price}
                </li>
              ))}
            </ul>

            <p>Total Price: ${total}</p>

            <div className="p-4 border mt-6">
              <h3>Total Amount: ${total}</h3>

              {products.length > 0 ? (
                <PayPalButtons
                  createOrder={createOrder}
                  onApprove={onApprove}
                  onError={onError}
                  style={{ layout: "vertical" }}
                />
              ) : (
                <button disabled className="p-2 bg-gray-300 cursor-not-allowed">
                  Loading products...
                </button>
              )}

              {error && <p className="text-red-600 mt-2">{error}</p>}
            </div>
          </>
        ) : (
          <p>Your cart is empty.</p>
        )}
      </div>
    </PayPalScriptProvider>
  );
}
