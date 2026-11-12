import Image from "@/components/safe-image";
import { bootcamp } from "@/content/bootcamp";

export function SiteFooter() {
  const { footer, brand } = bootcamp;
  return (
    <footer className="site-footer">
      <div>
        <Image src={brand.wordmark.src!} alt={brand.wordmark.alt} width={brand.wordmark.width} height={brand.wordmark.height} />
        <p>{footer.line}</p>
      </div>
      <p>
        © {new Date().getFullYear()} {footer.copyright}
      </p>
    </footer>
  );
}
