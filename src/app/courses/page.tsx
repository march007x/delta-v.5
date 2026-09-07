import type { Metadata } from "next";
import {
  getChapters,
  getCourses,
  getLessons,
  getPublishedLessons,
  getTopics,
  isTopicReady,
} from "@/lib/repo/content";
import { getPracticeIndex } from "@/lib/repo/practice";
import { LEVEL_LABEL } from "@/content/schema";
import { CourseGrid, type CourseCard } from "@/components/courses/CourseGrid";
import { SubjectShowcase } from "@/components/courses/SubjectShowcase";

export const metadata: Metadata = {
  title: "คอร์สเรียน",
  description: "บทเรียนทั้งหมดตั้งแต่ ม.4 ถึง ม.6 พร้อมสถานะว่าบทไหนเปิดให้เรียนแล้ว",
};

export default function CoursesPage() {
  const courses = getCourses();
  const questionsBySlug = new Map(getPracticeIndex().map((p) => [p.slug, p.count]));

  const cards: CourseCard[] = [];
  for (const course of courses) {
    for (const chapter of getChapters(course.id)) {
      for (const topic of getTopics(chapter.id)) {
        const lesson = getLessons(topic.id)[0];
        cards.push({
          slug: lesson?.slug ?? topic.slug,
          title: topic.title,
          summary: topic.summary,
          level: LEVEL_LABEL[course.level],
          courseId: course.id,
          lessonId: lesson?.id,
          ready: isTopicReady(topic.id),
          questionCount: lesson ? (questionsBySlug.get(lesson.slug) ?? 0) : 0,
        });
      }
    }
  }

  const levels = courses.map((c) => ({ id: c.id, label: LEVEL_LABEL[c.level] }));

  /* ตัวเลขบนการ์ดคณิตศาสตร์ — นับจากไฟล์เนื้อหาจริงตอน build ไม่ได้พิมพ์ค่าไว้เอง
     วิชาอื่นยังไม่มีเนื้อหา จึงไม่มีตัวเลขให้แสดงและไม่ควรมี */
  const published = getPublishedLessons();
  const mathMeta = {
    lessons: published.length,
    hours: Math.round(published.reduce((n, l) => n + l.estimatedMinutes, 0) / 60),
    levels:
      levels.length > 1
        ? `${levels[0]?.label ?? ""}–${levels[levels.length - 1]?.label ?? ""}`
        : (levels[0]?.label ?? ""),
  };

  return (
    <>
      {/* แบนเนอร์ + ชั้นวางการ์ดวิชา — อยู่ในพื้นเข้มผืนเดียวกัน ใช้ภาพพื้นหลังใบเดียวกับหน้าแรก
          การ์ดวิชาต้องอยู่บนพื้นเข้มเสมอ (โทน hero-*) ไม่ว่าผู้ใช้จะเปิดธีมสว่างหรือมืด
          เพราะภาพการ์ดทั้งห้าใบเป็นภาพกลางคืน ถ้าวางบนพื้นขาวจะลอยและอ่านตัวหนังสือไม่ออก */}
      <section className="on-hero relative overflow-hidden border-b border-line bg-hero-bg">
        <img
          src="/hero-1600.webp"
          srcSet="/hero-900.webp 900w, /hero-1600.webp 1600w, /hero-2400.webp 2400w"
          sizes="100vw"
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: "50% 40%" }}
        />
        <span
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(4,7,14,0.92) 0%, rgba(4,7,14,0.74) 38%, rgba(4,7,14,0.40) 100%)," +
              "linear-gradient(180deg, rgba(4,7,14,0.58) 0%, rgba(4,7,14,0.24) 26%, rgba(4,7,14,0.72) 68%, rgba(4,7,14,0.94) 100%)",
          }}
        />
        <div className="relative px-4 pt-12 pb-8 sm:px-6 sm:pt-16 lg:px-10">
          <p className="m-0 mb-3 font-mono text-[11px] tracking-[0.2em] text-hero-ink-3 uppercase">
            เรียน · เข้าใจ · ทำได้จริง
          </p>
          <h1 className="m-0 mb-4 max-w-[16ch] font-display text-[clamp(28px,5.2vw,46px)] leading-[1.15] font-semibold tracking-tight text-hero-ink text-balance">
            เลือกเส้นทางการเรียนรู้ที่ใช่สำหรับคุณ
          </h1>
          <p className="m-0 max-w-[52ch] text-[clamp(14.5px,2vw,16.5px)] leading-relaxed text-hero-ink-2">
            บทเรียนทั้งหมดออกแบบตามหลักสูตรไทย เริ่มจากคำถามว่าทำไมต้องมีเรื่องนี้
            แล้วค่อยพาไปเจอสูตร ปิดท้ายด้วยโจทย์ที่มีเฉลยบอกเหตุผล
          </p>
        </div>

        <SubjectShowcase mathMeta={mathMeta} />
      </section>

      <div id="all-lessons" className="scroll-mt-16 px-4 py-8 sm:px-6 lg:px-10">
        <CourseGrid cards={cards} levels={levels} />
      </div>
    </>
  );
}
