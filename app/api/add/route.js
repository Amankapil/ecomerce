import { NextResponse } from "next/server";
import Product from "../../lib/models/Product";
import dbConnect from "../../lib/db";


export async function POST(request) {
    await dbConnect();
  try {
    const {
      name,
      price,
      category,
      stock,
      description,
     
    } = await request.json();
    
    const back = {
        name,
        price,
        category,
        stock,
        description,

    };
console.log(back);

      // Create new transaction
      const product = new Product({
        name,
        price,
        category,
        stock,
        description,
        createdAt: new Date(),
      });

      await product.save();


    return NextResponse.json({
      success: true,
      message: "Your Product added",
      data: product,
    });
  } catch (error) {
    console.error("Error processing Product:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}


export async function GET(req) {
  try {
    await dbConnect();
    const products = await Product.find({});
    return NextResponse.json({ success: true, data: products });
  } catch (err) {
    return NextResponse.json({
      success: false,
      error: err.message,
      status: 500,
    });
  }
}