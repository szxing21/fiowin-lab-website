import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { GeometricDecoration } from "@/components/GeometricDecoration";
import { trpc } from "@/lib/trpc";
import { ArrowRight, Award, BookOpen, Users, Zap } from "lucide-react";
import { Link } from "wouter";
import { EditableText } from "@/components/EditableText";
import { useEditMode } from "@/contexts/EditModeContext";

export default function Home() {
  const { isEditMode } = useEditMode();
  const { data: researchAreas, isLoading: areasLoading } = trpc.lab.researchAreas.useQuery();
  const { data: featuredNews, isLoading: newsLoading } = trpc.lab.featuredNews.useQuery();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <GeometricDecoration variant="hero" />
        <div className="container relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-block px-4 py-2 bg-accent/20 rounded-full text-sm font-medium text-foreground mb-4">
              复旦大学未来信息创新学院
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-foreground leading-tight">
              未来智能光子
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-chart-2">
                无线融合实验室
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground font-light max-w-2xl mx-auto leading-relaxed">
              FiOWIN Lab - 探索光通信与无线融合的前沿技术，推动未来信息网络的创新发展
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/team">
                <Button size="lg" className="text-base font-semibold">
                  了解团队
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/publications">
                <Button size="lg" variant="outline" className="text-base font-semibold">
                  研究成果
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 md:py-24 bg-card relative">
        <GeometricDecoration variant="section" />
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            {isEditMode ? (
              <EditableText
                slug="home-about-title"
                field="title"
                content="关于实验室"
                className="text-3xl md:text-5xl font-bold text-foreground"
                as="h2"
              />
            ) : (
              <h2 className="text-3xl md:text-5xl font-bold text-foreground">关于实验室</h2>
            )}
            {isEditMode ? (
              <EditableText
                slug="home-about-content"
                field="content"
                content="未来智能光子无线融合实验室（FiOWIN Lab）隶属于复旨大学未来信息创新学院，由张俊文教授和迟楠教授领导。实验室专注于光通信系统、光电子器件、光纤-无线融合、光互连与光计算、智能信号处理等前沿领域的研究，致力于为6G通信、数据中心互连和智能计算中心提供创新的硬件基础和技术支撑。"
                className="text-lg text-muted-foreground leading-relaxed"
              />
            ) : (
              <p className="text-lg text-muted-foreground leading-relaxed">
                未来智能光子无线融合实验室（FiOWIN Lab）隶属于复旨大学未来信息创新学院，由张俊文教授和迟楠教授领导。实验室专注于光通信系统、光电子器件、光纤-无线融合、光互连与光计算、智能信号处理等前沿领域的研究，致力于为6G通信、数据中心互连和智能计算中心提供创新的硬件基础和技术支撑。
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Research Areas */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="text-center mb-12">
            {isEditMode ? (
              <EditableText
                slug="home-research-title"
                field="title"
                content="研究方向"
                className="text-3xl md:text-5xl font-bold text-foreground mb-4"
                as="h2"
              />
            ) : (
              <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">研究方向</h2>
            )}
            {isEditMode ? (
              <EditableText
                slug="home-research-subtitle"
                field="content"
                content="探索光通信与无线融合的多个前沿领域"
                className="text-lg text-muted-foreground"
              />
            ) : (
              <p className="text-lg text-muted-foreground">探索光通信与无线融合的多个前沿领域</p>
            )}
          </div>

          {areasLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(5)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-12 w-12 bg-muted rounded-lg mb-4" />
                    <div className="h-6 bg-muted rounded mb-2" />
                    <div className="h-4 bg-muted rounded" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {researchAreas?.slice(0, 5).map((area) => {
                const topics = area.topics ? JSON.parse(area.topics) : [];
                return (
                  <Card
                    key={area.id}
                    className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/40"
                  >
                    <CardContent className="p-6 space-y-4">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-accent/20 to-chart-2/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Zap className="h-6 w-6 text-accent" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-foreground mb-2">{area.nameCn}</h3>
                        <p className="text-sm text-muted-foreground">{area.nameEn}</p>
                      </div>
                      {topics.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {topics.slice(0, 3).map((topic: string, idx: number) => (
                            <span
                              key={idx}
                              className="text-xs px-2 py-1 bg-accent/10 text-foreground rounded-full"
                            >
                              {topic}
                            </span>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          <div className="text-center mt-8">
            <Link href="/research">
              <Button variant="outline" size="lg">
                查看全部研究方向
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Highlights Section */}
      <section className="py-16 md:py-24 bg-card relative">
        <GeometricDecoration variant="corner" />
        <div className="container relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">实验室亮点</h2>
            <p className="text-lg text-muted-foreground">卓越的研究成果与学术影响力</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center border-border/40">
              <CardContent className="p-8 space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-accent/20 to-chart-2/20 flex items-center justify-center">
                  <BookOpen className="h-8 w-8 text-accent" />
                </div>
                <div>
                  <div className="text-4xl font-black text-foreground mb-2">Nature</div>
                  <p className="text-sm text-muted-foreground">Communications 顶级期刊论文</p>
                </div>
              </CardContent>
            </Card>

            <Card className="text-center border-border/40">
              <CardContent className="p-8 space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-accent/20 to-chart-2/20 flex items-center justify-center">
                  <Users className="h-8 w-8 text-accent" />
                </div>
                <div>
                  <div className="text-4xl font-black text-foreground mb-2">15+</div>
                  <p className="text-sm text-muted-foreground">优秀团队成员</p>
                </div>
              </CardContent>
            </Card>

            <Card className="text-center border-border/40">
              <CardContent className="p-8 space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-accent/20 to-chart-2/20 flex items-center justify-center">
                  <Award className="h-8 w-8 text-accent" />
                </div>
                <div>
                  <div className="text-4xl font-black text-foreground mb-2">OFC</div>
                  <p className="text-sm text-muted-foreground">国际顶级会议论文录用</p>
                </div>
              </CardContent>
            </Card>

            <Card className="text-center border-border/40">
              <CardContent className="p-8 space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-accent/20 to-chart-2/20 flex items-center justify-center">
                  <Zap className="h-8 w-8 text-accent" />
                </div>
                <div>
                  <div className="text-4xl font-black text-foreground mb-2">6G</div>
                  <p className="text-sm text-muted-foreground">光纤-无线融合前沿技术</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Latest News */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">最新动态</h2>
            <p className="text-lg text-muted-foreground">了解实验室的最新进展与成果</p>
          </div>

          {newsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-4 bg-muted rounded mb-4" />
                    <div className="h-6 bg-muted rounded mb-2" />
                    <div className="h-4 bg-muted rounded" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredNews?.slice(0, 3).map((item) => (
                <Card
                  key={item.id}
                  className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/40"
                >
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="px-2 py-1 bg-accent/10 rounded-full">{item.category}</span>
                      <span>{new Date(item.publishedAt).toLocaleDateString("zh-CN")}</span>
                    </div>
                    <h3 className="text-lg font-bold text-foreground line-clamp-2 group-hover:text-accent transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-3">{item.summary}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="text-center mt-8">
            <Link href="/news">
              <Button variant="outline" size="lg">
                查看全部动态
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
