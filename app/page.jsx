"use client"
import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [name, setName]= useState("");
  const [price, setPrice]= useState("");
  const [category, setCategory]= useState("");
  const [stock, setStock]= useState("");

  const handlesubmit = async (e)=>{

    e.preventDefault();
    const data ={name, price, category, stock}
    const res = await fetch("/api/add", {
      method: "POST",
        headers: { "Content-Type": "application/json" },
      body:JSON.stringify({name, price, category,stock})

    })
    const resget = await res.json();
    if(resget.success){
      alert("Product added successfull");
    }else{
      alert("Internal server erro")
    }
    console.log(resget);
  }
  return (
   <>
    <div>
      <div className="flex gap-10 flex-wrap "> 
      <label>Enter your product name:
        <input value={name} className="border border-black" onChange={(e)=> setName(e.target.value)} type="text" />
      </label>
      <label>Enter price:
        <input value={price} className="border border-black" onChange={(e)=> setPrice(e.target.value)} type="number" />
      </label>
      <label>Enter category: 
        <input value={category} className="border border-black" onChange={(e)=> setCategory(e.target.value)} type="text" />
      </label>
      <label>Enter stock : 
        <input value={stock} className="border border-black" onChange={(e)=> setStock(e.target.value)} type="number" />
      </label>



      </div>
      <button className=" mt-10 p-3 bg-green-500" onClick={handlesubmit}> submit</button>
    </div>
   </>
  );
}
