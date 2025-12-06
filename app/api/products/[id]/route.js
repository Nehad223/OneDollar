import prisma from "@/lib/prisma";
export const runtime = "nodejs";


export async function GET(req, ctx) {
  try {
    const { id } = await ctx.params;

    const product = await prisma.product.findUnique({
      where: { id: Number(id) },
      include: { category: true },
    });

    if (!product) {
      return new Response(JSON.stringify({ error: "Not found" }), { status: 404 });
    }

    return new Response(JSON.stringify(product), { status: 200 });
  } catch (err) {
    console.error("GET ERROR:", err);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}

export async function PUT(req, ctx) {
  try {
    const { id } = await ctx.params;
    const body = await req.json();

    console.log("UPDATING ID:", id, body);

    const updated = await prisma.product.update({
      where: { id: Number(id) },
      data: {
        name: body.name,
        imageUrl: body.imageUrl,
        price: Number(body.price),
      },
    });

    return new Response(JSON.stringify(updated), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("PUT ERROR:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}


export async function DELETE(req, ctx) {
  try {
    const { id } = await ctx.params; 

    await prisma.product.delete({
      where: { id: Number(id) },
    });

    return new Response(JSON.stringify({ message: "Deleted" }), { status: 200 });
  } catch (err) {
    console.error("DELETE ERROR:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
