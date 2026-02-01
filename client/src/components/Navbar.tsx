import { Button } from "@/components/ui/button";
import { Menu, X, LogIn, Edit2, Upload } from "lucide-react";
import { useState } from "react";
import { useLocation, Link } from "wouter";
import { useEditMode } from "@/contexts/EditModeContext";
import { trpc } from "@/lib/trpc";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ImageUpload } from "./ImageUpload";

const navItems = [
  { label: "首页", href: "/" },
  { label: "团队成员", href: "/team" },
  { label: "研究成果", href: "/publications" },
  { label: "研究方向", href: "/research" },
  { label: "新闻动态", href: "/news" },
  { label: "学术会议", href: "/conferences" },
  { label: "数据分析", href: "/analytics" },
  { label: "联系我们", href: "/contact" },
];

export function Navbar() {
  const [location, setLocation] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isEditMode, setIsEditMode, setIsAdmin } = useEditMode();
  const [logoUploadOpen, setLogoUploadOpen] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const { data: homePage } = trpc.admin.getPage.useQuery({ slug: "home" });
  const savePageMutation = trpc.admin.savePage.useMutation();
  
  const handleLoginClick = () => {
    setLocation("/admin");
  };
  
  const handleEditToggle = () => {
    const newEditMode = !isEditMode;
    setIsEditMode(newEditMode);
    setIsAdmin(newEditMode);
  };

  const handleLogoUpload = async (url: string) => {
    setLogoUrl(url);
    await savePageMutation.mutateAsync({
      slug: "home",
      title: homePage?.title || "首页",
      logoUrl: url,
    });
    setLogoUploadOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center space-x-3 cursor-pointer group relative">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent to-chart-2 flex items-center justify-center relative overflow-hidden">
                {logoUrl || homePage?.logoUrl ? (
                  <img
                    src={logoUrl || homePage?.logoUrl || ""}
                    alt="Logo"
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <span className="text-white font-bold text-lg">F</span>
                )}
                {isEditMode && (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setLogoUploadOpen(true);
                    }}
                    className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Upload className="w-4 h-4 text-white" />
                  </button>
                )}
              </div>
              <div className="hidden sm:block">
                <div className="text-lg font-bold text-foreground">FiOWIN Lab</div>
                <div className="text-xs text-muted-foreground font-light">未来智能光子无线融合实验室</div>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1 flex-1 justify-center">
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

          {/* Logo Upload Dialog */}
          <Dialog open={logoUploadOpen} onOpenChange={setLogoUploadOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>上传实验室 Logo</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <ImageUpload
                  onUpload={handleLogoUpload}
                  disabled={savePageMutation.isPending}
                />
              </div>
            </DialogContent>
          </Dialog>

          {/* Login/Edit Mode Button */}
          <div className="flex items-center space-x-2">
            {isEditMode ? (
              <Button
                variant="default"
                size="sm"
                onClick={handleEditToggle}
                className="flex items-center space-x-2"
              >
                <Edit2 className="h-4 w-4" />
                <span className="hidden sm:inline">退出编辑</span>
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={handleLoginClick}
                className="flex items-center space-x-2"
              >
                <LogIn className="h-4 w-4" />
                <span className="hidden sm:inline">登录</span>
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden ml-2 p-2 hover:bg-accent/10 rounded-lg"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border/40 bg-background/95">
            <div className="flex flex-col space-y-1 p-4">
              {navItems.map((item) => {
                const isActive = location === item.href;
                return (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant={isActive ? "secondary" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
