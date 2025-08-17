    import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import type { BookDto } from "../types";
import dayjs from "dayjs";

const BookDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [book, setBook] = useState<BookDto | null>(null);
  const nav = useNavigate();

  useEffect(() => {
    (async () => {
      if (!id) return;
      try {
        const r = await api.get(`/api/books/${id}`);
        setBook(r.data);
      } catch (err) {
        console.error(err);
      }
    })();
  }, [id]);

  if (!book) return <div>Loading...</div>;

  return (
    <div>
      <h2>{book.title}</h2>
      <p><strong>Author:</strong> {book.author}</p>
      <p><strong>Published:</strong> {book.publicationDate ? dayjs(book.publicationDate).format("YYYY-MM-DD") : "-"}</p>
      <p><strong>Quantity:</strong> {book.quantity}</p>
      <button onClick={() => nav("/books")}>Back</button>
    </div>
  );
};

export default BookDetails;
