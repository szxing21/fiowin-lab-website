import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GeometricDecoration } from "@/components/GeometricDecoration";
import { trpc } from "@/lib/trpc";
import { Award, BookOpen, Calendar, TrendingUp, Users } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function Analytics() {
  const { data: members } = trpc.lab.members.useQuery();
  const { data: publications } = trpc.lab.publications.useQuery();
  const { data: conferences } = trpc.lab.conferences.useQuery();
  const { data: news } = trpc.lab.news.useQuery();

  // Member statistics by role
  const membersByRole = members?.reduce((acc, member) => {
    const role = member.role || "Other";
    acc[role] = (acc[role] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const memberRoleData = Object.entries(membersByRole || {}).map(([role, count]) => {
    const roleLabels: Record<string, string> = {
      PI: "导师",
      Postdoc: "博士后",
      PhD: "博士生",
      Master: "硕士生",
      Member: "团队成员",
    };
    return {
      name: roleLabels[role] || role,
      value: count,
    };
  });

  // Publications by year
  const pubsByYear = publications?.reduce((acc, pub) => {
    const year = pub.year;
    acc[year] = (acc[year] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  const pubYearData = Object.entries(pubsByYear || {})
    .map(([year, count]) => ({
      year: parseInt(year),
      count,
    }))
    .sort((a, b) => a.year - b.year);

  // Publications by type
  const pubsByType = publications?.reduce((acc, pub) => {
    const type = pub.type || "other";
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pubTypeData = Object.entries(pubsByType || {}).map(([type, count]) => {
    const typeLabels: Record<string, string> = {
      journal: "期刊论文",
      conference: "会议论文",
      patent: "专利",
      other: "其他",
    };
    return {
      name: typeLabels[type] || type,
      value: count,
    };
  });

  // Conference statistics by year
  const confsByYear = conferences?.reduce((acc, conf) => {
    const year = conf.year;
    const papers = conf.papers || 0;
    const oral = conf.oral || 0;
    const poster = conf.poster || 0;
    const invited = conf.invited || 0;

    if (!acc[year]) {
      acc[year] = { year, papers: 0, oral: 0, poster: 0, invited: 0 };
    }

    acc[year].papers += papers;
    acc[year].oral += oral;
    acc[year].poster += poster;
    acc[year].invited += invited;

    return acc;
  }, {} as Record<number, { year: number; papers: number; oral: number; poster: number; invited: number }>);

  const confYearData = Object.values(confsByYear || {}).sort((a, b) => a.year - b.year);

  // News by category
  const newsByCategory = news?.reduce((acc, item) => {
    const category = item.category || "其他";
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const newsCategoryData = Object.entries(newsByCategory || {}).map(([category, count]) => ({
    name: category,
    value: count,
  }));

  // Color palette matching Scandinavian theme
  const COLORS = ["oklch(0.7 0.1 200)", "oklch(0.75 0.1 340)", "oklch(0.4 0.01 220)", "oklch(0.6 0.08 200)", "oklch(0.65 0.08 340)"];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <GeometricDecoration variant="hero" />
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground">实验室数据分析</h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              通过交互式图表深入了解实验室的团队构成、研究成果和学术活动趋势
            </p>
          </div>
        </div>
      </section>

      {/* Key Metrics */}
      <section className="py-8 bg-card">
        <div className="container">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-border/40">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-accent/20 to-chart-2/20 flex items-center justify-center">
                  <Users className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-foreground">{members?.length || 0}</div>
                  <div className="text-sm text-muted-foreground">团队成员</div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/40">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-accent/20 to-chart-2/20 flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-foreground">{publications?.length || 0}</div>
                  <div className="text-sm text-muted-foreground">研究成果</div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/40">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-accent/20 to-chart-2/20 flex items-center justify-center">
                  <Award className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-foreground">{conferences?.length || 0}</div>
                  <div className="text-sm text-muted-foreground">学术会议</div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/40">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-accent/20 to-chart-2/20 flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-foreground">{news?.length || 0}</div>
                  <div className="text-sm text-muted-foreground">新闻动态</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Charts Section */}
      <section className="py-16">
        <div className="container space-y-12">
          {/* Team Composition */}
          <Card className="border-border/40">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-accent" />
                团队成员构成
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={memberRoleData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {memberRoleData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Publications Trend */}
          <Card className="border-border/40">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-accent" />
                研究成果年度趋势
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={pubYearData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.88 0.005 210)" />
                  <XAxis dataKey="year" stroke="oklch(0.5 0.01 220)" />
                  <YAxis stroke="oklch(0.5 0.01 220)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "oklch(1 0 0)",
                      border: "1px solid oklch(0.88 0.005 210)",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="count" name="论文数量" stroke="oklch(0.7 0.1 200)" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Publications by Type */}
          <Card className="border-border/40">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-accent" />
                研究成果类型分布
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={pubTypeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.88 0.005 210)" />
                  <XAxis dataKey="name" stroke="oklch(0.5 0.01 220)" />
                  <YAxis stroke="oklch(0.5 0.01 220)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "oklch(1 0 0)",
                      border: "1px solid oklch(0.88 0.005 210)",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="value" name="数量" fill="oklch(0.75 0.1 340)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Conference Participation */}
          <Card className="border-border/40">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-accent" />
                学术会议参与情况
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={confYearData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.88 0.005 210)" />
                  <XAxis dataKey="year" stroke="oklch(0.5 0.01 220)" />
                  <YAxis stroke="oklch(0.5 0.01 220)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "oklch(1 0 0)",
                      border: "1px solid oklch(0.88 0.005 210)",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="papers" name="录用论文" fill="oklch(0.7 0.1 200)" />
                  <Bar dataKey="oral" name="口头报告" fill="oklch(0.75 0.1 340)" />
                  <Bar dataKey="poster" name="海报展示" fill="oklch(0.6 0.08 200)" />
                  <Bar dataKey="invited" name="邀请报告" fill="oklch(0.65 0.08 340)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* News by Category */}
          <Card className="border-border/40">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-accent" />
                新闻动态类别分布
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={newsCategoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {newsCategoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
