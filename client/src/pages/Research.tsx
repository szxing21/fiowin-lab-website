import { Card, CardContent } from "@/components/ui/card";
import { GeometricDecoration } from "@/components/GeometricDecoration";
import { trpc } from "@/lib/trpc";
import { Brain, Cpu, Network, Radio, Zap } from "lucide-react";
import { EditableText } from "@/components/EditableText";
import { useEditMode } from "@/contexts/EditModeContext";

const iconMap: Record<string, any> = {
  Network,
  Cpu,
  Radio,
  Zap,
  Brain,
};

export default function Research() {
  const { isEditMode } = useEditMode();
  const { data: researchAreas, isLoading } = trpc.lab.researchAreas.useQuery();

  if (isLoading) {
    return (
      <div className="min-h-screen py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4">研究方向</h1>
            <p className="text-lg text-muted-foreground">加载中...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <GeometricDecoration variant="hero" />
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            {isEditMode ? (
              <EditableText
                slug="research-title"
                field="title"
                content="研究方向"
                className="text-4xl md:text-6xl font-bold text-foreground"
                as="h1"
              />
            ) : (
              <h1 className="text-4xl md:text-6xl font-bold text-foreground">研究方向</h1>
            )}
            {isEditMode ? (
              <EditableText
                slug="research-description"
                field="content"
                content="我们专注于光通信与无线融合的多个前沿领域，推动未来信息网络的技术创新"
                className="text-lg text-muted-foreground leading-relaxed"
              />
            ) : (
              <p className="text-lg text-muted-foreground leading-relaxed">
                我们专注于光通信与无线融合的多个前沿领域，推动未来信息网络的技术创新
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Research Areas */}
      <section className="py-16">
        <div className="container">
          <div className="space-y-8">
            {researchAreas?.map((area, index) => {
              const topics = area.topics ? JSON.parse(area.topics) : [];
              const IconComponent = area.icon ? iconMap[area.icon] || Zap : Zap;
              const isEven = index % 2 === 0;

              return (
                <Card
                  key={area.id}
                  className="group hover:shadow-lg transition-all duration-300 border-border/40 overflow-hidden"
                >
                  <CardContent className="p-0">
                    <div className={`flex flex-col ${isEven ? "md:flex-row" : "md:flex-row-reverse"} gap-8`}>
                      {/* Icon Side */}
                      <div className="flex-shrink-0 md:w-1/3 bg-gradient-to-br from-accent/10 to-chart-2/10 flex items-center justify-center p-12">
                        <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-accent/30 to-chart-2/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <IconComponent className="h-16 w-16 text-accent" />
                        </div>
                      </div>

                      {/* Content Side */}
                      <div className="flex-1 p-8 space-y-4">
                        <div>
                          <h2 className="text-3xl font-bold text-foreground mb-2">{area.nameCn}</h2>
                          <p className="text-lg text-muted-foreground font-light">{area.nameEn}</p>
                        </div>

                        {area.description && (
                          <p className="text-base text-muted-foreground leading-relaxed">{area.description}</p>
                        )}

                        {topics.length > 0 && (
                          <div>
                            <h3 className="text-sm font-semibold text-foreground mb-3">核心研究主题</h3>
                            <div className="flex flex-wrap gap-2">
                              {topics.map((topic: string, idx: number) => (
                                <span
                                  key={idx}
                                  className="px-3 py-1.5 bg-accent/10 text-foreground rounded-full text-sm font-medium hover:bg-accent/20 transition-colors"
                                >
                                  {topic}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {researchAreas?.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">暂无研究方向信息</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
