"use client";

import React, { useState, useEffect } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { RefreshCw, Library, Star, PlusCircle, Trash2, Check, BookOpen, AlertTriangle, Trash, Database, Layers, ShieldCheck, Cpu, Code2, Tag, Box } from "lucide-react";
import { deleteBookAction, addBookAction, addBookWithTransactionAction, addMongooseCatalogItemAction } from "@/app/books/actions";
import { Book } from "@/app/books/BookData";

type Log = {
  id: string;
  type: "checkout" | "warning" | "sync" | "crud" | "mongoose";
  message: string;
  timestamp: string;
};

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  const [booksList, setBooksList] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSchemaTab, setActiveSchemaTab] = useState<"schema" | "subdocs" | "hooks" | "virtuals">("schema");
  const [logs, setLogs] = useState<Log[]>([
    { id: "1", type: "mongoose", message: "[Mongoose ODM Hook Committed] Document 'Prisma ORM & Next.js Architecture' embedded with stockTracking subdoc (SKU: PRAG-0005, inStock: true).", timestamp: "12:30:15" },
    { id: "2", type: "crud", message: "[Prisma $transaction Committed] Registered \"GOAT\" (ID: 6) with 1:N Author-Genre FK constraints.", timestamp: "12:27:39" },
    { id: "3", type: "checkout", message: "Reader checkout: Alice Mercer - Clean Code (ID: 2)", timestamp: "12:15:10" },
    { id: "4", type: "sync", message: "Database replica synced successfully: books.json updated", timestamp: "12:12:04" },
    { id: "5", type: "warning", message: "Low stock alert: Clean Code (Copies: 12)", timestamp: "12:05:44" },
    { id: "6", type: "crud", message: "Catalog item loaded: The Pragmatic Programmer", timestamp: "11:59:12" },
  ]);
  const [tasks, setTasks] = useState([
    { id: 1, text: "Verify Mongoose nested subdoc validation for warehouse inventory", done: true },
    { id: 2, text: "Audit pre-save slugification hook across active catalog items", done: true },
    { id: 3, text: "Check polymorphic specifications schema for digital format editions", done: false },
  ]);
  const [newTask, setNewTask] = useState("");

  // Book Creation Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [creationEngine, setCreationEngine] = useState<"mongoose" | "prisma">("mongoose");
  const [formTitle, setFormTitle] = useState("");
  const [formAuthor, setFormAuthor] = useState("");
  const [formGenre, setFormGenre] = useState("Software Engineering");
  const [formPrice, setFormPrice] = useState("49.99");
  const [formDiscount, setFormDiscount] = useState("10");
  const [formDesc, setFormDesc] = useState("");
  const [formPublisher, setFormPublisher] = useState("Pragmatic Press");
  const [formPages, setFormPages] = useState("380");
  const [formSku, setFormSku] = useState("PRAG-8092");
  const [formWarehouse, setFormWarehouse] = useState("Primary-Depot");
  const [formQuantity, setFormQuantity] = useState("28");
  const [formLowStock, setFormLowStock] = useState("5");
  const [formFormat, setFormFormat] = useState("Paperback");
  const [formDimensions, setFormDimensions] = useState("7.0 x 9.2 x 1.1 in");
  const [formWeight, setFormWeight] = useState("650");
  const [formTechStack, setFormTechStack] = useState("TypeScript, Next.js, MongoDB, Mongoose");
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch books list from API
  const fetchBooks = async () => {
    try {
      const res = await fetch("/api/books");
      if (res.ok) {
        const data = await res.json();
        setBooksList(data);
      }
    } catch (err) {
      console.error("Dashboard fetch books failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchBooks();
  }, []);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    setTasks([
      ...tasks,
      { id: Date.now(), text: newTask, done: false }
    ]);
    setNewTask("");
  };

  const toggleTask = (id: number) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  // Mutate: Delete Book using Server Action
  const handleDeleteBook = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      await deleteBookAction(id);
      setBooksList(booksList.filter((b) => b.id !== id));
      
      const timestamp = new Date().toTimeString().split(" ")[0];
      const newLog: Log = {
        id: Math.random().toString(),
        type: "crud",
        message: `Deleted catalog item: "${title}" (ID: ${id})`,
        timestamp,
      };
      setLogs([newLog, ...logs]);
    } catch (err) {
      alert("Failed to delete book.");
      console.error(err);
    }
  };

  // Mutate: Add Book using Mongoose ODM Action or Prisma Action
  const handleAddBookSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);

    const formData = new FormData();
    formData.append("title", formTitle);
    formData.append("author", formAuthor);
    formData.append("genre", formGenre);
    formData.append("price", formPrice);
    formData.append("discountPercentage", formDiscount);
    formData.append("description", formDesc);
    formData.append("publisher", formPublisher);
    formData.append("pages", formPages);
    formData.append("sku", formSku);
    formData.append("warehouse", formWarehouse);
    formData.append("quantity", formQuantity);
    formData.append("lowStockThreshold", formLowStock);
    formData.append("format", formFormat);
    formData.append("dimensions", formDimensions);
    formData.append("weightGrams", formWeight);
    formData.append("techStack", formTechStack);
    formData.append("initialComment", `Operational Mongoose ODM catalog entry verified for '${formAuthor}'.`);

    try {
      let res: any;
      if (creationEngine === "mongoose") {
        res = await addMongooseCatalogItemAction(formData);
      } else {
        res = await addBookWithTransactionAction(formData);
      }

      if (res.success) {
        await fetchBooks();

        setFormTitle("");
        setFormAuthor("");
        setFormDesc("");
        setShowAddForm(false);

        const timestamp = new Date().toTimeString().split(" ")[0];
        let logMsg = "";
        let logType: Log["type"] = "mongoose";

        if (creationEngine === "mongoose" && res.mongooseTrace) {
          logMsg = `[Mongoose ODM Hook Committed] Registered "${formTitle}" with polymorphic specs & stock subdoc (SKU: ${res.mongooseTrace.sku}, inStock: true).`;
          logType = "mongoose";
        } else if (res.transaction) {
          logMsg = `[Prisma $transaction Committed] Registered "${formTitle}" (ID: ${res.bookId}) with 1:N Author-Genre FK constraints.`;
          logType = "crud";
        } else {
          logMsg = `Created catalog item: "${formTitle}" (ID: ${res.bookId})`;
          logType = "crud";
        }

        const newLog: Log = {
          id: Math.random().toString(),
          type: logType,
          message: logMsg,
          timestamp,
        };
        setLogs([newLog, ...logs]);
      }
    } catch (err: any) {
      alert(err.message || "Failed to create catalog item.");
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  // Data mapping for Recharts
  const chartData = booksList.map((book) => ({
    title: book.title.length > 10 ? book.title.substring(0, 10) + "..." : book.title,
    rating: book.rating,
    pages: book.pages,
    stock: book.stockTracking?.quantity ?? (book.pages > 350 ? 25 : 40),
  }));

  const totalCopies = booksList.reduce((sum, b) => sum + b.pages, 0);

  return (
    <div className="space-y-6">
      {/* Title section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="text-left">
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Database className="w-6 h-6 text-brand-500" /> Catalog Operations & Schemas
          </h2>
          <p className="text-xs font-semibold text-slate-505 dark:text-slate-400">
            Document-oriented data modeling with Mongoose schemas, polymorphic sub-documents, lifecycle hooks, and active inventory tracking.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-brand-500 text-white font-bold text-xs hover:bg-brand-600 transition-colors shadow cursor-pointer active:scale-95"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            Add New Catalog Book
          </button>
          <button
            onClick={fetchBooks}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-550 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
            title="Refresh database"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Grid 1: Stock indicators */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Active Products", val: `${booksList.length} Titles`, desc: "Mongoose BSON Documents", icon: BookOpen, color: "text-brand-500" },
          { label: "Inventory Total Copies", val: `${totalCopies} units`, desc: "Nested stock subdocs", icon: Library, color: "text-emerald-500" },
          { label: "ODM Schema Layer", val: "Mongoose 8.x", desc: "Strict schema validations", icon: Layers, color: "text-cyan-500" },
          { label: "Lifecycle Hooks", val: "Active (pre/post)", desc: "Auto-slugify & audit logs", icon: Cpu, color: "text-teal-500" },
        ].map((metric, idx) => {
          const Icon = metric.icon;
          return (
            <div key={idx} className="p-5 rounded-2xl glass-card border-slate-205/30 dark:border-slate-800/40 space-y-3 text-left">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{metric.label}</span>
                <Icon className={`w-5 h-5 ${metric.color}`} />
              </div>
              <div className="space-y-1">
                <span className="text-xl font-black text-slate-900 dark:text-white">{metric.val}</span>
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500">{metric.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mongoose Operational Schema Inspector Card */}
      <div className="p-5 rounded-2xl glass-card border border-slate-200/40 dark:border-slate-800/40 space-y-4 text-left">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/50 dark:border-slate-850/50">
          <div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Code2 className="w-5 h-5 text-brand-500" /> Mongoose Schema & Modeling Architecture
            </h3>
            <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
              Interactive structural abstraction: Semi-structured documents, validation rules, sub-documents, middleware hooks, and virtuals.
            </p>
          </div>
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/60 text-xs font-bold">
            {(["schema", "subdocs", "hooks", "virtuals"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveSchemaTab(tab)}
                className={`px-3 py-1.5 rounded-lg capitalize transition-all cursor-pointer ${
                  activeSchemaTab === tab
                    ? "bg-brand-500 text-white shadow-sm"
                    : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Tab 1: Core Schema & Type Casting */}
        {activeSchemaTab === "schema" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl border border-slate-200/30 dark:border-slate-850/50 bg-slate-50/50 dark:bg-slate-900/20 space-y-2">
              <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-500" /> Validation Rules
              </span>
              <ul className="space-y-1.5 text-slate-600 dark:text-slate-350 text-[11px] font-medium">
                <li>• <strong className="text-slate-800 dark:text-slate-200">title</strong>: required, minlength: 2, maxlength: 120</li>
                <li>• <strong className="text-slate-800 dark:text-slate-200">price</strong>: required, min: 0.99, max: 999.99</li>
                <li>• <strong className="text-slate-800 dark:text-slate-200">genre</strong>: enum registered categories</li>
                <li>• <strong className="text-slate-800 dark:text-slate-200">isbn</strong>: strict Regex format validation</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl border border-slate-200/30 dark:border-slate-850/50 bg-slate-50/50 dark:bg-slate-900/20 space-y-2">
              <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-cyan-500" /> Automatic Type Casting
              </span>
              <ul className="space-y-1.5 text-slate-600 dark:text-slate-350 text-[11px] font-medium">
                <li>• <strong className="text-slate-800 dark:text-slate-200">String → Number</strong>: price, pages, quantity</li>
                <li>• <strong className="text-slate-800 dark:text-slate-200">String → Boolean</strong>: isFeatured, reorderAuto</li>
                <li>• <strong className="text-slate-800 dark:text-slate-200">ISO Strings → Date</strong>: publishedDate, createdAt</li>
                <li>• <strong className="text-slate-800 dark:text-slate-200">Default Values</strong>: auto-assigned on omit</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl border border-slate-200/30 dark:border-slate-850/50 bg-slate-50/50 dark:bg-slate-900/20 space-y-2">
              <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Database className="w-4 h-4 text-brand-500" /> ObjectId Cross-Collection
              </span>
              <ul className="space-y-1.5 text-slate-600 dark:text-slate-350 text-[11px] font-medium">
                <li>• <strong className="text-slate-800 dark:text-slate-200">categoryId</strong>: Schema.Types.ObjectId</li>
                <li>• <strong className="text-slate-800 dark:text-slate-200">Ref</strong>: Category model collection</li>
                <li>• <strong className="text-slate-800 dark:text-slate-200">Population</strong>: .populate(&apos;categoryId&apos;)</li>
                <li>• <strong className="text-slate-800 dark:text-slate-200">BSON storage</strong>: Flexible semi-structured</li>
              </ul>
            </div>
          </div>
        )}

        {/* Tab 2: Nested Sub-Documents */}
        {activeSchemaTab === "subdocs" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl border border-slate-200/30 dark:border-slate-850/50 bg-slate-50/50 dark:bg-slate-900/20 space-y-2">
              <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Box className="w-4 h-4 text-brand-500" /> stockTracking Sub-Document
              </span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Embedded schema tracking inventory per warehouse location:
              </p>
              <div className="p-2.5 rounded-lg bg-slate-900 text-emerald-400 font-mono text-[10px] space-y-1">
                <div>sku: &quot;PRAG-0001&quot; <span className="text-slate-500">// Regex validated</span></div>
                <div>warehouse: &quot;Primary-Depot&quot; <span className="text-slate-500">// Enum list</span></div>
                <div>quantity: 25 <span className="text-slate-500">// min: 0</span></div>
                <div>lowStockThreshold: 5 <span className="text-slate-500">// min: 1</span></div>
                <div>reorderAuto: true</div>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200/30 dark:border-slate-850/50 bg-slate-50/50 dark:bg-slate-900/20 space-y-2">
              <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Tag className="w-4 h-4 text-cyan-500" /> specifications Polymorphic Subdoc
              </span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Semi-structured document attributes tailored for products:
              </p>
              <div className="p-2.5 rounded-lg bg-slate-900 text-teal-300 font-mono text-[10px] space-y-1">
                <div>format: &quot;Paperback&quot; | &quot;Digital E-Book&quot;</div>
                <div>dimensions: &quot;7.0 x 9.2 x 1.1 in&quot;</div>
                <div>weightGrams: 650</div>
                <div>techStack: [&quot;TypeScript&quot;, &quot;Next.js&quot;, &quot;MongoDB&quot;]</div>
                <div>customAttributes: Map&lt;String, String&gt;</div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Lifecycle Hooks */}
        {activeSchemaTab === "hooks" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl border border-slate-200/30 dark:border-slate-850/50 bg-slate-50/50 dark:bg-slate-900/20 space-y-2">
              <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-brand-500" /> pre(&apos;save&apos;) Lifecycle Middleware
              </span>
              <ul className="space-y-1.5 text-slate-600 dark:text-slate-350 text-[11px] font-medium">
                <li>• <strong className="text-slate-800 dark:text-slate-200">Slug Generation</strong>: Normalizes title to url slug automatically</li>
                <li>• <strong className="text-slate-800 dark:text-slate-200">Rating Recalculation</strong>: Aggregates average from embedded reviews</li>
                <li>• <strong className="text-slate-800 dark:text-slate-200">Stock Status Sync</strong>: Sets status = &quot;out_of_stock&quot; when qty = 0</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl border border-slate-200/30 dark:border-slate-850/50 bg-slate-50/50 dark:bg-slate-900/20 space-y-2">
              <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-500" /> post(&apos;save&apos;) Lifecycle Middleware
              </span>
              <ul className="space-y-1.5 text-slate-600 dark:text-slate-350 text-[11px] font-medium">
                <li>• <strong className="text-slate-800 dark:text-slate-200">Audit Trail</strong>: Dispatches operational catalog mutation logs</li>
                <li>• <strong className="text-slate-800 dark:text-slate-200">Inventory Sync</strong>: Emits SKU update events to tracking logger</li>
                <li>• <strong className="text-slate-800 dark:text-slate-200">Virtual Check</strong>: Evaluates dynamic getters on saved document</li>
              </ul>
            </div>
          </div>
        )}

        {/* Tab 4: Virtuals */}
        {activeSchemaTab === "virtuals" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl border border-slate-200/30 dark:border-slate-850/50 bg-slate-50/50 dark:bg-slate-900/20 space-y-1.5">
              <span className="font-bold text-slate-900 dark:text-white">Virtual: inStock</span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono text-emerald-500">
                return this.stockTracking.quantity &gt; 0;
              </p>
              <p className="text-[10px] text-slate-400">Computes true/false from nested warehouse sub-document</p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200/30 dark:border-slate-850/50 bg-slate-50/50 dark:bg-slate-900/20 space-y-1.5">
              <span className="font-bold text-slate-900 dark:text-white">Virtual: discountedPrice</span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono text-cyan-500">
                return this.price * (1 - this.discountPct / 100);
              </p>
              <p className="text-[10px] text-slate-400">Computes promotional pricing dynamically without storing redundantly</p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200/30 dark:border-slate-850/50 bg-slate-50/50 dark:bg-slate-900/20 space-y-1.5">
              <span className="font-bold text-slate-900 dark:text-white">Virtual: inventoryStatus</span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono text-teal-500">
                qty === 0 ? &quot;OUT_OF_STOCK&quot; : &quot;IN_STOCK&quot;
              </p>
              <p className="text-[10px] text-slate-400">Maps quantity against lowStockThreshold subdoc field</p>
            </div>
          </div>
        )}
      </div>

      {/* Book Manager Modal Form Overlay */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <form
            onSubmit={handleAddBookSubmit}
            className="max-w-2xl w-full bg-white dark:bg-[#0f1422] rounded-3xl overflow-hidden border border-slate-200/50 dark:border-slate-850/60 shadow-2xl p-6 space-y-4 text-left my-8"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200/50 dark:border-slate-850/50">
              <div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <Library className="w-5 h-5 text-brand-500" /> Register Catalog Book
                </h3>
                <div className="flex items-center gap-3 mt-1.5">
                  <label className="flex items-center gap-1 text-[11px] font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
                    <input
                      type="radio"
                      name="engine"
                      value="mongoose"
                      checked={creationEngine === "mongoose"}
                      onChange={() => setCreationEngine("mongoose")}
                      className="accent-brand-500"
                    />
                    <span className="text-brand-500 font-extrabold">Mongoose ODM (Document-Oriented)</span>
                  </label>
                  <label className="flex items-center gap-1 text-[11px] font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
                    <input
                      type="radio"
                      name="engine"
                      value="prisma"
                      checked={creationEngine === "prisma"}
                      onChange={() => setCreationEngine("prisma")}
                      className="accent-emerald-500"
                    />
                    <span className="text-emerald-500 font-extrabold">Prisma ORM (Relational Transaction)</span>
                  </label>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="p-1.5 rounded-lg border border-slate-250 dark:border-slate-800 text-slate-450 hover:text-slate-900 dark:hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[9px] uppercase font-bold text-slate-500 dark:text-slate-400">Book Title</label>
                <input
                  type="text"
                  placeholder="e.g. Designing Data-Intensive Applications"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:border-brand-500 text-xs font-semibold text-slate-900 dark:text-white"
                  required
                  disabled={actionLoading}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] uppercase font-bold text-slate-505 dark:text-slate-400">Author Name</label>
                <input
                  type="text"
                  placeholder="e.g. Martin Kleppmann"
                  value={formAuthor}
                  onChange={(e) => setFormAuthor(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:border-brand-500 text-xs font-semibold text-slate-900 dark:text-white"
                  required
                  disabled={actionLoading}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] uppercase font-bold text-slate-505 dark:text-slate-400">Genre Category</label>
                <select
                  value={formGenre}
                  onChange={(e) => setFormGenre(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:border-brand-500 text-xs font-semibold text-slate-900 dark:text-white"
                  disabled={actionLoading}
                >
                  <option value="Software Engineering">Software Engineering</option>
                  <option value="Software Craftsmanship">Software Craftsmanship</option>
                  <option value="Software Design">Software Design</option>
                  <option value="Cloud Architecture">Cloud Architecture</option>
                  <option value="DevOps & SRE">DevOps & SRE</option>
                  <option value="Full-Stack Development">Full-Stack Development</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] uppercase font-bold text-slate-505 dark:text-slate-400">Retail Price ($)</label>
                <input
                  type="text"
                  placeholder="e.g. 49.99"
                  value={formPrice}
                  onChange={(e) => setFormPrice(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:border-brand-500 text-xs font-semibold text-slate-900 dark:text-white"
                  required
                  disabled={actionLoading}
                />
              </div>
            </div>

            {/* Mongoose Nested Sub-Document Form Fields */}
            {creationEngine === "mongoose" && (
              <div className="p-4 rounded-2xl border border-brand-500/20 bg-brand-500/5 space-y-3">
                <span className="text-[10px] font-extrabold text-brand-600 dark:text-brand-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Box className="w-3.5 h-3.5" /> Mongoose Nested Sub-Document: Stock Tracking & Warehouse
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-bold text-slate-500">SKU Code</label>
                    <input
                      type="text"
                      value={formSku}
                      onChange={(e) => setFormSku(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-mono font-bold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-bold text-slate-500">Warehouse</label>
                    <select
                      value={formWarehouse}
                      onChange={(e) => setFormWarehouse(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold"
                    >
                      <option value="Primary-Depot">Primary-Depot</option>
                      <option value="Main-East">Main-East</option>
                      <option value="Main-West">Main-West</option>
                      <option value="Europe-Hub">Europe-Hub</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-bold text-slate-500">Initial Qty</label>
                    <input
                      type="number"
                      value={formQuantity}
                      onChange={(e) => setFormQuantity(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-bold text-slate-500">Discount (%)</label>
                    <input
                      type="number"
                      value={formDiscount}
                      onChange={(e) => setFormDiscount(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[9px] uppercase font-bold text-slate-505 dark:text-slate-400">Description Synopsis</label>
              <textarea
                placeholder="Write a brief overview of this book..."
                value={formDesc}
                onChange={(e) => setFormDesc(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:border-brand-500 text-xs font-semibold text-slate-900 dark:text-white"
                required
                disabled={actionLoading}
              />
            </div>

            <div className="flex justify-end gap-2 text-xs font-bold pt-3 border-t border-slate-200/50 dark:border-slate-850/50">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 rounded-xl border border-slate-250 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                disabled={actionLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-brand-500 text-white hover:bg-brand-600 transition-colors shadow cursor-pointer"
                disabled={actionLoading}
              >
                {actionLoading ? "Processing Mongoose Schema..." : `Submit via ${creationEngine === "mongoose" ? "Mongoose ODM" : "Prisma ORM"}`}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Grid 2: Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Book inventory pages loading */}
        <div className="lg:col-span-2 p-5 rounded-2xl glass-card border-slate-200/40 dark:border-slate-800/40 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200/50 dark:border-slate-850/50">
            <div className="text-left">
              <h3 className="font-bold text-slate-950 dark:text-white">Warehouse Inventory Sub-documents</h3>
              <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">Stock quantities mapped per catalog item</p>
            </div>
          </div>

          <div className="h-72 w-full pt-4">
            {mounted && booksList.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorStock" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0d9488" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#0d9488" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                  <XAxis dataKey="title" stroke="#64748b" fontSize={9} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(15, 23, 42, 0.9)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "12px",
                      color: "#fff"
                    }}
                  />
                  <Area type="monotone" dataKey="stock" stroke="#0d9488" strokeWidth={2.5} fillOpacity={1} fill="url(#colorStock)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">Loading catalog indicators...</div>
            )}
          </div>
        </div>

        {/* Rating chart */}
        <div className="p-5 rounded-2xl glass-card border-slate-205/30 dark:border-slate-800/40 flex flex-col justify-between">
          <div className="text-left">
            <h3 className="font-bold text-slate-950 dark:text-white">Reader Rating Analysis</h3>
            <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">Embedded reviews average aggregation</p>
          </div>

          <div className="h-72 w-full pt-4">
            {mounted && booksList.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                  <XAxis dataKey="title" stroke="#64748b" fontSize={9} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(15, 23, 42, 0.9)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "12px",
                      color: "#fff"
                    }}
                  />
                  <Bar dataKey="rating" fill="#0d9488" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">Loading rating metrics...</div>
            )}
          </div>
        </div>
      </div>

      {/* Book List CRUD Manager Section */}
      <div className="p-5 rounded-2xl glass-card border-slate-200/40 dark:border-slate-800/40 space-y-4 text-left">
        <div>
          <h3 className="font-bold text-slate-955 dark:text-white">Books Registry Manager</h3>
          <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">Delete books directly from the database</p>
        </div>

        {loading ? (
          <div className="space-y-3 py-6 animate-pulse">
            <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-xl" />
            <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-xl" />
          </div>
        ) : (
          <div className="overflow-hidden border border-slate-200/40 dark:border-slate-850/60 rounded-xl">
            <table className="w-full text-xs font-semibold">
              <thead>
                <tr className="bg-slate-100/50 dark:bg-slate-900/40 text-slate-550 border-b border-slate-200/40 dark:border-slate-850/60">
                  <th className="px-4 py-3 text-left">Book ID</th>
                  <th className="px-4 py-3 text-left">Title</th>
                  <th className="px-4 py-3 text-left">Author</th>
                  <th className="px-4 py-3 text-left">Genre</th>
                  <th className="px-4 py-3 text-left">Price</th>
                  <th className="px-4 py-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/40 dark:divide-slate-850/60 text-slate-700 dark:text-slate-300">
                {booksList.map((book) => (
                  <tr key={book.id} className="hover:bg-slate-100/30 dark:hover:bg-slate-900/10 transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-slate-500">{book.id}</td>
                    <td className="px-4 py-3 font-extrabold text-slate-950 dark:text-white">{book.title}</td>
                    <td className="px-4 py-3">{book.author}</td>
                    <td className="px-4 py-3">{book.genre}</td>
                    <td className="px-4 py-3 font-black text-brand-500">{book.price}</td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleDeleteBook(book.id, book.title)}
                        className="p-2 rounded bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white transition-colors cursor-pointer"
                        title="Delete Book"
                      >
                        <Trash className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Grid 3: Operational Checklists & Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Library checklists task widget */}
        <div className="p-5 rounded-2xl glass-card border-slate-200/40 dark:border-slate-800/40 space-y-4">
          <div className="text-left">
            <h3 className="font-bold text-slate-950 dark:text-white">Library Action Checklist</h3>
            <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500">Stateful task tracker for operators</p>
          </div>

          <form onSubmit={handleAddTask} className="flex gap-2">
            <input
              type="text"
              placeholder="Assign library task..."
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              className="flex-1 px-3 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 focus:outline-none focus:border-brand-500 text-slate-905 dark:text-white shadow-sm"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-brand-500 text-white font-bold text-xs flex items-center gap-1 hover:bg-brand-600 transition-colors shadow cursor-pointer"
            >
              Add
            </button>
          </form>

          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {tasks.map((t) => (
              <div
                key={t.id}
                className="flex items-center justify-between p-3 rounded-xl border border-slate-205/30 dark:border-slate-850/40 bg-slate-50/50 dark:bg-slate-900/10 hover:bg-slate-100/50 dark:hover:bg-slate-900/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleTask(t.id)}
                    className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                      t.done ? "bg-brand-500 border-brand-500 text-white" : "border-slate-350 dark:border-slate-700 hover:border-brand-500"
                    }`}
                  >
                    {t.done && <Check className="w-3.5 h-3.5" />}
                  </button>
                  <span className={`text-xs font-semibold transition-all ${t.done ? "line-through text-slate-400" : "text-slate-805 dark:text-slate-200"}`}>
                    {t.text}
                  </span>
                </div>
                <button
                  onClick={() => deleteTask(t.id)}
                  className="p-1 rounded text-slate-400 hover:text-red-500 hover:bg-slate-200 dark:hover:bg-slate-800/80 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Live log aggregator */}
        <div className="p-5 rounded-2xl glass-card border-slate-200/40 dark:border-slate-800/40 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200/50 dark:border-slate-850/50">
            <div className="text-left">
              <h3 className="font-bold text-slate-950 dark:text-white">Active Logs Aggregator</h3>
              <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500">Live data mutations history logs</p>
            </div>
            <span className="text-[9px] uppercase font-black px-2 py-0.5 rounded bg-brand-500/10 text-brand-500 border border-brand-500/25">
              Aggregate
            </span>
          </div>

          <div className="space-y-3.5 max-h-64 overflow-y-auto pr-1">
            {logs.map((log) => {
              let badgeColor = "bg-blue-500/10 text-blue-500 border-blue-505/20";
              let label = "INFO";
              if (log.type === "warning") {
                badgeColor = "bg-amber-500/10 text-amber-500 border-amber-500/20";
                label = "WARN";
              } else if (log.type === "crud") {
                badgeColor = "bg-indigo-500/10 text-indigo-500 border-indigo-500/20";
                label = "MUTATE";
              } else if (log.type === "mongoose") {
                badgeColor = "bg-teal-500/10 text-teal-500 border-teal-500/20";
                label = "MUTATE";
              }

              return (
                <div
                  key={log.id}
                  className="p-3 rounded-xl border border-slate-205/30 dark:border-slate-850/40 bg-slate-50/50 dark:bg-slate-900/10 hover:bg-slate-100/50 dark:hover:bg-slate-900/30 transition-colors flex items-start gap-3 text-left"
                >
                  <span className={`text-[8.5px] font-black px-1.5 py-0.5 rounded border shrink-0 mt-0.5 ${badgeColor}`}>
                    {label}
                  </span>
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-250 truncate">
                        {log.type === "checkout" ? "Circulation" : log.type === "crud" || log.type === "mongoose" ? "Data Mutation" : "System Node"}
                      </span>
                      <span className="text-[9px] text-slate-450 font-mono shrink-0">{log.timestamp}</span>
                    </div>
                    <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 leading-relaxed break-words">{log.message}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

const X = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);
