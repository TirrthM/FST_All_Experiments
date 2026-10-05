import mongoose, { Schema, Document, Model } from "mongoose";

// Experiment 6: Category Schema with Mongoose ODM
export interface ICategory extends Document {
  name: string;
  slug: string;
  description?: string;
  itemCount: number;
  createdAt: Date;
}

const CategorySchema: Schema<ICategory> = new Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is mandatory"],
      unique: true,
      trim: true,
      minlength: [2, "Category name must have at least 2 characters"],
      maxlength: [50, "Category name cannot exceed 50 characters"],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      maxlength: [250, "Description cannot exceed 250 characters"],
    },
    itemCount: {
      type: Number,
      default: 0,
      min: [0, "Item count cannot be negative"],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Mongoose Pre-Save Lifecycle Hook: Auto-generate URL slug
CategorySchema.pre<ICategory>("save", function () {
  if (this.isModified("name") || !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }
});

export const Category: Model<ICategory> =
  mongoose.models.Category || mongoose.model<ICategory>("Category", CategorySchema);

export default Category;
