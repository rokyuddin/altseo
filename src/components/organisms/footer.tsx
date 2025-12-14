import { Leaf } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="py-12 px-6 border-t border-stone-100 bg-white/50">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-2">
          <Leaf className="w-5 h-5 text-primary" />
          <span className="font-bold text-foreground">AltSEO</span>
        </div>
        <div className="flex gap-8 text-sm font-medium text-muted-foreground">
          <Link href="#" className="hover:text-primary transition-colors">
            Privacy
          </Link>
          <Link href="#" className="hover:text-primary transition-colors">
            Terms
          </Link>
          <Link href="#" className="hover:text-primary transition-colors">
            Twitter
          </Link>
        </div>
        <div className="text-sm text-muted-foreground/60">
          © 2024 AltSEO Inc.
        </div>
      </div>
    </footer>
  );
}
