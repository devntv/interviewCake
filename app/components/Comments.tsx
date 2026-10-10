"use client";

import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../lib/firebase";

type Comment = {
  id: string;
  pageId: string;
  name: string;
  content: string;
  createdAt: Timestamp | null;
};

const AVATAR_COLORS = [
  "#ef4444", "#f59e0b", "#10b981", "#3b82f6",
  "#8b5cf6", "#ec4899", "#06b6d4", "#f97316",
];
function colorFromName(name: string) {
  let sum = 0;
  for (const ch of name) sum += ch.charCodeAt(0);
  return AVATAR_COLORS[sum % AVATAR_COLORS.length];
}

export default function Comments({ pageId }: { pageId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = query(
      collection(db, "comments"),
      where("pageId", "==", pageId),
      orderBy("createdAt", "desc")
    );
    const unsub = onSnapshot(
      q,
      (snap) => {
        setComments(
          snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Comment, "id">) }))
        );
      },
      (err) => setError(err.message)
    );
    return () => unsub();
  }, [pageId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmedContent = content.trim();
    if (!trimmedContent) return;

    setSending(true);
    setError(null);
    try {
      await addDoc(collection(db, "comments"), {
        pageId,
        name: name.trim() || "Ẩn danh",
        content: trimmedContent.slice(0, 1000),
        createdAt: serverTimestamp(),
      });
      setContent("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gửi bình luận thất bại");
    } finally {
      setSending(false);
    }
  }

  function formatTime(ts: Timestamp | null) {
    if (!ts) return "";
    try {
      return ts.toDate().toLocaleString("vi-VN");
    } catch {
      return "";
    }
  }

  return (
    <section style={styles.wrap}>
      <div style={styles.header}>
        <h2 style={styles.title}>Bình luận</h2>
        <span style={styles.count}>{comments.length}</span>
      </div>

      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Tên của bạn (có thể bỏ trống)"
          maxLength={50}
          style={styles.input}
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Viết nhận xét của bạn..."
          rows={3}
          maxLength={1000}
          style={{ ...styles.input, resize: "vertical", lineHeight: 1.5 }}
        />
        <div style={styles.formFooter}>
          <span style={styles.counter}>{content.length}/1000</span>
          <button
            type="submit"
            disabled={sending || !content.trim()}
            style={{
              ...styles.btn,
              opacity: sending || !content.trim() ? 0.5 : 1,
              cursor: sending || !content.trim() ? "not-allowed" : "pointer",
            }}
          >
            {sending ? "Đang gửi..." : "Gửi bình luận"}
          </button>
        </div>
        {error && <p style={styles.error}>Lỗi: {error}</p>}
      </form>

      <div style={styles.list}>
        {comments.length === 0 && (
          <p style={styles.empty}>Chưa có bình luận nào. Hãy là người đầu tiên!</p>
        )}
        {comments.map((c) => (
          <div key={c.id} style={styles.item}>
            <div
              style={{ ...styles.avatar, background: colorFromName(c.name) }}
              aria-hidden
            >
              {c.name.charAt(0).toUpperCase()}
            </div>
            <div style={{ flex: 1 }}>
              <div style={styles.itemHead}>
                <strong style={styles.itemName}>{c.name}</strong>
                <span style={styles.itemTime}>{formatTime(c.createdAt)}</span>
              </div>
              <p style={styles.itemContent}>{c.content}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrap: {
    marginTop: 40,
    padding: 24,
    border: "1px solid #e5e7eb",
    borderRadius: 16,
    background: "#fff",
    boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
    fontFamily: "sans-serif",
  },
  header: { display: "flex", alignItems: "center", gap: 10, marginBottom: 16 },
  title: { margin: 0, fontSize: 20 },
  count: {
    background: "#eef2ff",
    color: "#4f46e5",
    fontSize: 13,
    fontWeight: 600,
    padding: "2px 10px",
    borderRadius: 999,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    marginBottom: 24,
  },
  input: {
    padding: "10px 14px",
    fontSize: 14,
    border: "1px solid #d1d5db",
    borderRadius: 10,
    fontFamily: "inherit",
    outline: "none",
  },
  formFooter: { display: "flex", alignItems: "center", justifyContent: "space-between" },
  counter: { fontSize: 12, color: "#9ca3af" },
  btn: {
    padding: "10px 20px",
    fontSize: 14,
    fontWeight: 600,
    border: "none",
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    color: "#fff",
    borderRadius: 10,
  },
  error: { color: "#dc2626", margin: 0, fontSize: 13 },
  list: { display: "flex", flexDirection: "column", gap: 14 },
  empty: { color: "#9ca3af", textAlign: "center", padding: "16px 0" },
  item: { display: "flex", gap: 12 },
  avatar: {
    flexShrink: 0,
    width: 40,
    height: 40,
    borderRadius: "50%",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700,
    fontSize: 16,
  },
  itemHead: { display: "flex", alignItems: "baseline", gap: 8, flexWrap: "wrap" },
  itemName: { fontSize: 14, color: "#111827" },
  itemTime: { color: "#9ca3af", fontSize: 12 },
  itemContent: { margin: "4px 0 0", whiteSpace: "pre-wrap", color: "#374151", fontSize: 14 },
};
