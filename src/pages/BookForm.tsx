import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import type { BookCreateDto, BookUpdateDto, BookDto } from "../types";
import { toast } from "react-toastify";

const BookForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const editMode = !!id;

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [publicationDate, setPublicationDate] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const nav = useNavigate();

  useEffect(() => {
    if (!editMode) return;

    setLoading(true);
    (async () => {
      try {
        const r = await api.get(`/api/books/${id}`);
        const b: BookDto = r.data;
        setTitle(b.title);
        setAuthor(b.author);
        setPublicationDate(b.publicationDate ? b.publicationDate.split("T")[0] : "");
        setQuantity(b.quantity);
      } catch (err: any) {
        setError(err?.response?.data?.message || "Failed to load book");
      } finally {
        setLoading(false);
      }
    })();
  }, [editMode, id]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim() || !author.trim()) {
      setError("Title and Author are required.");
      return;
    }

    try {
      setSaving(true);
      const payload: BookCreateDto | BookUpdateDto = {
        title: title.trim(),
        author: author.trim(),
        publicationDate: publicationDate || null,
        quantity,
      };

      if (editMode) {
        await api.put(`/api/books/${id}`, payload);
        toast.success(" Book updated successfully!");
      } else {
        await api.post("/api/books", payload);
        toast.success(" Book added successfully!");
      }

      setTimeout(() => nav("/books"), 1500); // give user time to see toast
    } catch (err: any) {
      toast.error(err?.response?.data?.message || " Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="container py-4">Loading book...</div>;
  }

  return (
    <div className="container py-4" style={{ maxWidth: "600px" }}>
      <h2 className="fw-bold mb-4">
        {editMode ? "✏️ Edit Book" : "➕ Add New Book"}
      </h2>

      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          {error}
          <button
            type="button"
            className="btn-close"
            onClick={() => setError(null)}
          ></button>
        </div>
      )}

      <form onSubmit={onSubmit} className="card shadow p-4">
        <div className="mb-3">
          <label className="form-label fw-semibold">Title</label>
          <input
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Book title"
            required
            autoFocus
          />
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">Author</label>
          <input
            className="form-control"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Book author"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">Publication Date</label>
          <input
            className="form-control"
            type="date"
            value={publicationDate}
            onChange={(e) => setPublicationDate(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">Quantity</label>
          <input
            className="form-control"
            type="number"
            min={0}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
          />
        </div>

        <div className="d-flex justify-content-between">
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => nav("/books")}
            disabled={saving}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={saving}
          >
            {saving ? "Saving..." : editMode ? "Update Book" : "Add Book"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookForm;
