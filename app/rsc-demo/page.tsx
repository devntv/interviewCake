
import Comments from "../components/Comments";

export const dynamic = "force-dynamic";


const BUILD_TIME = new Date().toISOString();

async function getServerData() {
  // gia lap test fetch
  await new Promise((resolve) => setTimeout(resolve, 300));

  return {
    renderedAt: new Date().toISOString(),
    nodeVersion: process.version,
    secretComputed: `${(Math.random() * 1000).toFixed(2)}`,
    buildTime: BUILD_TIME,
  };
}

function getBaseUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return `http://localhost:${process.env.PORT ?? 3000}`;
}

async function getSamples() {
  const base = `${getBaseUrl()}/other`;
  try {
    const htmlRes = await fetch(base, { cache: "no-store" });
    const html = await htmlRes.text();


    const rscRes = await fetch(base, {
      cache: "no-store",
      headers: { RSC: "1" },
    });
    const rsc = await rscRes.text();

    const uiLines = rsc
      .split("\n")
      .filter((line) => line.includes('["$"'))
      .join("\n");
    const rscUi = uiLines || rsc;

    return {
      htmlContentType: htmlRes.headers.get("content-type") ?? "",
      rscContentType: rscRes.headers.get("content-type") ?? "",
      htmlSnippet: html.slice(0, 1500),
      rscSnippet: rscUi.slice(0, 3000),
    };
  } catch {
    return null;
  }
}

