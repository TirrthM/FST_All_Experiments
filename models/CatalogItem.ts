import mongoose, { Schema, Document, Model, Types } from "mongoose";

// Experiment 6: Operational Schemas for an E-Commerce Catalog Tracking System with Mongoose ODM

// 1. Nested Sub-document Schema: Stock Tracking
export interface IStockTracking {
  sku: string;
  warehouse: string;
  quantity: number;
  lowStockThreshold: number;
  reorderAuto: boolean;
  batchNumber?: string;
}

const StockTrackingSchema = new Schema<IStockTracking>(
  {
    sku: {
      type: String,
      required: [true, "Stock Keeping Unit (SKU) is required for inventory tracking"],
      uppercase: true,
      trim: true,
      match: [/^[A-Z0-9_-]{4,20}$/, "SKU must contain 4-20 alphanumeric characters, dashes, or underscores"],
    },
    warehouse: {
      type: String,
      required: [true, "Warehouse location must be designated"],
      enum: {
        values: ["Main-East", "Main-West", "Europe-Hub", "Asia-Central", "Primary-Depot"],
        message: "{VALUE} is not an authorized warehouse depot",
      },
      default: "Primary-Depot",
    },
    quantity: {
      type: Number,
      required: true,
      min: [0, "Stock quantity cannot drop below 0"],
      default: 10,
    },
    lowStockThreshold: {
      type: Number,
      default: 5,
      min: [1, "Threshold must be at least 1 unit"],
    },
    reorderAuto: {
      type: Boolean,
      default: true,
    },
    batchNumber: {
      type: String,
      default: () => `BATCH-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    },
  },
  { _id: false }
);

// 2. Nested Sub-document Schema: Embedded Customer Reviews
export interface IReviewSubdoc {
  reviewer: string;
  stars: number;
  comment: string;
  verifiedPurchase: boolean;
  date: string;
}

const ReviewSubdocSchema = new Schema<IReviewSubdoc>(
  {
    reviewer: {
      type: String,
      required: [true, "Reviewer name is required"],
      trim: true,
      minlength: [2, "Reviewer name too short"],
    },
    stars: {
      type: Number,
      required: true,
      min: [1, "Minimum rating is 1 star"],
      max: [5, "Maximum rating is 5 stars"],
      default: 5,
    },
    comment: {
      type: String,
      required: [true, "Review commentary is required"],
      maxlength: [1000, "Review commentary exceeded 1000 characters"],
    },
    verifiedPurchase: {
      type: Boolean,
      default: true,
    },
    date: {
      type: String,
      default: () => new Date().toISOString().split("T")[0],
    },
  },
  { _id: true, timestamps: true }
);

// 3. Polymorphic / Semi-Structured Specifications Sub-document
export interface ISpecifications {
  format?: string;
  dimensions?: string;
  weightGrams?: number;
  techStack?: string[];
  edition?: string;
  targetAudience?: string;
  customAttributes?: Map<string, string>;
}

const SpecificationsSchema = new Schema<ISpecifications>(
  {
    format: {
      type: String,
      enum: ["Hardcover", "Paperback", "Digital E-Book", "Audiobook", "Deluxe Edition"],
      default: "Paperback",
    },
    dimensions: {
      type: String,
      default: "7.0 x 9.2 x 1.1 inches",
    },
    weightGrams: {
      type: Number,
      min: [0, "Weight cannot be negative"],
      default: 650,
    },
    techStack: {
      type: [String],
      default: ["TypeScript", "Next.js", "MongoDB", "Mongoose"],
    },
    edition: {
      type: String,
      default: "Standard 1st Edition",
    },
    targetAudience: {
      type: String,
      default: "Full-Stack Developers & Software Engineers",
    },
    customAttributes: {
      type: Map,
      of: String,
      default: {},
    },
  },
  { _id: false }
);

// 4. Main Catalog Item Schema
export interface ICatalogItem extends Document {
  title: string;
  slug: string;
  author: string;
  genre: string;
  price: number;
  discountPercentage: number;
  rating: number;
  description: string;
  publisher: string;
  publishedDate: string;
  isbn: string;
  pages: number;
  isFeatured: boolean;
  status: "active" | "archived" | "draft" | "out_of_stock";
  categoryId?: Types.ObjectId;
  stockTracking: IStockTracking;
  specifications: ISpecifications;
  reviews: IReviewSubdoc[];
  createdAt: Date;
  updatedAt: Date;
  // Virtuals
  inStock: boolean;
  discountedPrice: number;
  inventoryStatus: string;
}

const CatalogItemSchema: Schema<ICatalogItem> = new Schema(
  {
    title: {
      type: String,
      required: [true, "Catalog title is mandatory"],
      trim: true,
      minlength: [2, "Title must have at least 2 characters"],
      maxlength: [120, "Title cannot exceed 120 characters"],
      index: true,
    },
    slug: {
      type: String,
      lowercase: true,
      trim: true,
      index: true,
    },
    author: {
      type: String,
      required: [true, "Author designation is required"],
      trim: true,
    },
    genre: {
      type: String,
      required: [true, "Genre category is required"],
      enum: {
        values: [
          "Software Engineering",
          "Software Craftsmanship",
          "Software Design",
          "Cloud Architecture",
          "DevOps & SRE",
          "Full-Stack Development",
        ],
        message: "{VALUE} is not a registered genre category",
      },
      default: "Software Engineering",
      index: true,
    },
    price: {
      type: Number,
      required: [true, "Product retail price is mandatory"],
      min: [0.99, "Price must be at least $0.99"],
      max: [999.99, "Price cannot exceed $999.99"],
    },
    discountPercentage: {
      type: Number,
      min: [0, "Discount cannot be negative"],
      max: [90, "Discount cannot exceed 90%"],
      default: 0,
    },
    rating: {
      type: Number,
      min: [0, "Rating cannot be less than 0"],
      max: [5, "Rating cannot exceed 5.0"],
      default: 5.0,
    },
    description: {
      type: String,
      required: [true, "Catalog item description synopsis is required"],
      minlength: [10, "Description must have at least 10 characters"],
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },
    publisher: {
      type: String,
      default: "Pragmatic Press",
      trim: true,
    },
    publishedDate: {
      type: String,
      default: () => new Date().toISOString().split("T")[0],
    },
    isbn: {
      type: String,
      required: [true, "Standard ISBN identifier is required"],
      trim: true,
      match: [/^(ISBN[-]*(13|10)?[: ]?)?(97[89][ -]?[0-9]{1,5}[ -]?[0-9]+[ -]?[0-9]+[ -]?[0-9])$|^[0-9-]{10,17}$|^N\/A$/, "Invalid ISBN format"],
      default: () => `ISBN-978-${Math.floor(100000000 + Math.random() * 900000000)}`,
    },
    pages: {
      type: Number,
      required: true,
      min: [1, "Pages count must be at least 1"],
      default: 300,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["active", "archived", "draft", "out_of_stock"],
      default: "active",
    },
    // Reference across collection using Schema.Types.ObjectId
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: false,
    },
    // Nested Sub-document: Inventory & Warehouse Tracking
    stockTracking: {
      type: StockTrackingSchema,
      required: true,
      default: () => ({
        sku: `PRAG-${Math.floor(1000 + Math.random() * 9000)}`,
        warehouse: "Primary-Depot",
        quantity: 25,
        lowStockThreshold: 5,
        reorderAuto: true,
      }),
    },
    // Nested Polymorphic Sub-document: Specifications
    specifications: {
      type: SpecificationsSchema,
      default: () => ({}),
    },
    // Embedded Sub-documents: Array of Reviews
    reviews: {
      type: [ReviewSubdocSchema],
      default: [],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual 1: inStock boolean getter derived from nested sub-document
CatalogItemSchema.virtual("inStock").get(function () {
  return (this.stockTracking?.quantity ?? 0) > 0;
});

// Virtual 2: discountedPrice computed dynamically
CatalogItemSchema.virtual("discountedPrice").get(function () {
  if (!this.discountPercentage || this.discountPercentage === 0) {
    return this.price;
  }
  const discounted = this.price * (1 - this.discountPercentage / 100);
  return Number(discounted.toFixed(2));
});

// Virtual 3: inventoryStatus derived dynamically
CatalogItemSchema.virtual("inventoryStatus").get(function () {
  const qty = this.stockTracking?.quantity ?? 0;
  const threshold = this.stockTracking?.lowStockThreshold ?? 5;
  if (qty === 0) return "OUT_OF_STOCK";
  if (qty <= threshold) return "LOW_STOCK";
  return "IN_STOCK";
});

// Pre-Save Lifecycle Middleware Hook: Auto slug generation & rating aggregation
CatalogItemSchema.pre<ICatalogItem>("save", function () {
  // 1. Slugify Title
  if (this.isModified("title") || !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  // 2. Recalculate average rating from embedded reviews subdocuments
  if (this.reviews && this.reviews.length > 0) {
    const totalStars = this.reviews.reduce((sum, r) => sum + r.stars, 0);
    this.rating = Number((totalStars / this.reviews.length).toFixed(1));
  }

  // 3. Status synchronization with stock
  if (this.stockTracking && this.stockTracking.quantity === 0) {
    this.status = "out_of_stock";
  } else if (this.status === "out_of_stock" && this.stockTracking.quantity > 0) {
    this.status = "active";
  }
});

// Post-Save Lifecycle Hook: Operational logging & event trigger
CatalogItemSchema.post<ICatalogItem>("save", function (doc) {
  console.log(`[Mongoose Hook - post('save')] Document successfully persisted: ID=${doc._id}, SKU=${doc.stockTracking?.sku}, inStock=${doc.inStock}`);
});

export const CatalogItem: Model<ICatalogItem> =
  mongoose.models.CatalogItem || mongoose.model<ICatalogItem>("CatalogItem", CatalogItemSchema);

export default CatalogItem;
