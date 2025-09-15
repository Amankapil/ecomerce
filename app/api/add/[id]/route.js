import { NextResponse } from "next/server";
// import Product from "@/models/Product";
import dbConnect from "../../../lib/db";
import Product from "../../../lib/models/Product";

export async function DELETE(req, { params }) {
  await dbConnect();
  try {
    await Product.findByIdAndDelete(params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
    await dbConnect();
  const body = await req.json();

  try {
    const updated = await Product.findByIdAndUpdate(params.id, body, { new: true });
    return NextResponse.json({ data: updated });
  } catch (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
