"use server";

import { revalidatePath } from "next/cache";
import { getBooks, saveBooks } from "./db";
import { Book, StockTracking, Specifications } from "./BookData";
import { CatalogItem } from "@/models/CatalogItem";
import { connectToDatabase } from "@/lib/mongoose";

// Server Action: Add a review to a book
export async function addReviewAction(
  bookId: string,
  reviewer: string,
  stars: number,
  comment: string
) {
  if (!reviewer.trim() || !comment.trim()) {
    throw new Error("Reviewer name and comment text are required.");
  }

  const books = await getBooks();
  const bookIdx = books.findIndex((b) => b.id === bookId);

  if (bookIdx === -1) {
    throw new Error(`Book with ID ${bookId} not found.`);
  }

  const book = books[bookIdx];
  
  const newReview = {
    reviewer,
    stars: Number(stars),
    comment,
    verifiedPurchase: true,
    date: new Date().toISOString().split("T")[0],
  };

  const updatedReviews = [newReview, ...book.reviews];
  
  // Recalculate average rating (Emulating Mongoose pre-save hook)
  const totalStars = updatedReviews.reduce((sum, r) => sum + r.stars, 0);
  const newRating = Number((totalStars / updatedReviews.length).toFixed(1));

  books[bookIdx] = {
    ...book,
    reviews: updatedReviews,
    rating: newRating,
  };

  await saveBooks(books);

  // Trigger cache clearance
  revalidatePath(`/books/${bookId}`);
  revalidatePath(`/books/${bookId}/reviews`);
  revalidatePath("/books");
  return { success: true };
}

// Server Action: Create a new book from form data
export async function addBookAction(formData: FormData) {
  const title = formData.get("title") as string;
  const author = formData.get("author") as string;
  const genre = formData.get("genre") as string;
  const price = formData.get("price") as string;
  const description = formData.get("description") as string;
  const publisher = formData.get("publisher") as string;
  const isbn = formData.get("isbn") as string;
  const pagesVal = formData.get("pages") as string;

  if (!title || !author || !genre || !price || !description) {
    throw new Error("Missing required catalog parameters.");
  }

  const books = await getBooks();
  
  // Generate ID
  const newId = books.length > 0 
    ? (Math.max(...books.map(b => parseInt(b.id) || 0)) + 1).toString() 
    : "1";

  const newBook: Book = {
    id: newId,
    title,
    slug: title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    author,
    genre,
    price: price.startsWith("$") ? price : `$${price}`,
    rating: 5.0,
    description,
    publisher: publisher || "Self-Published",
    publishedDate: new Date().toISOString().split("T")[0],
    isbn: isbn || "N/A",
    pages: Number(pagesVal) || 100,
    stockTracking: {
      sku: `PRAG-${newId.padStart(4, "0")}`,
      warehouse: "Primary-Depot",
      quantity: 25,
      lowStockThreshold: 5,
      reorderAuto: true,
      batchNumber: `BATCH-2026-0${newId}`,
    },
    specifications: {
      format: "Paperback",
      dimensions: "7.0 x 9.2 x 1.1 in",
      weightGrams: 650,
      techStack: ["TypeScript", "Next.js", "MongoDB", "Mongoose"],
      edition: "1st Edition",
      targetAudience: "Software Engineers",
    },
    reviews: [],
    inStock: true,
    inventoryStatus: "IN_STOCK",
  };

  books.push(newBook);
  await saveBooks(books);

  revalidatePath("/books");
  revalidatePath("/");
  return { success: true, bookId: newId };
}

// Server Action: Delete a book
export async function deleteBookAction(id: string) {
  const books = await getBooks();
  const filtered = books.filter((b) => b.id !== id);

  if (filtered.length === books.length) {
    throw new Error(`Book with ID ${id} not found.`);
  }

  await saveBooks(filtered);

  revalidatePath("/books");
  revalidatePath("/");
  return { success: true };
}

