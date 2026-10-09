import type { Metadata } from "next";
import ClientSearch from "./ClientSearch";

export const metadata: Metadata = {
  title: "Tối ưu traffic cho 1 triệu user — Next.js",
  description:
    "Các kỹ thuật tối ưu traffic phía Next.js/frontend để chịu 1 triệu user như Cake đồng thời mà không đụng tới backend.",
};


const sections: {
  title: string;
  intro: string;
  items: { name: string; desc: string }[];
}[] = [
    {
      title: "1. Render tĩnh & cache ở tầng CDN (quan trọng nhất)",
      intro:
        "Mục tiêu: biến mỗi request thành một file tĩnh phục vụ từ CDN, không chạm server. 1 triệu user chỉ còn là 1 triệu lượt tải file từ edge.",
      items: [
        {
          name: "SSG (Static Site Generation)",
          desc: "Dùng generateStaticParams + render tĩnh lúc build. Trang trở thành HTML tĩnh, CDN phục vụ trực tiếp — gần như không giới hạn concurrency.",
        },
        {
          name: "ISR (Incremental Static Regeneration)",
          desc: "export const revalidate = N. Trang tĩnh tự làm mới sau N giây, vẫn phục vụ từ cache. Nội dung thay đổi theo thời gian mà không cần build lại toàn bộ.",
        }
      ],
    },
    {
      title: "2. Giảm kích thước & số lượng dữ liệu truyền đi",
      intro:
        "Mỗi KB nhân với 1 triệu user là băng thông khổng lồ. Cắt giảm payload là cắt giảm traffic trực tiếp.",
      items: [
        {
          name: "React Server Components",
          desc: "Đẩy logic & thư viện sang server, không gửi JS của Server Component xuống client → bundle nhẹ hơn hẳn.",
        },
        {
          name: "Code splitting / dynamic import",
          desc: "next/dynamic để tải component nặng theo nhu cầu, không nhồi hết vào bundle đầu tiên.",
        },
        {
          name: "Tree-shaking & phân tích bundle",
          desc: "Loại bỏ code chết, import đúng (named import), dùng @next/bundle-analyzer để tìm thư viện phình to.",
        },
        {
          name: "Nén Brotli/Gzip",
          desc: "Bật nén cho HTML/JS/CSS. Thường giảm 60-80% dung lượng truyền.",
        },
      ],
    },
    {
      title: "3. Tối ưu ảnh & tài nguyên nặng",
      intro:
        "Ảnh thường chiếm phần lớn băng thông. Tối ưu ảnh là đòn bẩy traffic lớn nhất sau cache.",
      items: [
        {
          name: "next/image",
          desc: "Tự resize, chuyển WebP/AVIF, lazy-load, phục vụ đúng kích thước theo thiết bị. Giảm mạnh dung lượng ảnh.",
        },
        {
          name: "Serve tài nguyên tĩnh từ CDN",
          desc: "Ảnh, font, video đặt sau CDN với cache dài hạn (immutable). Không để chúng đi qua server app.",
        },
        {
          name: "Lazy-load & preconnect",
          desc: "loading=lazy cho ảnh dưới màn hình; preconnect/dns-prefetch tới domain tài nguyên để giảm độ trễ.",
        },
      ],
    },
    {
      title: "4. Giảm số request lặp lại từ cùng user",
      intro:
        "1 user có thể tạo nhiều request. Tận dụng cache trình duyệt để lần sau không tải lại.",
      items: [
        {
          name: "Static assets hashing + immutable cache",
          desc: "Next.js đã đánh hash file trong /_next/static. Đặt Cache-Control: immutable, max-age=1 năm — user quay lại không tải lại JS/CSS.",
        },
        {
          name: "Prefetch có kiểm soát",
          desc: "next/link tự prefetch route khi link vào viewport. Tốt cho UX nhưng với 1 triệu user cần cân nhắc tắt bớt (prefetch={false}) để không nhân traffic.",
        },
        {
          name: "Streaming / Suspense",
          desc: "Chia nhỏ trang bằng Suspense + loading.tsx để gửi HTML dần. User thấy nội dung sớm, giảm cảm giác chờ và request dồn cục.",
        },
      ],
    },
    {
      title: "5. Hạ tải & chống dồn cục (surge)",
      intro:
        "Khi 1 triệu user vào CÙNG LÚC, vấn đề là đỉnh tức thời. Cần làm phẳng và chặn traffic thừa ở rìa.",
      items: [
        {
          name: "Edge Middleware / Edge Functions",
          desc: "Xử lý A/B, redirect, geo... ngay tại edge, không dồn về origin. Phản hồi nhanh và phân tán theo khu vực.",
        },
        {
          name: "Rate limiting ở edge/CDN",
          desc: "Chặn bot và request bất thường ngay tại CDN trước khi chạm app.",
        },
        {
          name: "Static fallback khi quá tải",
          desc: "Có trang tĩnh/trang chờ phục vụ từ CDN để không sập hoàn toàn khi đỉnh traffic vượt dự tính.",
        },
      ],
    },
  ];

