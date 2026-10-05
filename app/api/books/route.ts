import { NextResponse } from "next/server";
import { getBooks, saveBooks } from "@/app/books/db";
import { Book } from "@/app/books/BookData";

// GET /api/books - Retrieve all books
export async function GET() {
  const books = await getBooks();
  return NextResponse.json(books);
}

// POST /api/books - Add a new book
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, author, genre, price, description, publisher, publishedDate, isbn, pages } = body;

    // Validation
    if (!title || !author || !genre || !price || !description) {
      return NextResponse.json(
        { error: "Missing required catalog fields: title, author, genre, price, and description are mandatory." },
        { status: 400 }
      );
    }

    const books = await getBooks();
    
    // Generate new unique ID
    const newId = books.length > 0 
      ? (Math.max(...books.map(b => parseInt(b.id) || 0)) + 1).toString() 
      : "1";

    const newBook: Book = {
      id: newId,
      title,
      author,
      genre,
      price: price.startsWith("$") ? price : `$${price}`,
      rating: 5.0, // default rating for new book
      description,
      publisher: publisher || "Self-Published",
      publishedDate: publishedDate || new Date().toISOString().split("T")[0],
      isbn: isbn || "N/A",
      pages: Number(pages) || 100,
      reviews: []
    };

    books.push(newBook);
    await saveBooks(books);

    return NextResponse.json(newBook, { status: 201 });
  } catch (error) {
    console.error("API POST books failed:", error);
    return NextResponse.json({ error: "Failed to process POST request." }, { status: 500 });
  }
}
