import AnhDien from "./AnhDien";
import BlockingDemo from "./BlockingDemo";

export default async function OtherPage() {
  const now = new Date().toISOString();

  return (
    <main style={{ fontFamily: "sans-serif", padding: 32, lineHeight: 1.6 }}>
      <h1>Demo </h1>

      <hr style={{ margin: "24px 0" }} />




      <div style={{ color: 'red', fontSize: 30 }}>Demo 1</div>
      <AnhDien />
      <div style={explainStyle}>
        <br />
        setTimeout giao việc đếm giờ cho Web APIs nên khi bấm Sort vì e đang giả lập chậm bằng setTimeout, main thread
        KHÔNG bị chiếm trong lúc chờ. Bấm Shuffle giữa chừng vẫn chạy. Main
        thread chỉ bị khóa khi callback run sau 5s và vòng lặp nặng bên trong
        bắt đầu chạy → lúc đó UI mới đơ.
      </div>
      <div style={{ color: 'blueviolet' }}>{'Ban đầu nhìn code anh Diển viết trên bảng nên em chạy code thử trong đầu với setTimeout để giả lập cho cái hàm sort chậm,em có trả lời là nếu lần đầu bấm sort 5s sau đó chờ lâu 3s thì bấm shuffle thì UI sẽ hiện ngay dữ liệu của shuffle sau đó nháy về sort -> giống kết quả mà e trả lời  của demo trên '}</div>


      <div style={{ color: 'red', fontSize: 30 }}>Demo 2</div>
      <BlockingDemo />
      <div style={explainStyle}>

        <br />
        Không dùng setTimeout, vòng lặp sort chạy thẳng trên main thread → UI đơ
        NGAY từ lúc bấm Sort. Loading cũng không kịp hiện, và click Shuffle giữa
        chừng bị xếp hàng, chỉ chạy sau khi sort xong.
      </div>

      <div style={{ color: 'blueviolet' }}>{'sau khi về nhà thì em có code lại thử các trường hợp khác nhau thì em nghĩ thứ anh Diển đang hỏi mong muốn là chỗ này, nếu ko dùng setTimeout để mô tả cho nó chậm thì e phải tìm tìm cách làm cho nó thật chậm = bubble sort, nên từ đây mới hiểu ý'}</div>

    </main>
  );
}

const explainStyle: React.CSSProperties = {
  marginTop: 12,
  marginBottom: 24,
  padding: "10px 14px",
  background: "#eff6ff",
  border: "1px solid #bfdbfe",
  borderRadius: 8,
  fontSize: 14,
  color: "#1e3a8a",
  lineHeight: 1.6,
};