const takeaway =
  "Chốt lại: với 1 triệu user đồng thời, nguyên tắc số 1 là ĐỪNG để traffic chạm server — biến trang thành tĩnh (SSG/ISR), phục vụ từ CDN edge (Phần này em có trả lời trong các trường hợp em dùng là SSG và ISR + WebHook nếu data thay đổi bên thứ 3, user đầu tiên vô trang tốn request, từ user 2 đến 99999 thì đã cache sẵn ở CDN). phần 6 cũng quan trọng - em cũng đã trả lời và vừa tìm ra keyword cho nó có tên là client-side search.Phần lớn các mục 3 4 5 Nextjs đã xử lý sẵn và hỗ trợ, ai dùng Nextjs cũng biết nó là gì, mục 2 là điều em nghỉ ai làm FE cũng biết làm. nén và tối ưu ảnh để giảm từng KB, và tận dụng cache trình duyệt để không tải lại. Server chỉ nên xử lý phần thực sự động.";


const takeaway2 = "Các mục em đã trình bay như ÁWS load balancer, sticky-session, wating-room, queue, không thuộc FE, cái này FE cần phải biết. Traffic các trang lớn như shopee xử lý 1 triệu user đa số nằm ở BE server"
export default function ToiUuTrafficPage() {
  return (
    <main
      style={{
        fontFamily: "sans-serif",
        padding: 32,
        lineHeight: 1.6,
        maxWidth: 820,
        margin: "0 auto",
      }}
    >
      <h1>Tối ưu traffic cho 1 triệu user đồng thời với Next.js</h1>
      <p>Nội dung từ nhiều nguồn + AI</p>
      <p style={{ color: "#555" }}>
        Các kỹ thuật tập trung hoàn toàn ở phía Next.js / frontend /
        hạ tầng phân phối — <strong>không đụng tới backend</strong>.
      </p>

      <section
        style={{
          marginTop: 32,
          padding: "14px 18px",
          background: "#ecfdf5",
          border: "1px solid #a7f3d0",
          borderRadius: 8,
        }}
      >
        <strong>Kết luận</strong>
        <div style={{ margin: "6px 0 0" }}>
          {takeaway
            .split(".")
            .map((s) => s.trim())
            .filter(Boolean)
            .map((cau, i) => (
              <p key={i} style={{ margin: "0 0 6px" }}>
                {cau}.
              </p>
            ))}
        </div>
      </section>

      <section
        style={{
          marginTop: 32,
          padding: "14px 18px",
          background: "#ecfdf5",
          border: "1px solid #a7f3d0",
          borderRadius: 8,
        }}
      >
        <strong>Kết luận</strong>
        <div style={{ margin: "6px 0 0" }}>
          {takeaway2
            .split(".")
            .map((s) => s.trim())
            .filter(Boolean)
            .map((cau, i) => (
              <p key={i} style={{ margin: "0 0 6px" }}>
                {cau}.
              </p>
            ))}
        </div>
      </section>

      {sections.map((sec) => (
        <section key={sec.title} style={{ marginTop: 28 }}>
          <h2 style={{ borderBottom: "2px solid #e5e7eb", paddingBottom: 6 }}>
            {sec.title}
          </h2>
          <p style={{ color: "#555", fontStyle: "italic" }}>{sec.intro}</p>
          <ul style={{ paddingLeft: 20 }}>
            {sec.items.map((it) => (
              <li key={it.name} style={{ marginBottom: 8 }}>
                <strong>{it.name}:</strong> {it.desc}
              </li>
            ))}
          </ul>
        </section>
      ))}

      <section style={{ marginTop: 28 }}>
        <h2 style={{ borderBottom: "2px solid #e5e7eb", paddingBottom: 6 }}>
          6. Build JSON tĩnh & search full phía client (quan trọng)
        </h2>
        <p style={{ color: "#555", fontStyle: "italic" }}>
          Thay vì mỗi lần gõ tìm kiếm lại gọi API về server, ta build sẵn toàn bộ
          dữ liệu thành một file JSON tĩnh. Client tải file đó một lần (qua CDN,
          không chạm backend), rồi search/filter hoàn toàn trong bộ nhớ trình
          duyệt.
        </p>
        <ul style={{ paddingLeft: 20 }}>
          <li style={{ marginBottom: 8 }}>
            <strong>Không tạo traffic search về server:</strong> 1 triệu user gõ
            tìm kiếm cũng không sinh request API — mọi thao tác diễn ra ở client.
          </li>
          <li style={{ marginBottom: 8 }}>
            <strong>File JSON được CDN cache:</strong> đặt trong /public hoặc
            build-time, phục vụ như asset tĩnh với cache dài hạn → origin gần như
            không bị tải.
          </li>
          <li style={{ marginBottom: 8 }}>
            <strong>Tải một lần, dùng mãi:</strong> sau lần fetch đầu, search tức
            thì, không độ trễ mạng.
          </li>
          <li style={{ marginBottom: 8 }}>
            <strong>Hợp khi:</strong> dữ liệu không quá lớn (vài trăm KB tới vài
            MB), ít thay đổi (danh mục, sản phẩm, bài viết, địa danh...). Dữ liệu
            lớn/đổi liên tục thì không phù hợp.
          </li>
          <li style={{ marginBottom: 8 }}>
            <strong>Nâng cao:</strong> với bộ dữ liệu lớn hơn, dùng index search
            phía client (Fuse.js, FlexSearch, Lunr) hoặc chia nhỏ JSON + lazy
            load từng phần.
          </li>
        </ul>

        <h3 style={{ marginTop: 16 }}>Demo: search thật từ /search-data.json</h3>
        <ClientSearch />
      </section>


    </main>
  );
}
