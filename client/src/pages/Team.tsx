import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GeometricDecoration } from "@/components/GeometricDecoration";
import { trpc } from "@/lib/trpc";
import { Award, BookOpen, User } from "lucide-react";

export default function Team() {
  const { data: members, isLoading } = trpc.lab.members.useQuery();

  const groupedMembers = {
    PI: members?.filter((m) => m.role === "PI") || [],
    Postdoc: members?.filter((m) => m.role === "Postdoc") || [],
    PhD: members?.filter((m) => m.role === "PhD") || [],
    Master: members?.filter((m) => m.role === "Master") || [],
    Member: members?.filter((m) => m.role === "Member") || [],
  };

  const roleLabels = {
    PI: "导师团队",
    Postdoc: "博士后",
    PhD: "博士生",
    Master: "硕士生",
    Member: "团队成员",
  };

  if (isLoading) {
    return (
      <div className="min-h-screen py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4">团队成员</h1>
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
            <h1 className="text-4xl md:text-6xl font-bold text-foreground">团队成员</h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              我们的团队由经验丰富的导师、充满活力的博士后和研究生组成，共同推动光通信领域的前沿研究
            </p>
          </div>
        </div>
      </section>

      {/* Members by Role */}
      <section className="py-16">
        <div className="container space-y-16">
          {(Object.keys(groupedMembers) as Array<keyof typeof groupedMembers>).map((role) => {
            const roleMembers = groupedMembers[role];
            if (roleMembers.length === 0) return null;

            return (
              <div key={role}>
                <h2 className="text-3xl font-bold text-foreground mb-8">{roleLabels[role]}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {roleMembers.map((member) => {
                    const interests = member.researchInterests ? JSON.parse(member.researchInterests) : [];
                    const awards = member.awards ? JSON.parse(member.awards) : [];

                    return (
                      <Card
                        key={member.id}
                        className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/40"
                      >
                        <CardContent className="p-6 space-y-4">
                          {/* Avatar */}
                          <div className="flex items-start gap-4">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent/20 to-chart-2/20 flex items-center justify-center flex-shrink-0">
                              {member.photoUrl ? (
                                <img
                                  src={member.photoUrl}
                                  alt={member.nameCn}
                                  className="w-full h-full rounded-full object-cover"
                                />
                              ) : (
                                <User className="h-8 w-8 text-accent" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-xl font-bold text-foreground">{member.nameCn}</h3>
                              <p className="text-sm text-muted-foreground">{member.nameEn}</p>
                              {member.title && (
                                <Badge variant="secondary" className="mt-1 text-xs">
                                  {member.title}
                                </Badge>
                              )}
                              {member.year && (
                                <p className="text-xs text-muted-foreground mt-1">{member.year}</p>
                              )}
                            </div>
                          </div>

                          {/* Bio */}
                          {member.bio && (
                            <p className="text-sm text-muted-foreground leading-relaxed">{member.bio}</p>
                          )}

                          {/* Research Interests */}
                          {interests.length > 0 && (
                            <div>
                              <p className="text-xs font-semibold text-foreground mb-2">研究方向</p>
                              <div className="flex flex-wrap gap-1.5">
                                {interests.map((interest: string, idx: number) => (
                                  <span
                                    key={idx}
                                    className="text-xs px-2 py-1 bg-accent/10 text-foreground rounded-full"
                                  >
                                    {interest}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Stats */}
                          {((member.publications ?? 0) > 0 || (member.citations ?? 0) > 0 || (member.hIndex ?? 0) > 0) && (
                            <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2 border-t border-border/40">
                              {(member.publications ?? 0) > 0 && (
                                <div className="flex items-center gap-1">
                                  <BookOpen className="h-3 w-3" />
                                  <span>{member.publications} 篇论文</span>
                                </div>
                              )}
                              {(member.citations ?? 0) > 0 && (
                                <div className="flex items-center gap-1">
                                  <span>{member.citations} 引用</span>
                                </div>
                              )}
                              {(member.hIndex ?? 0) > 0 && (
                                <div className="flex items-center gap-1">
                                  <span>h-index {member.hIndex}</span>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Awards */}
                          {awards.length > 0 && (
                            <div>
                              <p className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1">
                                <Award className="h-3 w-3" />
                                荣誉奖项
                              </p>
                              <ul className="text-xs text-muted-foreground space-y-1">
                                {awards.slice(0, 3).map((award: string, idx: number) => (
                                  <li key={idx} className="line-clamp-1">
                                    • {award}
                                  </li>
                                ))}
                                {awards.length > 3 && (
                                  <li className="text-accent">+ {awards.length - 3} 更多</li>
                                )}
                              </ul>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
