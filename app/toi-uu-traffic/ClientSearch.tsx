"use client";

import { useEffect, useMemo, useState } from "react";

type Item = {
  id: number;
  name: string;
  category: string;
  desc: string;
};

export default function ClientSearch() {
  const [data, setData] = useState<Item[]>([]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");


  useEffect(() => {
    fetch("/search-data.json")
      .then((res) => res.json())
      .then((json: Item[]) => {
        setData(json);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, []);


  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return data;
    return data.filter(
      (it) =>
        it.name.toLowerCase().includes(q) ||
        it.category.toLowerCase().includes(q) ||
        it.desc.toLowerCase().includes(q)
    );
  }, [data, query]);

  return (
    <div
      style={{
        marginTop: 12,
        border: "1px solid #e5e7eb",
        borderRadius: 8,
        padding: 16,
        background: "#fff",
      }}
    >
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Gõ để search (vd: image, cdn, render...)"
        style={{
          width: "100%",
          padding: "8px 12px",
          fontSize: 14,
          border: "1px solid #ccc",
          borderRadius: 6,
          marginBottom: 12,
        }}
      />

      {status === "loading" && <p style={{ color: "#555" }}>Đang tải dữ liệu...</p>}
      {status === "error" && (
        <p style={{ color: "#dc2626" }}>Không tải được /search-data.json</p>
      )}

      {status === "ready" && (
        <>
          <p style={{ color: "#555", fontSize: 13 }}>
            {results.length}/{data.length} kết quả (search ngay trên client, không
            gọi API)
          </p>
          <ul style={{ paddingLeft: 20, margin: 0 }}>
            {results.map((it) => (
              <li key={it.id} style={{ marginBottom: 6 }}>
                <strong>{it.name}</strong>{" "}
                <span style={{ color: "#6b7280", fontSize: 12 }}>
                  [{it.category}]
                </span>
                <br />
                <span style={{ fontSize: 13, color: "#374151" }}>{it.desc}</span>
              </li>
            ))}
            {results.length === 0 && (
              <li style={{ color: "#9ca3af" }}>Không có kết quả.</li>
            )}
          </ul>
        </>
      )}
    </div>
  );
}