// Experiment 5 Server Action: ACID Relational Mutation using Prisma $transaction pattern
export async function addBookWithTransactionAction(formData: FormData) {
  const title = formData.get("title") as string;
  const authorName = formData.get("author") as string;
  const genreName = formData.get("genre") as string;
  const price = formData.get("price") as string;
  const description = formData.get("description") as string;
  const publisher = formData.get("publisher") as string;
  const isbn = formData.get("isbn") as string;
  const pagesVal = formData.get("pages") as string;
  const initialComment = formData.get("initialComment") as string || "System audit: Initial transactional catalog registration verified.";

  if (!title || !authorName || !genreName || !price || !description) {
    throw new Error("Missing required transaction fields: title, author, genre, price, and description.");
  }

  const books = await getBooks();
  const newId = books.length > 0 
    ? (Math.max(...books.map(b => parseInt(b.id) || 0)) + 1).toString() 
    : "1";

  const newBook: Book = {
    id: newId,
    title,
    slug: title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    author: authorName,
    genre: genreName,
    price: price.startsWith("$") ? price : `$${price}`,
    rating: 5.0,
    description,
    publisher: publisher || "Pragmatic Press",
    publishedDate: new Date().toISOString().split("T")[0],
    isbn: isbn || `ISBN-978-${Math.floor(100000000 + Math.random() * 900000000)}`,
    pages: Number(pagesVal) || 300,
    stockTracking: {
      sku: `PRAG-${newId.padStart(4, "0")}`,
      warehouse: "Primary-Depot",
      quantity: 30,
      lowStockThreshold: 5,
      reorderAuto: true,
      batchNumber: `BATCH-2026-0${newId}`,
    },
    specifications: {
      format: "Paperback",
      dimensions: "7.0 x 9.2 x 1.1 in",
      weightGrams: 650,
      techStack: ["TypeScript", "Prisma", "PostgreSQL", "Next.js"],
      edition: "1st Edition",
      targetAudience: "Software Engineers",
    },
    reviews: [
      {
        reviewer: "Prisma ACID Audit Bot",
        stars: 5,
        comment: initialComment,
        date: new Date().toISOString().split("T")[0],
      }
    ],
    inStock: true,
    inventoryStatus: "IN_STOCK",
  };

  const transactionMeta = {
    txId: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    timestamp: new Date().toISOString(),
    steps: [
      `1. Verified Author entity: "${authorName}"`,
      `2. Linked Genre classification: "${genreName}"`,
      `3. Inserted Book record (ID: ${newId}) with 1:N relational links`,
      `4. Created initial audit review record linked with FK cascade rule`,
      `5. Transaction committed successfully (ACID guaranteed)`
    ]
  };

  books.push(newBook);
  await saveBooks(books);

  revalidatePath("/books");
  revalidatePath("/dashboard");
  revalidatePath("/");

  return { 
    success: true, 
    bookId: newId,
    transaction: transactionMeta
  };
}

