// In-memory storage for demo purposes
let items = [
  { id: 1, name: 'Item 1', description: 'This is item 1' },
  { id: 2, name: 'Item 2', description: 'This is item 2' },
];

// GET /api/items
export async function GET() {
  return Response.json(items);
}

// POST /api/items
export async function POST(request) {
  try {
    const body = await request.json();
    const newItem = {
      id: items.length + 1,
      name: body.name,
      description: body.description,
    };
    items.push(newItem);
    return Response.json(newItem, { status: 201 });
  } catch (error) {
    return Response.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }
} 