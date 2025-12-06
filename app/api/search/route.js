import prisma from "@/lib/prisma";
export const runtime = "nodejs";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    const q = searchParams.get("query")?.trim() || "";
    const categoryId = searchParams.get("categoryId");

    if (!q) return Response.json([]);

    const where = {
      name: {
        contains: q,   // بدون mode
      },
    };

    if (categoryId) {
      where.categoryId = Number(categoryId);
    }

    const products = await prisma.product.findMany({
      where,
      include: { category: true },
      take: 10,
    });

    return Response.json(products);
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
