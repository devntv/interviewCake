import Link from "next/link";

// Menu điều hướng dùng chung cho mọi trang.
// Thêm page mới chỉ cần thêm 1 phần tử vào mảng links bên dưới.
const links = [
  { href: "/rsc-demo", label: "RSC Demo anh Nghi" },
  { href: "/other", label: "Demo anh Diển" },
  { href: "/toi-uu-traffic", label: "Tối ưu traffic" },
];

export default function Nav() {
  return (
    <nav
      style={{
        display: "flex",
        gap: 16,
        padding: "12px 32px",
        borderBottom: "1px solid #e5e7eb",
        background: "#fafafa",
        fontFamily: "sans-serif",
      }}
    >
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          style={{ textDecoration: "none", color: "#2563eb", fontWeight: 500 }}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
