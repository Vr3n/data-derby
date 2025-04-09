import { Link } from '@tanstack/react-router'

const Footer = () => {
  return (
    <footer className="border-t py-6 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
        <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} Data-Derby. All rights reserved.</p>
        <div className="flex gap-4">
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
            About
          </Link>
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
            Privacy
          </Link>
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
            Terms
          </Link>
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  )
}

export default Footer
