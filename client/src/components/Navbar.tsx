import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const navItems = [
  { label: "首页", href: "/" },
  { label: "团队成员", href: "/team" },
  { label: "研究成果", href: "/publications" },
  { label: "研究方向", href: "/research" },
  { label: "新闻动态", href: "/news" },
  { label: "学术会议", href: "/conferences" },
  { label: "联系我们", href: "/contact" },
];

export function Navbar() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center space-x-3 cursor-pointer">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent to-chart-2 flex items-center justify-center">
                <span className="text-white font-bold text-lg">F</span>
              </div>
              <div className="hidden sm:block">
                <div className="text-lg font-bold text-foreground">FiOWIN Lab</div>
                <div className="text-xs text-muted-foreground font-light">未来智能光子无线融合实验室</div>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = location === item.href;
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className={`text-sm font-medium ${isActive ? "bg-accent/20 text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2 border-t border-border/40">
            {navItems.map((item) => {
              const isActive = location === item.href;
              return (
                <Link key={item.href} href={item.href}>
                  <div
                    className={`block px-4 py-2 rounded-lg text-sm font-medium ${
                      isActive
                        ? "bg-accent/20 text-foreground"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </nav>
  );
}
