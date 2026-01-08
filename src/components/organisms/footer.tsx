import Link from "next/link";
import { Logo } from "./logo";
import { Copyright } from "./copyright";

export default function Footer() {
  return (
    <footer className="bg-card/30 px-4 @md:px-6 py-12 @md:py-20 border-border border-t container-section">
      <div className="flex @md:flex-row flex-col justify-between items-center gap-8 mx-auto max-w-6xl">
        <Logo />

        <div className="flex gap-6 @md:gap-8 font-medium text-muted-foreground text-sm">
          <Link href="#" className="hover:text-primary transition-colors">
            Privacy
          </Link>
          <Link href="#" className="hover:text-primary transition-colors">
            Terms
          </Link>
          <Link href="/contact" className="hover:text-primary transition-colors">
            Contact
          </Link>
          <Link href="#" className="hover:text-primary transition-colors">
            Twitter
          </Link>
        </div>

        <div className="font-medium text-muted-foreground/60 text-sm">
          <Copyright />
        </div>
      </div>
    </footer>
  );
}
