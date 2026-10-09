import { redirect } from "next/navigation";

// Trang gốc "/" tự chuyển hướng sang /rsc-demo làm trang mặc định.
export default function Home() {
  redirect("/rsc-demo");
}
