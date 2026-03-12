import { Link } from "@tanstack/react-router";
import { GraduationCap, Heart, Mail, MapPin, Phone } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-accent-foreground">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div>
                <div className="font-display text-lg font-bold">
                  Sir Isaac Newton College
                </div>
              </div>
            </div>
            <p className="text-sm text-primary-foreground/70 leading-relaxed">
              Shaping tomorrow's leaders through excellence in education,
              research, and innovation since 1974.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-accent mb-4 tracking-wide">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm">
              {[
                { label: "Home", path: "/" },
                { label: "Courses", path: "/courses" },
                { label: "Admission", path: "/admission" },
                { label: "Contact", path: "/contact" },
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-primary-foreground/70 hover:text-accent transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-display font-semibold text-accent mb-4 tracking-wide">
              Contact
            </h4>
            <ul className="space-y-3 text-sm text-primary-foreground/70">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 text-accent shrink-0" />
                <span>
                  123 University Road,
                  <br />
                  Newton City, GC 10001
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-accent shrink-0" />
                <a
                  href="tel:+18004733634"
                  className="hover:text-accent transition-colors"
                >
                  +1 800-GREENFIELD
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-accent shrink-0" />
                <a
                  href="mailto:admissions@greenfield.edu"
                  className="hover:text-accent transition-colors"
                >
                  admissions@greenfield.edu
                </a>
              </li>
            </ul>
          </div>

          {/* Admissions */}
          <div>
            <h4 className="font-display font-semibold text-accent mb-4 tracking-wide">
              Admissions
            </h4>
            <div className="text-sm text-primary-foreground/70 space-y-2">
              <p>Applications Open</p>
              <p className="text-accent font-semibold">2026–27 Academic Year</p>
              <p>Application Deadline: July 31, 2026</p>
              <Link
                to="/admission"
                className="inline-block mt-3 px-4 py-2 bg-accent text-accent-foreground rounded-md text-sm font-semibold hover:bg-accent/90 transition-colors"
              >
                Apply Now →
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-primary-foreground/50">
          <p>© {year} Sir Isaac Newton College. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="h-3.5 w-3.5 text-accent fill-accent" />{" "}
            using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
