"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Menu điều hướng dùng chung. Thêm page mới chỉ cần thêm 1 phần tử vào mảng links.
const links = [
  { href: "/rsc-demo", label: "Demo anh Nghi" },
  { href: "/other", label: "Demo anh Diển" },
  { href: "/toi-uu-traffic", label: "Tối ưu traffic" },
  { href: "/cam-on", label: "Lời cảm ơn" },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <header style={styles.header}>
      <div style={styles.inner}>
        <nav style={styles.nav}>
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="nav-link"
                style={{
                  ...styles.link,
                  ...(active ? styles.linkActive : {}),
                }}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

const styles: Record<string, React.CSSProperties> = {
  header: {
    position: "sticky",
    top: 0,
    zIndex: 50,
    borderBottom: "1px solid #e5e7eb",
    background: "rgba(255,255,255,0.8)",
    backdropFilter: "saturate(180%) blur(8px)",
    WebkitBackdropFilter: "saturate(180%) blur(8px)",
    fontFamily: "sans-serif",
  },
  inner: {
    maxWidth: 1100,
    margin: "0 auto",
    height: 56,
    padding: "0 20px",
    display: "flex",
    alignItems: "center",
    gap: 24,
  },
  nav: { display: "flex", alignItems: "center", gap: 4 },
  link: {
    textDecoration: "none",
    color: "#64748b",
    fontSize: 14,
    fontWeight: 500,
    padding: "6px 12px",
    borderRadius: 8,
    transition: "all 0.15s ease",
  },
  linkActive: {
    color: "#0f172a",
    background: "#f1f5f9",
    fontWeight: 600,
  },
};
