import { NextResponse } from "next/server";
import clientPromise from "../../../../lib/mongodb";
import dbConnect from "../../../lib/db";
import Orders from "../../../lib/models/Orders";

export async function POST(request) {
  try {
    const { orderID,  email, items  } = await request.json();

    const clientId = process.env.PAYPAL_CLIENT_ID;
    const secret = process.env.PAYPAL_CLIENT_SECRET;
    const basicAuth = Buffer.from(`${clientId}:${secret}`).toString("base64");

    // Get access token
    const tokenRes = await fetch("https://api-m.sandbox.paypal.com/v1/oauth2/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${basicAuth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    });

    if (!tokenRes.ok) {
      throw new Error("Failed to get access token");
    }

    const { access_token } = await tokenRes.json();

    // Capture payment
    const captureRes = await fetch(
      `https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderID}/capture`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!captureRes.ok) {
      const errData = await captureRes.json();
      return NextResponse.json({ error: errData }, { status: 400 });
    }

    const captureData = await captureRes.json();

    if (captureData.status !== "COMPLETED") {
      return NextResponse.json({ error: "Payment not completed" }, { status: 400 });
    }

    // Save to MongoDB
    await dbConnect();

    const order =  await new Orders({
      orderID,
      email,
      items,
      status: captureData.status,
      payer: captureData.payer,
      purchase_units: captureData.purchase_units,
      create_time: new Date(),
    });

    return NextResponse.json(captureData);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
