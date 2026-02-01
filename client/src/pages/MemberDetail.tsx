import { useRoute, useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { useEditMode } from "@/contexts/EditModeContext";
import { ArrowLeft, Mail, Globe, Github, Edit2, X, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function MemberDetail() {
  const [, params] = useRoute("/member/:id");
  const [, setLocation] = useLocation();
  const { isEditMode } = useEditMode();
  const memberId = params?.id ? parseInt(params.id) : null;

  const { data: member, isLoading, refetch } = trpc.lab.memberById.useQuery(
    { id: memberId! },
    { enabled: !!memberId }
  );

  const updateMemberMutation = trpc.lab.updateMember.useMutation();
  const deleteMemberMutation = trpc.lab.deleteMember.useMutation();

  // 编辑状态
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Record<string, string>>({});

  const startEdit = (field: string, currentValue: string) => {
    setEditingField(field);
    setEditValues({ ...editValues, [field]: currentValue || "" });
  };

  const cancelEdit = () => {
    setEditingField(null);
    setEditValues({});
  };

  const saveEdit = async (field: string) => {
    if (!member) return;

    try {
      await updateMemberMutation.mutateAsync({
        id: member.id,
        [field]: editValues[field],
      });
      toast.success("保存成功");
      setEditingField(null);
      setEditValues({});
      refetch();
    } catch (error) {
      toast.error("保存失败");
    }
  };

  const handleDelete = async () => {
    if (!member) return;

    if (!window.confirm("确定要删除这个团队成员吗？")) {
      return;
    }

    try {
      await deleteMemberMutation.mutateAsync({ id: member.id });
      toast.success("删除成功");
      setLocation("/team");
    } catch (error) {
      toast.error("删除失败");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen py-16">
        <div className="container">
          <div className="text-center">
            <p className="text-muted-foreground">加载中...</p>
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
            <p className="text-muted-foreground">成员不存在</p>
            <Button onClick={() => setLocation("/team")} className="mt-4">
              返回团队页面
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const interests = member.researchInterests ? JSON.parse(member.researchInterests) : [];
  const awards = member.awards ? JSON.parse(member.awards) : [];

  return (
    <div className="min-h-screen py-16">
      <div className="container max-w-4xl">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => setLocation("/team")}
          className="mb-6 gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          返回团队
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left: Avatar and Basic Info */}
          <div className="md:col-span-1">
            <Card>
              <CardContent className="p-6 space-y-4">
                {/* Avatar */}
                <div className="w-full aspect-square rounded-lg bg-gradient-to-br from-accent/20 to-chart-2/20 flex items-center justify-center overflow-hidden">
                  {member.photoUrl ? (
                    <img
                      src={member.photoUrl}
                      alt={member.nameCn}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-6xl font-bold text-accent/30">
                      {member.nameCn.charAt(0)}
                    </div>
                  )}
                </div>

                {/* Basic Info */}
                <div className="space-y-2">
                  <h1 className="text-2xl font-bold text-foreground">
                    {member.nameCn}
                  </h1>
                  <p className="text-sm text-muted-foreground">{member.nameEn}</p>

                  {/* Role Badge */}
                  <div className="flex gap-2 flex-wrap pt-2">
                    <Badge>{member.role}</Badge>
                    {member.title && <Badge variant="secondary">{member.title}</Badge>}
                    {member.year && <Badge variant="outline">{member.year}</Badge>}
                  </div>

                  {/* Custom Tags */}
                  <div className="pt-4 space-y-3 border-t border-border">
                    {/* Identity Tag */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-semibold text-foreground">
                          身份标签
                        </label>
                        {isEditMode && editingField !== "identity" && (
                          <button
                            onClick={() => startEdit("identity", member.identity || "")}
                            className="text-xs text-accent hover:text-accent/80"
                          >
                            <Edit2 className="h-3 w-3" />
                          </button>
                        )}
                      </div>

                      {editingField === "identity" ? (
                        <div className="space-y-2">
                          <input
                            type="text"
                            value={editValues["identity"]}
                            onChange={(e) =>
                              setEditValues({ ...editValues, identity: e.target.value })
                            }
                            placeholder="例如：研究员、访问学者"
                            className="w-full px-2 py-1 text-sm border border-border rounded bg-background"
                            autoFocus
                          />
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => saveEdit("identity")}
                              disabled={updateMemberMutation.isPending}
                              className="flex-1 gap-1"
                            >
                              <Check className="h-3 w-3" />
                              保存
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={cancelEdit}
                              className="flex-1 gap-1"
                            >
                              <X className="h-3 w-3" />
                              取消
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          {member.identity || "未设置"}
                        </p>
                      )}
                    </div>

                    {/* Grade Tag */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-semibold text-foreground">
                          年级标签
                        </label>
                        {isEditMode && editingField !== "grade" && (
                          <button
                            onClick={() => startEdit("grade", member.grade || "")}
                            className="text-xs text-accent hover:text-accent/80"
                          >
                            <Edit2 className="h-3 w-3" />
                          </button>
                        )}
                      </div>

                      {editingField === "grade" ? (
                        <div className="space-y-2">
                          <input
                            type="text"
                            value={editValues["grade"]}
                            onChange={(e) =>
                              setEditValues({ ...editValues, grade: e.target.value })
                            }
                            placeholder="例如：一年级、二年级"
                            className="w-full px-2 py-1 text-sm border border-border rounded bg-background"
                            autoFocus
                          />
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => saveEdit("grade")}
                              disabled={updateMemberMutation.isPending}
                              className="flex-1 gap-1"
                            >
                              <Check className="h-3 w-3" />
                              保存
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={cancelEdit}
                              className="flex-1 gap-1"
                            >
                              <X className="h-3 w-3" />
                              取消
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          {member.grade || "未设置"}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-2 pt-4 border-t border-border">
                    {member.email && (
                      <a
                        href={`mailto:${member.email}`}
                        className="flex items-center gap-2 text-sm text-accent hover:text-accent/80"
                      >
                        <Mail className="h-4 w-4" />
                        {member.email}
                      </a>
                    )}
                    {member.personalWebsite && (
                      <a
                        href={member.personalWebsite}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-accent hover:text-accent/80"
                      >
                        <Globe className="h-4 w-4" />
                        个人网站
                      </a>
                    )}
                    {member.github && (
                      <a
                        href={member.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-accent hover:text-accent/80"
                      >
                        <Github className="h-4 w-4" />
                        GitHub
                      </a>
                    )}
                  </div>

                  {/* Delete Button */}
                  {isEditMode && (
                    <Button
                      variant="destructive"
                      onClick={handleDelete}
                      className="w-full mt-4"
                      disabled={deleteMemberMutation.isPending}
                    >
                      {deleteMemberMutation.isPending ? "删除中..." : "删除成员"}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right: Detailed Info */}
          <div className="md:col-span-2 space-y-6">
            {/* Bio */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg font-bold text-foreground">个人简介</h2>
                  {isEditMode && editingField !== "bio" && (
                    <button
                      onClick={() => startEdit("bio", member.bio || "")}
                      className="text-accent hover:text-accent/80"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {editingField === "bio" ? (
                  <div className="space-y-2">
                    <textarea
                      value={editValues["bio"]}
                      onChange={(e) =>
                        setEditValues({ ...editValues, bio: e.target.value })
                      }
                      placeholder="输入个人简介..."
                      className="w-full h-32 px-3 py-2 border border-border rounded bg-background text-sm"
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <Button
                        onClick={() => saveEdit("bio")}
                        disabled={updateMemberMutation.isPending}
                        className="flex-1 gap-2"
                      >
                        <Check className="h-4 w-4" />
                        保存
                      </Button>
                      <Button
                        variant="outline"
                        onClick={cancelEdit}
                        className="flex-1 gap-2"
                      >
                        <X className="h-4 w-4" />
                        取消
                      </Button>
                    </div>
                  </div>
                ) : member.bio ? (
                  <p className="text-muted-foreground leading-relaxed">
                    {member.bio}
                  </p>
                ) : (
                  <p className="text-muted-foreground text-sm">未设置</p>
                )}
              </CardContent>
            </Card>

            {/* Research Interests */}
            {interests.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-lg font-bold text-foreground mb-3">
                    研究方向
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {interests.map((interest: string, idx: number) => (
                      <Badge key={idx} variant="secondary">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Stats */}
            {((member.publications ?? 0) > 0 ||
              (member.citations ?? 0) > 0 ||
              (member.hIndex ?? 0) > 0) && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-lg font-bold text-foreground mb-4">
                    学术统计
                  </h2>
                  <div className="grid grid-cols-3 gap-4">
                    {(member.publications ?? 0) > 0 && (
                      <div className="text-center">
                        <div className="text-2xl font-bold text-accent">
                          {member.publications}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          论文
                        </div>
                      </div>
                    )}
                    {(member.citations ?? 0) > 0 && (
                      <div className="text-center">
                        <div className="text-2xl font-bold text-accent">
                          {member.citations}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          引用
                        </div>
                      </div>
                    )}
                    {(member.hIndex ?? 0) > 0 && (
                      <div className="text-center">
                        <div className="text-2xl font-bold text-accent">
                          {member.hIndex}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          H-Index
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Awards */}
            {awards.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-lg font-bold text-foreground mb-3">
                    荣誉奖项
                  </h2>
                  <ul className="space-y-2">
                    {awards.map((award: string, idx: number) => (
                      <li key={idx} className="text-sm text-muted-foreground">
                        • {award}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
