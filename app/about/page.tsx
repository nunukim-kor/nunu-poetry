import { readAbout } from "@/lib/about";

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const { body } = await readAbout();
  const paragraphs = body.split(/\n\s*\n/);

  return (
    <main id="main-content" tabIndex={-1} className="page pt-36 pb-32">
      <div className="book-type max-w-[540px] text-[19px] leading-[2.1]">
        {paragraphs.map((paragraph, index) => (
          <p key={index} className={index > 0 ? "mt-10 whitespace-pre-wrap" : "whitespace-pre-wrap"}>
            {paragraph}
          </p>
        ))}
      </div>
    </main>
  );
}
