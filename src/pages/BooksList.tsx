import React, { useEffect, useState } from "react";
import api from "../api/axios";
import type { BookDto } from "../types";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import dayjs from "dayjs";
import { FaEdit, FaTrash, FaBook, FaSearch, FaUndo } from "react-icons/fa";

const BooksList: React.FC = () => {
  const [items, setItems] = useState<BookDto[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [desc, setDesc] = useState(false);
  const { isAuthenticated, isAdmin } = useAuth();
  const nav = useNavigate();

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [borrowingIdInput, setBorrowingIdInput] = useState("");
  const [selectedBook, setSelectedBook] = useState<BookDto | null>(null);

  const load = async () => {
    try {
      const res = await api.get("/api/books", {
        params: { page, pageSize, search: search || undefined, sortBy: sortBy || undefined, desc },
      });
      const { items: it, total: t } = res.data;
      setItems(it);
      setTotal(t ?? 0);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { load(); }, [page, pageSize, search, sortBy, desc]);

  const onDelete = async (id: number) => {
    if (!window.confirm("Delete this book?")) return;
    try {
      await api.delete(`/api/books/${id}`);
      await load();
    } catch (err: any) {
      alert(err?.response?.data?.message || "Delete failed");
    }
  };

  const onBorrow = async (id: number) => {
    try {
      const r = await api.post(`/api/books/${id}/borrow`);
      alert(`${r.data?.message ?? "Borrowed"}. Borrowing ID: ${r.data?.borrowingId ?? "N/A"}`);
      await load();
    } catch (err: any) {
      alert(err?.response?.data?.message || "Borrow failed");
    }
  };

  const onReturn = async (borrowingId: number) => {
    try {
      const r = await api.post(`/api/books/${borrowingId}/return`);
      alert(`${r.data?.message ?? "Returned"}.`);
      setShowModal(false);
      setBorrowingIdInput("");
      await load();
    } catch (err: any) {
      alert(err?.response?.data?.message || "Return failed");
    }
  };

  const handleSort = (field: string) => {
    setSortBy(field);
    setDesc(sortBy === field ? !desc : false);
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="fw-bold">📚 Books</h2>
        {isAuthenticated && (
          <button className="btn btn-success" onClick={() => nav("/books/create")}>
            + Add Book
          </button>
        )}
      </div>

      <div className="input-group mb-3">
        <input
          className="form-control"
          placeholder="Search by title or author..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          className="btn btn-primary"
          onClick={() => { setPage(1); load(); }}
        >
          <FaSearch /> Search
        </button>
      </div>

      <div className="table-responsive shadow-sm rounded">
        <table className="table table-striped table-hover align-middle">
          <thead className="table-dark">
            <tr>
              <th role="button" onClick={() => handleSort("title")}>
                Title {sortBy === "title" && (desc ? "↓" : "↑")}
              </th>
              <th role="button" onClick={() => handleSort("author")}>
                Author {sortBy === "author" && (desc ? "↓" : "↑")}
              </th>
              <th role="button" onClick={() => handleSort("publicationdate")}>
                Published {sortBy === "publicationdate" && (desc ? "↓" : "↑")}
              </th>
              <th>Quantity</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((b) => (
              <tr key={b.id}>
                <td>
                  <Link to={`/books/${b.id}`} className="text-decoration-none">{b.title}</Link>
                </td>
                <td>{b.author}</td>
                <td>{b.publicationDate ? dayjs(b.publicationDate).format("YYYY-MM-DD") : "-"}</td>
                <td>{b.quantity}</td>
                <td className="text-center">
                  {isAuthenticated && (
                    <button className="btn btn-sm btn-warning me-1" onClick={() => nav(`/books/${b.id}/edit`)}>
                      <FaEdit />
                    </button>
                  )}
                  {isAdmin && (
                    <button className="btn btn-sm btn-danger me-1" onClick={() => onDelete(b.id)}>
                      <FaTrash />
                    </button>
                  )}
                  {isAuthenticated && (
                    <button className="btn btn-sm btn-info text-white me-1" onClick={() => onBorrow(b.id)} disabled={b.quantity <= 0}>
                      <FaBook /> Borrow
                    </button>
                  )}
                  {isAuthenticated && (
                    <button
                      className="btn btn-sm btn-success"
                      onClick={() => {
                        setSelectedBook(b);
                        setShowModal(true);
                      }}
                    >
                      <FaUndo /> Return
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center text-muted py-3">No books found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="d-flex justify-content-between align-items-center mt-3">
        <button className="btn btn-outline-secondary" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
          Prev
        </button>
        <span>Page {page} — {total} total</span>
        <button className="btn btn-outline-secondary" disabled={items.length < pageSize} onClick={() => setPage((p) => p + 1)}>
          Next
        </button>
      </div>

      {/* Return Modal */}
      {showModal && (
        <div className="modal fade show" style={{ display: "block" }} tabIndex={-1}>
          <div className="modal-dialog">
            <div className="modal-content shadow-lg">
              <div className="modal-header bg-success text-white">
                <h5 className="modal-title">Return Book</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
             <div className="modal-body">
  <p>
    Enter the Borrowing ID for <strong>{selectedBook?.title}</strong>:
  </p>
  <input
    type="number"
    className="form-control"
    placeholder="Borrowing ID"
    value={borrowingIdInput}
    onChange={(e) => setBorrowingIdInput(e.target.value)}
    min={1} 
  />
  {borrowingIdInput !== "" && Number(borrowingIdInput) <= 0 && (
    <small className="text-danger">Borrowing ID must be greater than 0.</small>
  )}
</div>

              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button
                  className="btn btn-success"
                  onClick={() => {
                    if (!borrowingIdInput.trim()) {
                      alert("Please enter a Borrowing ID.");
                      return;
                    }
                    onReturn(Number(borrowingIdInput));
                  }}
                >
                  Confirm Return
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BooksList;