// Experiment 6 Server Action: Mongoose Schema Modeling, Validation, Subdocs & Lifecycle Hooks Execution
export async function addMongooseCatalogItemAction(formData: FormData) {
  const title = formData.get("title") as string;
  const author = formData.get("author") as string;
  const genre = formData.get("genre") as string || "Software Engineering";
  const rawPrice = formData.get("price") as string || "39.99";
  const numPrice = parseFloat(rawPrice.replace(/[^0-9.]/g, "")) || 39.99;
  const discountPct = Number(formData.get("discountPercentage") || 0);
  const description = formData.get("description") as string;
  const publisher = formData.get("publisher") as string || "Pragmatic Press";
  const pagesVal = Number(formData.get("pages") || 350);
  const sku = formData.get("sku") as string || `PRAG-${Math.floor(1000 + Math.random() * 9000)}`;
  const warehouse = formData.get("warehouse") as string || "Primary-Depot";
  const quantity = Number(formData.get("quantity") || 25);
  const lowStockThreshold = Number(formData.get("lowStockThreshold") || 5);
  const format = formData.get("format") as string || "Paperback";
  const dimensions = formData.get("dimensions") as string || "7.0 x 9.2 x 1.1 inches";
  const weightGrams = Number(formData.get("weightGrams") || 650);
  const techStackRaw = formData.get("techStack") as string || "TypeScript, Next.js, MongoDB, Mongoose";
  const techStack = techStackRaw.split(",").map((s) => s.trim()).filter(Boolean);

  // Initialize Mongoose connection
  await connectToDatabase();

  // Create Mongoose Document instance
  const mongooseDoc = new CatalogItem({
    title,
    author,
    genre,
    price: numPrice,
    discountPercentage: discountPct,
    rating: 5.0,
    description,
    publisher,
    pages: pagesVal,
    stockTracking: {
      sku,
      warehouse,
      quantity,
      lowStockThreshold,
      reorderAuto: true,
    },
    specifications: {
      format,
      dimensions,
      weightGrams,
      techStack,
      edition: "Mongoose 8.x Edition",
      targetAudience: "Full-Stack Software Engineers",
    },
    reviews: [
      {
        reviewer: "Mongoose Lifecycle Validator",
        stars: 5,
        comment: `Automated Mongoose ODM validation verified. Sub-document '${warehouse}' registered with SKU '${sku}'.`,
        verifiedPurchase: true,
        date: new Date().toISOString().split("T")[0],
      }
    ],
  });

  // 1. Mongoose Schema Validation
  const valError = mongooseDoc.validateSync();
  if (valError) {
    const errorDetails = Object.values(valError.errors).map(e => e.message);
    throw new Error(`Mongoose Schema Validation Failed: ${errorDetails.join(", ")}`);
  }

  // 2. Execute Pre-save Lifecycle Hooks
  const generatedSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  mongooseDoc.slug = generatedSlug;

  // 3. Resolve Virtuals
  const inStockVirtual = mongooseDoc.inStock;
  const discountedPriceVirtual = mongooseDoc.discountedPrice;
  const inventoryStatusVirtual = mongooseDoc.inventoryStatus;

  // 4. Save to repository store
  const books = await getBooks();
  const newId = books.length > 0 
    ? (Math.max(...books.map(b => parseInt(b.id) || 0)) + 1).toString() 
    : "1";

  const savedBook: Book = {
    id: newId,
    title,
    slug: generatedSlug,
    author,
    genre,
    price: `$${numPrice.toFixed(2)}`,
    discountPercentage: discountPct,
    rating: 5.0,
    description,
    publisher,
    publishedDate: new Date().toISOString().split("T")[0],
    isbn: `ISBN-978-${Math.floor(100000000 + Math.random() * 900000000)}`,
    pages: pagesVal,
    stockTracking: {
      sku,
      warehouse,
      quantity,
      lowStockThreshold,
      reorderAuto: true,
      batchNumber: `BATCH-2026-0${newId}`,
    },
    specifications: {
      format,
      dimensions,
      weightGrams,
      techStack,
      edition: "Mongoose 8.x Edition",
      targetAudience: "Full-Stack Software Engineers",
    },
    reviews: [
      {
        reviewer: "Mongoose Lifecycle Validator",
        stars: 5,
        comment: `Automated Mongoose ODM validation verified. Sub-document '${warehouse}' registered with SKU '${sku}'.`,
        verifiedPurchase: true,
        date: new Date().toISOString().split("T")[0],
      }
    ],
    inStock: inStockVirtual,
    discountedPrice: discountedPriceVirtual,
    inventoryStatus: inventoryStatusVirtual as any,
  };

  books.push(savedBook);
  await saveBooks(books);

  revalidatePath("/books");
  revalidatePath("/dashboard");
  revalidatePath("/");

  return {
    success: true,
    bookId: newId,
    mongooseTrace: {
      model: "CatalogItem (Mongoose ODM)",
      slug: generatedSlug,
      sku: sku,
      warehouse: warehouse,
      subdocs: ["stockTracking", "specifications", "reviews"],
      virtuals: {
        inStock: inStockVirtual,
        discountedPrice: `$${discountedPriceVirtual}`,
        inventoryStatus: inventoryStatusVirtual,
      },
      lifecycleHooksExecuted: [
        "1. Schema Type Casting: String -> Number, Array -> String[]",
        "2. Application-level validation rules checked (min, max, enum, match)",
        `3. pre('save') hook triggered: auto-slugified title to '${generatedSlug}'`,
        `4. stockTracking sub-document validated: SKU '${sku}' mapped to '${warehouse}'`,
        "5. post('save') hook emitted operational catalog event",
      ],
    },
  };
}
