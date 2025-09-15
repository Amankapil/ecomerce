"use client"
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const savedCart = localStorage.getItem("cart");
        if (savedCart) {
          const items = JSON.parse(savedCart);
          setProducts(items);
          // ✅ Calculate total price
          const totalPrice = items.reduce((sum, item) => {
            return sum + parseFloat(item.price || 0);
          }, 0);
    
        //   setTotal(totalPrice.toFixed(2));
          console.log("✅ Loaded unique cart from localStorage:", items);
        }
      }, []);
    
  return (
    <>
      <div className="flex justify-between w-full mb-7 p-7 bg-gray-500 ">
        <Link href="/">ECommerce</Link>
        <div>
          <ul className="flex justify-center gap-10 w-full ">
            <Link className="cursor-pointer" href="/producs">Products</Link>
            <Link href="/cartpage">item in cart {products?.length}</Link>
            <li>Products</li>
          </ul>
        </div>
      </div>
    </>
  );
}
