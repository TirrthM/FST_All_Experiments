import { NextResponse } from "next/server";
import { getBooks, saveBooks } from "@/app/books/db";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/books/[id] - Retrieve single book
export async function GET(request: Request, { params }: RouteParams) {
  const { id } = await params;
  const books = await getBooks();
  const book = books.find((b) => b.id === id);

  if (!book) {
    return NextResponse.json({ error: `Book with ID ${id} not found.` }, { status: 404 });
  }

  return NextResponse.json(book);
}

// PUT /api/books/[id] - Update book details
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
    const books = await getBooks();
    const bookIdx = books.findIndex((b) => b.id === id);

    if (bookIdx === -1) {
      return NextResponse.json({ error: `Book with ID ${id} not found.` }, { status: 404 });
    }

    const currentBook = books[bookIdx];
    
    // Update fields
    const updatedBook = {
      ...currentBook,
      ...body,
      id, // enforce keeping the same ID
    };

    books[bookIdx] = updatedBook;
    await saveBooks(books);

    return NextResponse.json(updatedBook);
  } catch (error) {
    console.error(`API PUT books/[id] failed for ID:`, error);
    return NextResponse.json({ error: "Failed to process PUT request." }, { status: 500 });
  }
}

// DELETE /api/books/[id] - Delete a book
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const books = await getBooks();
    const filtered = books.filter((b) => b.id !== id);

    if (filtered.length === books.length) {
      return NextResponse.json({ error: `Book with ID ${id} not found.` }, { status: 404 });
    }

    await saveBooks(filtered);
    return NextResponse.json({ message: `Book with ID ${id} deleted successfully.` });
  } catch (error) {
    console.error(`API DELETE books/[id] failed for ID:`, error);
    return NextResponse.json({ error: "Failed to process DELETE request." }, { status: 500 });
  }
}
