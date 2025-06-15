export function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-secondary text-secondary-foreground py-6 mt-auto">
      <div className="container mx-auto text-center">
        <p className="text-sm">
          &copy; {currentYear} Fashion Decoder. All rights reserved.
        </p>
        <p className="text-xs mt-1">
          Discover your style, inspired by the screen.
        </p>
      </div>
    </footer>
  );
}
