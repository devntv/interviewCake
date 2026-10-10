import Comments from "../components/Comments";
import AnhDien from "./AnhDien";
import BlockingDemo from "./BlockingDemo";

export default async function OtherPage() {
  const now = new Date().toISOString();

  return (
    <main style={{ fontFamily: "sans-serif", padding: 32, lineHeight: 1.6, maxWidth: 820, margin: "0 auto" }}>

      <h1 style={{ fontSize: 28, marginBottom: 20 }}>Demo blocking main thread</h1>

      <h2 style={demoHeading}>Demo 1</h2>
      <AnhDien />
      <div style={explainStyle}>
        setTimeout giao việc đếm giờ cho Web APIs nên khi bấm Sort vì e đang giả lập chậm bằng setTimeout, main thread
        KHÔNG bị chiếm trong lúc chờ. Bấm Shuffle giữa chừng vẫn chạy. Main
        thread chỉ bị khóa khi callback run sau 5s và vòng lặp nặng bên trong
        bắt đầu chạy → lúc đó UI mới đơ.
      </div>
      <div style={noteStyle}>{'Ban đầu nhìn code anh Diển viết trên bảng nên em chạy code thử trong đầu với setTimeout để giả lập cho cái hàm sort chậm,em có trả lời là nếu lần đầu bấm sort 5s sau đó chờ lâu 3s thì bấm shuffle thì UI sẽ hiện ngay dữ liệu của shuffle sau đó nháy về sort -> giống kết quả mà e trả lời  của demo trên '}</div>

      <h2 style={{ ...demoHeading, marginTop: 36 }}>Demo 2</h2>
      <BlockingDemo />
      <div style={explainStyle}>
        Không dùng setTimeout, vòng lặp sort chạy thẳng trên main thread → UI đơ
        NGAY từ lúc bấm Sort. Loading cũng không kịp hiện, và click Shuffle giữa
        chừng bị xếp hàng, chỉ chạy sau khi sort xong.
      </div>

      <div style={noteStyle}>{'sau khi về nhà thì em có code lại thử các trường hợp khác nhau thì em nghĩ thứ anh Diển đang hỏi mong muốn là chỗ này, nếu ko dùng setTimeout để mô tả cho nó chậm thì e phải tìm tìm cách làm cho nó thật chậm = bubble sort, nên từ đây mới hiểu ý'}</div>

      <Comments pageId="other" />
    </main>
  );
}

const demoHeading: React.CSSProperties = {
  fontSize: 20,
  marginTop: 0,
  marginBottom: 12,
  paddingBottom: 6,
  borderBottom: "2px solid #e5e7eb",
};

const noteStyle: React.CSSProperties = {
  marginTop: 12,
  marginBottom: 24,
  padding: "12px 16px",
  background: "#f5f3ff",
  border: "1px solid #ddd6fe",
  borderRadius: 10,
  fontSize: 14,
  color: "#4c1d95",
  lineHeight: 1.6,
};

const explainStyle: React.CSSProperties = {
  marginTop: 12,
  marginBottom: 24,
  padding: "12px 16px",
  background: "#eff6ff",
  border: "1px solid #bfdbfe",
  borderRadius: 10,
  fontSize: 14,
  color: "#1e3a8a",
  lineHeight: 1.6,
};
