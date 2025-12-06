import prisma from "@/lib/prisma";
export const runtime = "nodejs";


export async function GET(req, ctx) {
  try {
    const params = await ctx.params;
    const id = params.id;

    if (!id) {
      return Response.json({ error: "Category id required" }, { status: 400 });
    }

    const category = await prisma.category.findUnique({
      where: { id: Number(id) },
      include: {
        products: {
          select: {
            id: true,
            name: true,
            price: true,
            imageUrl: true,
          },
        },
      },
    });

    if (!category) {
      return Response.json({ error: "Category not found" }, { status: 404 });
    }

    return Response.json(category);
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PUT(req, ctx) {
  try {
    const params = await ctx.params;
    const id = params.id;

    const data = await req.json();

    const updated = await prisma.category.update({
      where: { id: Number(id) },
      data,
    });

    return Response.json(updated);
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
export async function DELETE(req, ctx) {
  try {
    const params = await ctx.params;
    const id = params.id;

    await prisma.category.delete({
      where: { id: Number(id) },
    });

    return Response.json({ message: "Category deleted successfully" });
  } catch (err) {
    console.error("DELETE ERROR:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
