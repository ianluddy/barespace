// GET /api/items/[id]
export async function GET(request, { params }) {
  const id = parseInt(params.id);
  const item = items.find(item => item.id === id);
  
  if (!item) {
    return Response.json(
      { error: 'Item not found' },
      { status: 404 }
    );
  }
  
  return Response.json(item);
} 