import { NavLink } from "react-router-dom";
import { Shield, FileText, ScanSearch, Newspaper, Mic } from "lucide-react";

const links = [
  { to: "/", label: "Home", icon: Shield },
  { to: "/text", label: "Text Analysis", icon: FileText },
  { to: "/ocr", label: "OCR Detection", icon: ScanSearch },
  { to: "/voice", label: "Voice Detection", icon: Mic },
  { to: "/articles", label: "Articles", icon: Newspaper },
];

const Navbar = () => {
  return (
    <nav className="border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-primary" />
          <span className="font-display font-bold text-lg text-foreground tracking-tight">
            FakeNews<span className="text-primary">Detect</span>
          </span>
        </div>
        <ul className="flex items-center gap-1">
          {links.map(({ to, label, icon: Icon }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={to === "/"}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`
                }
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
