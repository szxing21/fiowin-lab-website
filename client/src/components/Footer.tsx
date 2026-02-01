import { Mail, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t border-border/40 bg-card mt-auto">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-bold mb-4">FiOWIN Lab</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              未来智能光子无线融合实验室致力于光通信、光电子器件、光纤-无线融合等前沿领域的研究与创新。
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">快速链接</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/team" className="text-muted-foreground hover:text-foreground transition-colors">
                  团队成员
                </a>
              </li>
              <li>
                <a href="/publications" className="text-muted-foreground hover:text-foreground transition-colors">
                  研究成果
                </a>
              </li>
              <li>
                <a href="/research" className="text-muted-foreground hover:text-foreground transition-colors">
                  研究方向
                </a>
              </li>
              <li>
                <a href="/news" className="text-muted-foreground hover:text-foreground transition-colors">
                  新闻动态
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold mb-4">联系我们</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground">
                  复旦大学未来信息创新学院
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <span className="text-muted-foreground">
                  微信公众号：FiOWIN_LAB
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border/40 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} FiOWIN Lab. 复旦大学未来信息创新学院</p>
        </div>
      </div>
    </footer>
  );
}
