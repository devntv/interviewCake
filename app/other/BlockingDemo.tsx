"use client";

import { useState } from "react";

function createInitial(): number[] {
  return Array.from({ length: 1000 }, (_, i) => i);
}

// render ngau nhien
function shuffleArr(src: number[]): number[] {
  const arr = [...src];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
// dung bubble sort để lâu thời gian chờ
function bubbleSort(src: number[]): number[] {
  const arr = [...src];
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length - 1 - i; j++) {
      if (arr[j] > arr[j + 1]) {
        const tmp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = tmp;
      }
    }
  }
  return arr;
  //https://stackoverflow.com/questions/64592714/react-js-bubble-sor
}

function sortForDuration(data: number[], timer: number): number[] {
  const start = Date.now();
  let result = bubbleSort(data);
  while (Date.now() - start < timer) {
    result = bubbleSort(shuffleArr(data));
  }
  return bubbleSort(data);
}


function shuffleForDuration(data: number[]): number[] {
  return shuffleArr(data);
}

export default function BlockingDemo() {
  const [items, setItems] = useState<number[]>(createInitial);
  const [loading, setLoading] = useState<string | null>(null);

  function handleSort() {
    setLoading("sort");

    const sorted = sortForDuration(items, 5000);
    setItems(sorted);
    setLoading(null);
  }

  function handleShuffle() {
    setLoading("shuffle");
    const shuffled = shuffleForDuration(items);
    setItems(shuffled);
    setLoading(null);
  }

  return (
    <div style={{ marginTop: 24 }}>
      <p style={{ color: "#555" }}>
        bấm<strong>Sort (5s)</strong>, rồi trong lúc chờ hãy bấm{" "}
        <strong>Shuffle (3s) và chờ hơn 5s để xem kết quả.</strong>.
      </p>
      <div style={{ display: "flex", gap: 12, marginBottom: 16, alignItems: "center" }}>
        <button onClick={handleSort} style={btnStyle}>
          Sort
        </button>
        <button onClick={handleShuffle} style={btnStyle}>
          Shuffle
        </button>

        {loading && (
          <span style={{ color: "#dc2626", fontWeight: 600 }}>
            ⏳ Đang {loading === "sort" ? "sort" : "shuffle"}...
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

const tlRow: React.CSSProperties = {
  display: "flex",
  gap: 12,
  padding: "10px 12px",
  border: "1px solid #e5e7eb",
  borderRadius: 8,
  background: "#fafafa",
  fontSize: 14,
};

const tlTime: React.CSSProperties = {
  flexShrink: 0,
  width: 70,
  fontWeight: 700,
  color: "#111827",
  fontFamily: "monospace",
};
