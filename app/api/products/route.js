import prisma from "@/lib/prisma";
export const runtime = "nodejs";
// جلب جميع المنتجات مع بيانات الكاتيجوري
export async function GET() {
  const products = await prisma.product.findMany({
    include: { category: true },
  });
  return Response.json(products);
}

// إضافة منتج جديد
export async function POST(req) {
  const data = await req.json();

  if (!data.name || !data.price || !data.imageUrl || !data.categoryId) {
    return new Response(JSON.stringify({ error: "All fields are required" }), { status: 400 });
  }

  const product = await prisma.product.create({
    data: {
      name: data.name,
      price: Number(data.price),
      imageUrl: data.imageUrl,
      categoryId: Number(data.categoryId),
    },
    include: { category: true }, 
  });

  return new Response(JSON.stringify(product), { status: 201 });
}
