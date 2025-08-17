import React, { useEffect, useState } from "react";
import api from "../api/axios";

type Borrow = { id: number; bookId: number; bookTitle: string; borrowedAt: string; returnedAt?: string | null };

const MyBorrowings: React.FC = () => {
  const [items, setItems] = useState<Borrow[]>([]);
  useEffect(() => {
    (async () => {
      const r = await api.get("/api/borrowings/my");
      setItems(r.data);
    })();
  }, []);
  const onReturn = async (id: number) => {
    await api.post(`/api/books/${id}/return`); // adjust if api path differs
    // reload
    const r = await api.get("/api/borrowings/my");
    setItems(r.data);
  };
  return (
    <div>
      <h2>My Borrowings</h2>
      <ul>
        {items.map((b) => (
          <li key={b.id}>
            {b.bookTitle} — borrowed {new Date(b.borrowedAt).toLocaleString()} — returned: {b.returnedAt ?? "No"}
            {!b.returnedAt && <button onClick={() => onReturn(b.id)}>Return</button>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyBorrowings;
