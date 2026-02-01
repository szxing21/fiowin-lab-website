import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GeometricDecoration } from "@/components/GeometricDecoration";
import { trpc } from "@/lib/trpc";
import { Calendar, FileText, MapPin, Presentation, Users } from "lucide-react";
import { EditableText } from "@/components/EditableText";
import { useEditMode } from "@/contexts/EditModeContext";

export default function Conferences() {
  const { isEditMode } = useEditMode();
  const { data: conferences, isLoading } = trpc.lab.conferences.useQuery();

  if (isLoading) {
    return (
      <div className="min-h-screen py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4">学术会议</h1>
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
                slug="conferences-title"
                field="title"
                content="学术会议"
                className="text-4xl md:text-6xl font-bold text-foreground"
                as="h1"
              />
            ) : (
              <h1 className="text-4xl md:text-6xl font-bold text-foreground">学术会议</h1>
            )}
            {isEditMode ? (
              <EditableText
                slug="conferences-description"
                field="content"
                content="我们积极参与国际顶级学术会议，展示最新研究成果，与全球学者交流合作"
                className="text-lg text-muted-foreground leading-relaxed"
              />
            ) : (
              <p className="text-lg text-muted-foreground leading-relaxed">
                我们积极参与国际顶级学术会议，展示最新研究成果，与全球学者交流合作
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Conferences List */}
      <section className="py-16">
        <div className="container">
          <div className="space-y-8">
            {conferences?.map((conf) => {
              const attendees = conf.attendees ? JSON.parse(conf.attendees) : [];
              const invitedTalks = conf.invitedTalks ? JSON.parse(conf.invitedTalks) : [];
              const startDate = new Date(conf.startDate);
              const endDate = conf.endDate ? new Date(conf.endDate) : null;

              return (
                <Card
                  key={conf.id}
                  className="group hover:shadow-lg transition-all duration-300 border-border/40"
                >
                  <CardContent className="p-8 space-y-6">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="default" className="bg-accent text-accent-foreground text-base px-3 py-1">
                            {conf.name}
                          </Badge>
                          <Badge variant="outline">{conf.year}</Badge>
                        </div>
                        <h2 className="text-2xl font-bold text-foreground">{conf.fullName}</h2>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1.5">
                            <MapPin className="h-4 w-4" />
                            <span>{conf.location}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {startDate.toLocaleDateString("zh-CN")}
                              {endDate && ` - ${endDate.toLocaleDateString("zh-CN")}`}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-accent/20 to-chart-2/20 flex items-center justify-center">
                          <Presentation className="h-8 w-8 text-accent" />
                        </div>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {(conf.papers ?? 0) > 0 && (
                        <div className="text-center p-4 bg-accent/5 rounded-lg">
                          <div className="text-2xl font-bold text-foreground">{conf.papers}</div>
                          <div className="text-xs text-muted-foreground mt-1">录用论文</div>
                        </div>
                      )}
                      {(conf.oral ?? 0) > 0 && (
                        <div className="text-center p-4 bg-chart-2/5 rounded-lg">
                          <div className="text-2xl font-bold text-foreground">{conf.oral}</div>
                          <div className="text-xs text-muted-foreground mt-1">口头报告</div>
                        </div>
                      )}
                      {(conf.poster ?? 0) > 0 && (
                        <div className="text-center p-4 bg-chart-3/5 rounded-lg">
                          <div className="text-2xl font-bold text-foreground">{conf.poster}</div>
                          <div className="text-xs text-muted-foreground mt-1">海报展示</div>
                        </div>
                      )}
                      {(conf.invited ?? 0) > 0 && (
                        <div className="text-center p-4 bg-chart-4/10 rounded-lg">
                          <div className="text-2xl font-bold text-foreground">{conf.invited}</div>
                          <div className="text-xs text-muted-foreground mt-1">邀请报告</div>
                        </div>
                      )}
                    </div>

                    {/* Description */}
                    {conf.description && (
                      <p className="text-sm text-muted-foreground leading-relaxed">{conf.description}</p>
                    )}

                    {/* Attendees */}
                    {attendees.length > 0 && (
                      <div className="pt-4 border-t border-border/40">
                        <div className="flex items-start gap-2">
                          <Users className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                          <div className="flex-1">
                            <span className="text-sm font-semibold text-foreground">参会成员：</span>
                            <span className="text-sm text-muted-foreground ml-2">{attendees.join("、")}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Invited Talks */}
                    {invitedTalks.length > 0 && (
                      <div className="pt-2">
                        <div className="flex items-start gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                          <div className="flex-1">
                            <span className="text-sm font-semibold text-foreground">邀请报告人：</span>
                            <span className="text-sm text-muted-foreground ml-2">{invitedTalks.join("、")}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {conferences?.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">暂无会议信息</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
