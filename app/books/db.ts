import fs from "fs/promises";
import path from "path";
import { Book } from "./BookData";

const jsonFilePath = path.join(process.cwd(), "app", "books", "books.json");

export async function getBooks(): Promise<Book[]> {
  try {
    const data = await fs.readFile(jsonFilePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading books database file:", error);
    return [];
  }
}

export async function saveBooks(books: Book[]): Promise<boolean> {
  try {
    await fs.writeFile(jsonFilePath, JSON.stringify(books, null, 2), "utf-8");
    return true;
  } catch (error) {
    console.error("Error writing to books database file:", error);
    return false;
  }
}

export async function getBookById(id: string): Promise<Book | null> {
  const books = await getBooks();
  return books.find((b) => b.id === id) || null;
}
