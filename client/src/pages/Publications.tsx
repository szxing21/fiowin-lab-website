import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GeometricDecoration } from "@/components/GeometricDecoration";
import { trpc } from "@/lib/trpc";
import { BookOpen, ExternalLink, FileText } from "lucide-react";

export default function Publications() {
  const { data: publications, isLoading } = trpc.lab.publications.useQuery();

  if (isLoading) {
    return (
      <div className="min-h-screen py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4">研究成果</h1>
            <p className="text-lg text-muted-foreground">加载中...</p>
          </div>
        </div>
      </div>
    );
  }

  const featuredPubs = publications?.filter((p) => p.featured === 1) || [];
  const otherPubs = publications?.filter((p) => p.featured !== 1) || [];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <GeometricDecoration variant="hero" />
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground">研究成果</h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              我们的研究成果发表在Nature Communications等国际顶级期刊和会议上，推动光通信领域的技术进步
            </p>
          </div>
        </div>
      </section>

      {/* Featured Publications */}
      {featuredPubs.length > 0 && (
        <section className="py-16 bg-card">
          <div className="container">
            <h2 className="text-3xl font-bold text-foreground mb-8">精选论文</h2>
            <div className="space-y-6">
              {featuredPubs.map((pub) => {
                const keywords = pub.keywords ? JSON.parse(pub.keywords) : [];
                const labMembers = pub.labMembers ? JSON.parse(pub.labMembers) : [];

                return (
                  <Card
                    key={pub.id}
                    className="group hover:shadow-lg transition-all duration-300 border-border/40"
                  >
                    <CardContent className="p-8 space-y-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge variant="default" className="bg-accent text-accent-foreground">
                              {pub.journal}
                            </Badge>
                            <Badge variant="outline">
                              {pub.year}年{pub.month ? `${pub.month}月` : ""}
                            </Badge>
                            {pub.type && (
                              <Badge variant="secondary">
                                {pub.type === "journal" ? "期刊" : pub.type === "conference" ? "会议" : "专利"}
                              </Badge>
                            )}
                          </div>
                          <h3 className="text-2xl font-bold text-foreground group-hover:text-accent transition-colors">
                            {pub.title}
                          </h3>
                          {pub.authors && (
                            <p className="text-sm text-muted-foreground">
                              <span className="font-semibold">作者：</span>
                              {pub.authors}
                            </p>
                          )}
                          {labMembers.length > 0 && (
                            <p className="text-sm text-muted-foreground">
                              <span className="font-semibold">实验室成员：</span>
                              {labMembers.join(", ")}
                            </p>
                          )}
                          {pub.abstract && (
                            <p className="text-sm text-muted-foreground leading-relaxed">{pub.abstract}</p>
                          )}
                          {keywords.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {keywords.map((keyword: string, idx: number) => (
                                <span
                                  key={idx}
                                  className="text-xs px-2 py-1 bg-accent/10 text-foreground rounded-full"
                                >
                                  {keyword}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex-shrink-0">
                          <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-accent/20 to-chart-2/20 flex items-center justify-center">
                            <BookOpen className="h-8 w-8 text-accent" />
                          </div>
                        </div>
                      </div>
                      {(pub.url || pub.doi || pub.pdfUrl) && (
                        <div className="flex items-center gap-3 pt-4 border-t border-border/40">
                          {pub.url && (
                            <a
                              href={pub.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-accent hover:underline flex items-center gap-1"
                            >
                              <ExternalLink className="h-4 w-4" />
                              查看论文
                            </a>
                          )}
                          {pub.pdfUrl && (
                            <a
                              href={pub.pdfUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-accent hover:underline flex items-center gap-1"
                            >
                              <FileText className="h-4 w-4" />
                              下载PDF
                            </a>
                          )}
                          {pub.doi && (
                            <span className="text-xs text-muted-foreground">DOI: {pub.doi}</span>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Other Publications */}
      {otherPubs.length > 0 && (
        <section className="py-16">
          <div className="container">
            <h2 className="text-3xl font-bold text-foreground mb-8">全部论文</h2>
            <div className="space-y-4">
              {otherPubs.map((pub) => {
                const keywords = pub.keywords ? JSON.parse(pub.keywords) : [];

                return (
                  <Card
                    key={pub.id}
                    className="group hover:shadow-md transition-all duration-300 border-border/40"
                  >
                    <CardContent className="p-6 space-y-3">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge variant="outline" className="text-xs">
                              {pub.journal}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              {pub.year}年{pub.month ? `${pub.month}月` : ""}
                            </Badge>
                          </div>
                          <h3 className="text-lg font-bold text-foreground group-hover:text-accent transition-colors">
                            {pub.title}
                          </h3>
                          {pub.authors && (
                            <p className="text-sm text-muted-foreground">{pub.authors}</p>
                          )}
                          {keywords.length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                              {keywords.slice(0, 5).map((keyword: string, idx: number) => (
                                <span
                                  key={idx}
                                  className="text-xs px-2 py-0.5 bg-accent/10 text-foreground rounded-full"
                                >
                                  {keyword}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      {(pub.url || pub.doi) && (
                        <div className="flex items-center gap-3 pt-2 border-t border-border/40">
                          {pub.url && (
                            <a
                              href={pub.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-accent hover:underline flex items-center gap-1"
                            >
                              <ExternalLink className="h-3 w-3" />
                              查看
                            </a>
                          )}
                          {pub.doi && (
                            <span className="text-xs text-muted-foreground">DOI: {pub.doi}</span>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {publications?.length === 0 && (
        <section className="py-16">
          <div className="container text-center">
            <p className="text-muted-foreground">暂无研究成果</p>
          </div>
        </section>
      )}
    </div>
  );
}
