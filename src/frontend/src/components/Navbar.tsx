import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link, useRouterState } from "@tanstack/react-router";
import { GraduationCap, Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

const navLinks = [
  { label: "Home", path: "/", ocid: "nav.home.link" },
  { label: "Courses", path: "/courses", ocid: "nav.courses.link" },
  { label: "Admission", path: "/admission", ocid: "nav.admission.link" },
  { label: "Contact", path: "/contact", ocid: "nav.contact.link" },
  { label: "Admin", path: "/admin", ocid: "nav.admin.link" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-primary/95 backdrop-blur-md shadow-lg shadow-primary/20"
          : "bg-primary",
      )}
    >
      <nav className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2.5 text-primary-foreground hover:opacity-90 transition-opacity"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-gold">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div className="leading-tight">
            <div className="font-display text-base font-bold text-primary-foreground">
              Sir Isaac Newton
            </div>
            <div className="text-[10px] font-body tracking-widest uppercase text-accent opacity-90">
              College
            </div>
          </div>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = currentPath === link.path;
            return (
              <li key={link.path}>
                <Link
                  to={link.path}
                  data-ocid={link.ocid}
                  className={cn(
                    "relative px-4 py-2 text-sm font-medium transition-colors rounded-md",
                    isActive
                      ? "text-accent"
                      : "text-primary-foreground/80 hover:text-primary-foreground",
                  )}
                >
                  {link.label}
                  {isActive && (
                    <motion.span
                      layoutId="nav-indicator"
                      className="absolute bottom-0 left-2 right-2 h-0.5 bg-accent rounded-full"
                    />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Apply Now button (desktop) */}
        <div className="hidden md:block">
          <Link to="/admission">
            <Button
              size="sm"
              className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold shadow-gold"
            >
              Apply Now
            </Button>
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-primary-foreground p-2"
          onClick={() => setMobileOpen((prev) => !prev)}
          type="button"
          aria-label="Toggle navigation"
        >
          {mobileOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden bg-primary border-t border-white/10"
          >
            <ul className="container mx-auto px-4 pb-4 pt-2 flex flex-col gap-1">
              {navLinks.map((link) => {
                const isActive = currentPath === link.path;
                return (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      data-ocid={link.ocid}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "block px-4 py-2.5 text-sm font-medium rounded-md transition-colors",
                        isActive
                          ? "bg-white/10 text-accent"
                          : "text-primary-foreground/80 hover:bg-white/10 hover:text-primary-foreground",
                      )}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
              <li className="pt-2">
                <Link to="/admission" onClick={() => setMobileOpen(false)}>
                  <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-semibold">
                    Apply Now
                  </Button>
                </Link>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
