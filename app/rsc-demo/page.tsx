
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

  return (
    <main style={{ fontFamily: "sans-serif", padding: 32, lineHeight: 1.6 }}>
      <h1>test React Server Component</h1>

      <p style={{ color: 'burlywood' }}>
        react server component
        <a
          href="https://nextjs.org/docs/13/app/building-your-application/rendering/server-components#how-are-server-components-rendered"
          target="_blank"
          rel="noopener noreferrer"
        >
          How are Server Components rendered? (Next.js docs)
        </a>
      </p>

      <p>
        {'f12 va xem view page source -> trả html từ server + rsc payload (tab network) -> support seo tốt cho bot google '}
      </p>

      <section
        style={{
          border: "1px solid #ccc",
          borderRadius: 8,
          padding: 16,
          marginTop: 16,
          background: "#f6f6f6",
        }}
      >
        <h2>Dữ liệu lấy trên server</h2>
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
      </section>

      {/* //jwt herer */}
      <section
        style={{
          marginTop: 24,
          border: "1px solid #ddd",
          borderRadius: 8,
          padding: 16,
          background: "#fffbea",
        }}
      >
        <h2>Ghi chú nhanh về JWT</h2>
        <ul>
          <li>
            JWT = <code>header.payload.signature</code>. Phần thứ 3 là{" "}
            <strong>signature</strong> (chữ ký), KHÔNG phải secret key — secret
            key chỉ nằm ở server.
          </li>
          <li>
            Payload rỗng <code>{"{}"}</code> vẫn hợp lệ: token thành{" "}
            <code>header.e30.signature</code> (<code>e30</code> là{" "}
            <code>{"{}"}</code> đã mã hóa), KHÔNG phải{" "}
            <code>header..signature</code>.
          </li>
          <li>
            Chuẩn JWT không tự sinh claim nào; chỉ thư viện (vd jsonwebtoken) mới
            tự thêm <code>iat</code>.
          </li>
        </ul>
      </section>

      <section style={{ marginTop: 24 }}>
        <h2>1. HTML tu server </h2>
        <p style={{ color: "#555", fontSize: 14 }}>
          Content-Type: <code>{samples?.htmlContentType}</code>
        </p>
        <pre style={boxStyle}>
          {samples ? samples.htmlSnippet : "Không fetch được (server chưa sẵn sàng)."}
        </pre>
      </section>

      <section style={{ marginTop: 24 }}>
        <h2>2. RSC payload</h2>
        <p style={{ color: "#555", fontSize: 14 }}>
          Content-Type: <code>{samples?.rscContentType}</code>
        </p>
        <pre style={boxStyle}>
          {samples ? samples.rscSnippet : "Không fetch được (server chưa sẵn sàng)."}
        </pre>
      </section>
      <div style={{ color: 'blueviolet', marginTop: 20 }}>em trả lời cho anh Nghi: React server component được render thẳng phía server và trả về từ đó giúp seo tốt, cùng lúc đó trả cả RSC Payload cho react để nó dựng lại cây component gồm cây current và cây WIP, hydrate các Client Component (phần này có gửi js) nếu có và không trả JS về client giúp nhẹ bundle đúng theo link docs em gửi phía trên + các nguồn khác nhau, không trả lời được RSC có dạng là gì, sau khi tìm hiểu thì nó có dạng binary stream</div>
      <p style={{ marginTop: 20 }}>What is the React Server Component Payload (RSC)?

        The RSC Payload is a compact binary representation of the rendered React Server Components tree. It's used by React on the client to update the browser's DOM. The RSC Payload contains:

        The rendered result of Server Components
        Placeholders for where Client Components should be rendered and references to their JavaScript files
        Any props passed from a Server Component to a Client Component</p>
    </main>
  );
}
