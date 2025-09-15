import dbConnect from "../../../lib/db";
import Orders from "../../../lib/models/Orders";

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, products, total } = body;

    if (!email || !products || !total) {
       return NextResponse.json({ error: "Missing fields" }), {
        status: 400,
      };
    }

    await dbConnect();
    const newOrder = await Orders.create({ email, products, total });

    return (
      NextResponse.json({ success: true, order: newOrder }),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error saving order:", error);
     return NextResponse.json({ error: "Internal Server Error" }), {
      status: 500,
    };
  }
}
