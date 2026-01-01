import Link from "next/link";
import { Logo } from "./logo";
import { Copyright } from "./copyright";

export default function Footer() {
  return (
    <footer className="py-20 px-6 border-t border-border bg-card/30">
      <div className="max-w-6xl mx-auto flex flex-col @md:flex-row justify-between items-center gap-8">
        <Logo />

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

        <div className="text-sm text-muted-foreground/60 font-medium">
          <Copyright />
        </div>
      </div>
    </footer>
  );
}
