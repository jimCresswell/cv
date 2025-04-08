import { CVContent } from "@/components/cv-content";
import { ThemeToggle } from "@/components/theme-toggle";
import { PrintButton } from "@/components/print-button";
import cvData from "@/data/cv-data";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8 max-w-[45rem] print:px-0 print:py-2">
        <div className="flex justify-end gap-2 mb-4 print:hidden">
          <Link
            href="/test"
            className="text-xs text-muted-foreground hover:text-primary mr-auto"
          >
            Test Theme
          </Link>
          <PrintButton />
          <ThemeToggle />
        </div>
        <CVContent data={cvData} />
      </div>
    </main>
  );
}