export default async function RscDemoPage() {
  const data = await getServerData();
  const samples = await getSamples();

  const boxStyle: React.CSSProperties = {
    background: "#1e1e1e",
    color: "#d4d4d4",
    padding: 16,
    borderRadius: 8,
    fontSize: 12,
    lineHeight: 1.5,
    overflowX: "auto",
    whiteSpace: "pre-wrap",
    wordBreak: "break-all",
  };

  const h2Style: React.CSSProperties = {
    fontSize: 18,
    marginTop: 0,
    marginBottom: 12,
    paddingBottom: 6,
    borderBottom: "2px solid #e5e7eb",
  };
  const cardStyle: React.CSSProperties = {
    marginTop: 20,
    border: "1px solid #e5e7eb",
    borderRadius: 12,
    padding: 20,
    background: "#fff",
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
  };

  return (
    <main style={{ fontFamily: "sans-serif", padding: 32, lineHeight: 1.6, maxWidth: 820, margin: "0 auto" }}>

      <h1 style={{ fontSize: 28, marginBottom: 8 }}>Demo React Server Component</h1>

      <p style={{ marginTop: 0 }}>
        <a
          href="https://nextjs.org/docs/13/app/building-your-application/rendering/server-components#how-are-server-components-rendered"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#2563eb", textDecoration: "underline" }}
        >
          How are Server Components rendered? (Next.js docs)
        </a>
      </p>

      <p>
        Em wrap up lại các câu trả lời trong buổi phỏng vấn để làm rõ hơn những câu còn thiếu sót.
      </p>

      <section style={cardStyle}>
        <h2 style={h2Style}>data server</h2>
        <ul>
          <li>
            <strong>date</strong> {data.renderedAt}
          </li>
          <li>
            <strong>Node version :</strong> {data.nodeVersion}
          </li>

          <li>
            <strong>Last build:</strong> {data.buildTime}
          </li>
        </ul>
        <p style={{ marginTop: 12 }}>
          source code at:
          <a
            href="https://github.com/devntv"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#2563eb", textDecoration: "underline", marginLeft: '2px' }}
          >
            https://github.com/devntv
          </a>

        </p>
      </section>

      {/* //jwt herer */}
      <section style={{ ...cardStyle, background: "#fffbea", borderColor: "#fde68a" }}>
        <h2 style={{ ...h2Style, borderBottomColor: "#fde68a" }}>về JWT</h2>
        <ul style={{ margin: 0, paddingLeft: 20, display: "flex", flexDirection: "column", gap: 10 }}>
          <li>
            JWT = <code>header.payload.signature</code>.  — secret
            key chỉ nằm ở server.
          </li>
          <li>
            payload rỗng <code>{"{}"}</code> vẫn hợp lệ: token thành{" "}
            <code>header.e30.signature</code> (<code>e30</code> là{" "}
            <code>{"{}"}</code> đã mã hóa).
          </li>
          <li>
            Theo như research chuẩn JWT không tự sinh payload khi nó rỗng hoặc không có claim nào; và chỉ thư viện (vd jsonwebtoken) mới
            tự thêm <code>iat</code> và chỉ iat, phần này em có được anh <strong>Nghi</strong> nói nó tự sinh gồm vài thứ trong buổi phỏng vấn mà theo em research thì payload rỗng sẽ không có ý nghĩa thực tế trong việc xác thực người dùng hoặc có thể em missmatch nghe không kỹ hay gì đó. và em rất cảm ơn anh <strong>Nghi</strong> đã giúp em tìm hiểu sâu hơn về phần này của JWT.

          </li>
          <li>
            Phần tại sao nó khó thu hồi mặc dù cũng gửi về client như session, vì nó stateless nên không được lưu ở phía server  = với không có
            nơi để đánh dấu token này đã hủy. Token tự chứng
            minh tính hợp lệ bằng chữ ký, server chỉ verify chứ
            không tra cứu danh sách. Muốn thu hồi được thì phải
            thêm state (blacklist, token version...). Cảm ơn anh <strong>Thuận</strong> đã giúp em tìm hiểu sâu hơn phần này ở phía dưới server
          </li>
        </ul>
      </section>

      <section style={cardStyle}>
        <h2 style={h2Style}>1. HTML tu server (trang đang chạy)</h2>
        <p style={{ color: "#555", fontSize: 14, marginTop: 0 }}>
          Content-Type: <code>{samples?.htmlContentType}</code>
        </p>
        <pre style={boxStyle}>
          {samples ? samples.htmlSnippet : "Không fetch được (server chưa sẵn sàng)."}
        </pre>
      </section>

      <section style={cardStyle}>
        <h2 style={h2Style}>2. RSC payload (trang đang chạy)</h2>
        <p style={{ color: "#555", fontSize: 14, marginTop: 0 }}>
          Content-Type: <code>{samples?.rscContentType}</code>
        </p>
        <pre style={boxStyle}>
          {samples ? samples.rscSnippet : "Không fetch được (server chưa sẵn sàng)."}
        </pre>
      </section>
      <section style={{ ...cardStyle, background: "#f5f3ff", borderColor: "#ddd6fe" }}>
        <h2 style={{ ...h2Style, borderBottomColor: "#ddd6fe" }}>nội dung đã trả lời cho anh Nghi</h2>
        <p style={{ margin: 0, color: "#4c1d95" }}>React server component được render thẳng phía server và trả về từ đó giúp seo tốt, cùng lúc đó trả cả RSC Payload cho react để nó dựng lại cây component gồm cây current và cây WIP, hydrate các Client Component (phần này có gửi js) nếu có và không trả JS về client giúp nhẹ bundle đúng theo link docs em gửi phía trên + các nguồn khác nhau, không trả lời được RSC có dạng là gì, sau khi tìm hiểu thì nó có dạng binary stream</p>
      </section>
      <section style={cardStyle}>
        <h2 style={h2Style}>What is the React Server Component Payload (RSC)?</h2>
        <p style={{ margin: 0, color: "#374151" }}>
          The RSC Payload is a compact binary representation of the rendered React Server Components tree. It&apos;s used by React on the client to update the browser&apos;s DOM. The RSC Payload contains:
        </p>
        <ul style={{ marginTop: 10, marginBottom: 0, paddingLeft: 20, color: "#374151" }}>
          <li>The rendered result of Server Components</li>
          <li>Placeholders for where Client Components should be rendered and references to their JavaScript files</li>
          <li>Any props passed from a Server Component to a Client Component</li>
        </ul>
      </section>

      <Comments pageId="rsc-demo" />
    </main>
  );
}
