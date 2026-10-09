"use client";

import { useState } from "react";

function createInitial(): number[] {
  return Array.from({ length: 1000 }, (_, i) => i);
}

export default function AnhDien() {
  const [items, setItems] = useState<number[]>(createInitial);
  const [loading, setLoading] = useState<string | null>(null);

  function handleSort() {
    setLoading("sort");
    setTimeout(() => {
      // gia lap ham nay nặng, tốn timer chạy.
      const start = Date.now();
      while (Date.now() - start < 4000) {
        // vòng lặp rỗng để  giữ main thread bận gây ui đơ
      }
      setItems((prev) => [...prev].sort((a, b) => a - b));
      setLoading(null);
    }, 5000);
  }

  function handleShuffle() {
    setItems((prev) => {
      const arr = [...prev];
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    });
  }

  return (
    <div style={{ marginTop: 24 }}>
      <p style={{ color: "#555" }}>
        bấm<strong>Sort (5s)</strong>, rồi trong lúc chờ hãy bấm{" "}
        <strong>Shuffle (3s) và chờ hơn 5s để xem kết quả</strong>.
      </p>
      <div style={{ display: "flex", gap: 12, marginBottom: 16, alignItems: "center" }}>
        <button onClick={handleSort} style={btnStyle}>
          Sort (5s)
        </button>
        <button onClick={handleShuffle} style={btnStyle}>
          Shuffle
        </button>

        {loading && (
          <span style={{ color: "#dc2626", fontWeight: 600 }}>
            {loading === "sort" ? "sort (5s)" : "shuffle (3s)"}.....
          </span>
        )}
      </div>

      <h3>10 phần tử đầu</h3>
      <p style={{ fontFamily: "monospace" }}>
        [{items.slice(0, 10).join(", ")} ...]
      </p>

      <h3> 1000 phần tử</h3>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 4,
          maxHeight: 200,
          overflow: "auto",
          border: "1px solid #e5e7eb",
          borderRadius: 8,
          padding: 8,
        }}
      >
        {items.map((n, idx) => (
          <span
            key={idx}
            style={{ fontSize: 11, padding: "1px 4px", background: "#f3f4f6", borderRadius: 3 }}
          >
            {n}
          </span>
        ))}
      </div>
    </div>
  );
}

const btnStyle: React.CSSProperties = {
  padding: "8px 16px",
  fontSize: 14,
  cursor: "pointer",
  border: "1px solid #2563eb",
  background: "#2563eb",
  color: "#fff",
  borderRadius: 6,
};
