import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { GeometricDecoration } from "@/components/GeometricDecoration";
import { trpc } from "@/lib/trpc";
import { 
  User, 
  Mail, 
  Globe, 
  GraduationCap, 
  Briefcase, 
  Award, 
  BookOpen, 
  Lightbulb,
  ExternalLink,
  ArrowLeft
} from "lucide-react";
import { useParams, Link } from "wouter";
import { safeJsonParse } from "@/lib/jsonParser";

export default function MemberProfile() {
  const params = useParams();
  const memberId = params.id ? parseInt(params.id) : 0;

  const { data: member, isLoading } = trpc.lab.memberById.useQuery({ id: memberId });
  const { data: publications } = trpc.lab.publicationsByMember.useQuery(
    { memberName: member?.nameCn || "" },
    { enabled: !!member?.nameCn }
  );

  if (isLoading) {
    return (
      <div className="min-h-screen py-16">
        <div className="container">
          <div className="text-center">
            <p className="text-lg text-muted-foreground">加载中...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="min-h-screen py-16">
        <div className="container">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-foreground mb-4">成员未找到</h1>
            <Link href="/team">
              <Button variant="outline">返回团队页面</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const researchInterests = safeJsonParse(member.researchInterests, []);
  const awards = safeJsonParse(member.awards, []);
  const education = safeJsonParse(member.education, []);
  const workExperience = safeJsonParse(member.workExperience, []);
  const projects = safeJsonParse(member.projects, []);
  const researchAreas = safeJsonParse(member.researchAreas, []);

  const roleLabels: Record<string, string> = {
    PI: "导师",
    Postdoc: "博士后",
    PhD: "博士生",
    Master: "硕士生",
    Member: "团队成员",
  };

  return (
    <div className="min-h-screen">
      {/* Back Button */}
      <section className="py-6 border-b border-border/40">
        <div className="container">
          <Link href="/team">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              返回团队页面
            </Button>
          </Link>
        </div>
      </section>

      {/* Hero Section - Personal Info */}
      <section className="relative py-16 md:py-20 overflow-hidden">
        <GeometricDecoration variant="hero" />
        <div className="container relative z-10">
          <div className="max-w-5xl mx-auto">
            <Card className="border-border/40">
              <CardContent className="p-8 md:p-12">
                <div className="flex flex-col md:flex-row gap-8 items-start">
                  {/* Avatar */}
                  <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-accent/20 to-chart-2/20 flex items-center justify-center flex-shrink-0">
                    {member.photoUrl ? (
                      <img
                        src={member.photoUrl}
                        alt={member.nameCn}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <User className="h-16 w-16 md:h-20 md:w-20 text-accent" />
                    )}
                  </div>

                  {/* Basic Info */}
                  <div className="flex-1 space-y-4">
                    <div>
                      <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-2">
                        {member.nameCn}
                      </h1>
                      <p className="text-xl text-muted-foreground mb-3">{member.nameEn}</p>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="default" className="text-sm">
                          {roleLabels[member.role]}
                        </Badge>
                        {member.title && (
                          <Badge variant="secondary" className="text-sm">
                            {member.title}
                          </Badge>
                        )}
                        {member.year && (
                          <Badge variant="outline" className="text-sm">
                            {member.year}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Contact & Links */}
                    <div className="space-y-2">
                      {member.email && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Mail className="h-4 w-4" />
                          <a href={`mailto:${member.email}`} className="hover:text-accent transition-colors">
                            {member.email}
                          </a>
                        </div>
                      )}
                      <div className="flex flex-wrap gap-3">
                        {member.personalWebsite && (
                          <a
                            href={member.personalWebsite}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-muted-foreground hover:text-accent transition-colors flex items-center gap-1"
                          >
                            <Globe className="h-4 w-4" />
                            个人网站
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                        {member.googleScholar && (
                          <a
                            href={member.googleScholar}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-muted-foreground hover:text-accent transition-colors flex items-center gap-1"
                          >
                            <BookOpen className="h-4 w-4" />
                            Google Scholar
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                        {member.github && (
                          <a
                            href={member.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-muted-foreground hover:text-accent transition-colors flex items-center gap-1"
                          >
                            GitHub
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                        {member.orcid && (
                          <a
                            href={`https://orcid.org/${member.orcid}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-muted-foreground hover:text-accent transition-colors flex items-center gap-1"
                          >
                            ORCID
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Stats */}
                    {((member.publications ?? 0) > 0 || (member.citations ?? 0) > 0 || (member.hIndex ?? 0) > 0) && (
                      <div className="flex flex-wrap gap-6 pt-4">
                        {(member.publications ?? 0) > 0 && (
                          <div>
                            <div className="text-3xl font-bold text-foreground">{member.publications}</div>
                            <div className="text-sm text-muted-foreground">发表论文</div>
                          </div>
                        )}
                        {(member.citations ?? 0) > 0 && (
                          <div>
                            <div className="text-3xl font-bold text-foreground">{member.citations}</div>
                            <div className="text-sm text-muted-foreground">总引用数</div>
                          </div>
                        )}
                        {(member.hIndex ?? 0) > 0 && (
                          <div>
                            <div className="text-3xl font-bold text-foreground">{member.hIndex}</div>
                            <div className="text-sm text-muted-foreground">H-Index</div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 md:py-16">
        <div className="container">
          <div className="max-w-5xl mx-auto space-y-8">
            {/* Personal Bio */}
            {member.bio && (
              <Card className="border-border/40">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-accent" />
                    个人简介
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{member.bio}</p>
                </CardContent>
              </Card>
            )}

            {/* Research Interests */}
            {researchInterests.length > 0 && (
              <Card className="border-border/40">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-accent" />
                    研究兴趣
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {researchInterests.map((interest: string, idx: number) => (
                      <Badge key={idx} variant="secondary" className="text-sm">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Research Areas */}
            {researchAreas.length > 0 && (
              <Card className="border-border/40">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-accent" />
                    研究方向
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {researchAreas.map((area: any, idx: number) => (
                      <li key={idx} className="flex gap-3">
                        <span className="text-accent font-semibold flex-shrink-0">•</span>
                        <div>
                          <div className="font-semibold text-foreground">{area.name}</div>
                          {area.description && (
                            <p className="text-sm text-muted-foreground mt-1">{area.description}</p>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Publications */}
            {publications && publications.length > 0 && (
              <Card className="border-border/40">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-accent" />
                    发表论文 ({publications.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {publications.map((pub, idx) => (
                      <div key={pub.id} className="pb-4 border-b border-border/40 last:border-0 last:pb-0">
                        <div className="flex gap-3">
                          <span className="text-muted-foreground font-mono text-sm flex-shrink-0">
                            [{idx + 1}]
                          </span>
                          <div className="flex-1 space-y-1">
                            <p className="text-foreground font-medium leading-relaxed">{pub.title}</p>
                            {pub.authors && (
                              <p className="text-sm text-muted-foreground">{pub.authors}</p>
                            )}
                            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                              {pub.journal && <span className="italic">{pub.journal}</span>}
                              {pub.year && <span>({pub.year})</span>}
                              {pub.journalTier && pub.journalTier !== "other" && (
                                <Badge variant="outline" className="text-xs">
                                  {pub.journalTier === "top" ? "顶级期刊" : pub.journalTier === "high" ? "高水平期刊" : ""}
                                </Badge>
                              )}
                            </div>
                            {pub.doi && (
                              <a
                                href={`https://doi.org/${pub.doi}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-accent hover:underline inline-flex items-center gap-1"
                              >
                                DOI: {pub.doi}
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Projects */}
            {projects.length > 0 && (
              <Card className="border-border/40">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-accent" />
                    项目经历
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {projects.map((project: any, idx: number) => (
                      <div key={idx} className="pb-6 border-b border-border/40 last:border-0 last:pb-0">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-foreground">{project.name}</h4>
                          {project.period && (
                            <span className="text-sm text-muted-foreground">{project.period}</span>
                          )}
                        </div>
                        {project.role && (
                          <p className="text-sm text-accent mb-2">{project.role}</p>
                        )}
                        {project.description && (
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {project.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Awards */}
            {awards.length > 0 && (
              <Card className="border-border/40">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-accent" />
                    获奖荣誉
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {awards.map((award: string, idx: number) => (
                      <li key={idx} className="flex gap-3 text-muted-foreground">
                        <span className="text-accent flex-shrink-0">•</span>
                        <span>{award}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Education */}
            {education.length > 0 && (
              <Card className="border-border/40">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-accent" />
                    教育经历
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {education.map((edu: any, idx: number) => (
                      <div key={idx} className="pb-4 border-b border-border/40 last:border-0 last:pb-0">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-semibold text-foreground">{edu.institution}</h4>
                          {edu.period && (
                            <span className="text-sm text-muted-foreground">{edu.period}</span>
                          )}
                        </div>
                        {edu.degree && (
                          <p className="text-sm text-accent">{edu.degree}</p>
                        )}
                        {edu.major && (
                          <p className="text-sm text-muted-foreground">{edu.major}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Work Experience */}
            {workExperience.length > 0 && (
              <Card className="border-border/40">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-accent" />
                    工作经历
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {workExperience.map((work: any, idx: number) => (
                      <div key={idx} className="pb-4 border-b border-border/40 last:border-0 last:pb-0">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-semibold text-foreground">{work.organization}</h4>
                          {work.period && (
                            <span className="text-sm text-muted-foreground">{work.period}</span>
                          )}
                        </div>
                        {work.position && (
                          <p className="text-sm text-accent mb-2">{work.position}</p>
                        )}
                        {work.description && (
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {work.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
