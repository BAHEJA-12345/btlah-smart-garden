import { Link, useLocation } from "react-router-dom";
import { Leaf, Home, Lightbulb, Heart, MessageSquare, Bot } from "lucide-react";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const location = useLocation();

  const links = [
    { to: "/", icon: Home, label: "Home" },
    { to: "/recommendations", icon: Lightbulb, label: "Smart Recommendations" },
    { to: "/benefits", icon: Leaf, label: "Benefits" },
    { to: "/my-plants", icon: Heart, label: "My Plants" },
    { to: "/messages", icon: MessageSquare, label: "Messages" },
    { to: "/assistant", icon: Bot, label: "AI Assistant" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-card/80 backdrop-blur-md shadow-soft">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold text-primary">
            <Leaf className="h-6 w-6" />
            <span>btlah 🌱</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {links.map(({ to, icon: Icon, label }) => (
              <Link
                key={to}
                to={to}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200",
                  location.pathname === to
                    ? "bg-primary text-primary-foreground shadow-soft"
                    : "text-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="text-sm font-medium">{label}</span>
              </Link>
            ))}
          </div>

          <div className="flex md:hidden items-center gap-1">
            {links.map(({ to, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={cn(
                  "p-2 rounded-lg transition-all duration-200",
                  location.pathname === to
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-secondary"
                )}
              >
                <Icon className="h-5 w-5" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
