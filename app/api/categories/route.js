import prisma from "@/lib/prisma";
export const runtime = "nodejs";
export async function GET() {
  const categories = await prisma.category.findMany({
    select: {
      id: true,
      name: true,
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

  const modified = categories
    .filter(cat => cat.products.length >= 4)
    .map(cat => ({
      ...cat,
      products:
        cat.products.length > 8
          ? cat.products.slice(0, 8)
          : cat.products
    }));

  return Response.json(modified);
}


export async function POST(req) {
  const data = await req.json();

  if (!data.name) {
    return new Response(
      JSON.stringify({ error: "Name is required" }),
      { status: 400 }
    );
  }

  const category = await prisma.category.create({
    data: { name: data.name },
    select: {
      id: true,
      name: true,
      products: true, 
    },
  });

  return new Response(JSON.stringify(category), { status: 201 });
}

