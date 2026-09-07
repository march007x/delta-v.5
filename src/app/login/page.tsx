import type { Metadata } from "next";
import { LoginConsent } from "@/components/login/LoginConsent";

export const metadata: Metadata = {
  title: "เข้าสู่ระบบ",
  description: "เข้าสู่ระบบด้วย Google เพื่อบันทึกความก้าวหน้าการเรียน หรือเรียนต่อแบบไม่ผูกบัญชี",
};

/**
 * หน้า /login — ยังไม่ถูกเชื่อมจากเมนูหลัก เพราะปุ่ม Google ยังไม่มี Auth จริงอยู่ข้างหลัง
 * (ลำดับที่วางแผนไว้คือ Auth + บันทึกความก้าวหน้าจริงก่อน แล้วค่อยเปิดใช้จริง)
 * ตอนนี้เป็นภาพตัวอย่างของหน้าตาและนโยบายที่จะใช้จริงเมื่อต่อ Supabase Auth เสร็จ
 */
export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-16">
      <img
        src="/login-bg-720.webp"
        srcSet="/login-bg-480.webp 480w, /login-bg-720.webp 720w, /login-bg-900.webp 900w"
        sizes="100vw"
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full object-cover"
        style={{ objectPosition: "50% 30%" }}
      />
      <span
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(4,7,14,0.55) 0%, rgba(4,7,14,0.35) 40%, rgba(4,7,14,0.85) 100%)",
        }}
      />
      <div className="relative">
        <LoginConsent />
      </div>
    </div>
  );
}
