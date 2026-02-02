import { useRoute, useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { useEditMode } from "@/contexts/EditModeContext";
import { ArrowLeft, Edit2, X, Check, Upload } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ImageUpload } from "@/components/ImageUpload";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { safeJsonParse } from "@/lib/jsonParser";
import { ArrayEditor } from "@/components/ArrayEditor";

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
  const [avatarUploadOpen, setAvatarUploadOpen] = useState(false);
  
  // 数组编辑状态
  const [editingArrayField, setEditingArrayField] = useState<string | null>(null);
  const [editArrayValues, setEditArrayValues] = useState<Record<string, string[]>>({});

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

  // 数组字段编辑处理
  const startEditArray = (field: string, currentValue: string[]) => {
    setEditingArrayField(field);
    setEditArrayValues({ ...editArrayValues, [field]: currentValue });
  };

  const cancelEditArray = () => {
    setEditingArrayField(null);
    setEditArrayValues({});
  };

  const saveEditArray = async (field: string) => {
    if (!member) return;

    try {
      const newValue = editArrayValues[field] || [];
      await updateMemberMutation.mutateAsync({
        id: member.id,
        [field]: JSON.stringify(newValue),
      });
      toast.success("保存成功");
      setEditingArrayField(null);
      setEditArrayValues({});
      refetch();
    } catch (error) {
      toast.error("保存失败");
    }
  };

  const handleAvatarUpload = async (url: string) => {
    if (!member) return;
    try {
      await updateMemberMutation.mutateAsync({
        id: member.id,
        photoUrl: url,
      });
      toast.success("头像上传成功");
      setAvatarUploadOpen(false);
      refetch();
    } catch (error) {
      toast.error("头像上传失败");
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

  const interests = safeJsonParse(member.researchInterests, []);
  const awards = safeJsonParse(member.awards, []);

  // 判断是否为学生（博士生、硕士生、本科生）
  const isStudent = ["PhD", "Master", "Undergraduate"].includes(member.role);
  // 判断是否为老师（PI、博士后）
  const isTeacher = ["PI", "Postdoc"].includes(member.role);

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
                <div className="w-full aspect-square rounded-lg bg-gradient-to-br from-accent/20 to-chart-2/20 flex items-center justify-center overflow-hidden relative group">
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
                  {isEditMode && (
                    <button
                      onClick={() => setAvatarUploadOpen(true)}
                      className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg opacity-100 transition-opacity cursor-pointer"
                    >
                      <Upload className="w-6 h-6 text-white" />
                    </button>
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
                  </div>
                </div>

                {/* Custom Tags */}
                <div className="pt-4 space-y-3 border-t border-border">
                  {/* Birthday Tag - for all members */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-semibold text-foreground">
                        生日
                      </label>
                      {isEditMode && editingField !== "birthday" && (
                        <button
                          onClick={() => startEdit("birthday", member.birthday || "")}
                          className="text-xs text-accent hover:text-accent/80"
                        >
                          <Edit2 className="h-3 w-3" />
                        </button>
                      )}
                    </div>

                    {editingField === "birthday" ? (
                      <div className="space-y-2">
                        <input
                          type="date"
                          value={editValues["birthday"]}
                          onChange={(e) =>
                            setEditValues({ ...editValues, birthday: e.target.value })
                          }
                          className="w-full px-2 py-1 text-sm border border-border rounded bg-background"
                          autoFocus
                        />
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => saveEdit("birthday")}
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
                        {member.birthday || "未设置"}
                      </p>
                    )}
                  </div>

                  {/* Year Tag - for students only */}
                  {isStudent && (
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-semibold text-foreground">
                          年级
                        </label>
                        {isEditMode && editingField !== "year" && (
                          <button
                            onClick={() => startEdit("year", member.year || "")}
                            className="text-xs text-accent hover:text-accent/80"
                          >
                            <Edit2 className="h-3 w-3" />
                          </button>
                        )}
                      </div>

                      {editingField === "year" ? (
                        <div className="space-y-2">
                          <input
                            type="text"
                            value={editValues["year"]}
                            onChange={(e) =>
                              setEditValues({ ...editValues, year: e.target.value })
                            }
                            placeholder="例如：一年级、二年级"
                            className="w-full px-2 py-1 text-sm border border-border rounded bg-background"
                            autoFocus
                          />
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => saveEdit("year")}
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
                          {member.year || "未设置"}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Delete Button */}
                {isEditMode && (
                  <Button
                    onClick={handleDelete}
                    variant="destructive"
                    className="w-full mt-4"
                  >
                    删除成员
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right: Details */}
          <div className="md:col-span-2 space-y-6">
            {/* Bio */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">个人简介</h2>
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
                      placeholder="输入个人简介"
                      rows={4}
                      className="w-full px-3 py-2 text-sm border border-border rounded bg-background"
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <Button
                        onClick={() => saveEdit("bio")}
                        disabled={updateMemberMutation.isPending}
                        className="flex-1 gap-1"
                      >
                        <Check className="h-3 w-3" />
                        保存
                      </Button>
                      <Button
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
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {member.bio || "未设置"}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Research Interests */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">研究方向</h2>
                  {isEditMode && editingArrayField !== "researchInterests" && (
                    <button
                      onClick={() => startEditArray("researchInterests", interests)}
                      className="text-accent hover:text-accent/80"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {editingArrayField === "researchInterests" ? (
                  <div className="space-y-4">
                    <ArrayEditor
                      items={editArrayValues["researchInterests"] || interests}
                      onChange={(items) =>
                        setEditArrayValues({ ...editArrayValues, researchInterests: items })
                      }
                      placeholder="例如：光通信、光电子"
                      helpText="添加您的研究方向，每个方向为一项"
                    />
                    <div className="flex gap-2">
                      <Button
                        onClick={() => saveEditArray("researchInterests")}
                        disabled={updateMemberMutation.isPending}
                        className="flex-1 gap-1"
                      >
                        <Check className="h-3 w-3" />
                        保存
                      </Button>
                      <Button
                        variant="outline"
                        onClick={cancelEditArray}
                        className="flex-1 gap-1"
                      >
                        <X className="h-3 w-3" />
                        取消
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {interests.length > 0 ? (
                      interests.map((interest: string, idx: number) => (
                        <Badge key={idx} variant="secondary">
                          {interest}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">未设置</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Awards - only for students */}
            {isStudent && (
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">荣誉奖项</h2>
                    {isEditMode && editingArrayField !== "awards" && (
                      <button
                        onClick={() => startEditArray("awards", awards)}
                        className="text-accent hover:text-accent/80"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  {editingArrayField === "awards" ? (
                    <div className="space-y-4">
                      <ArrayEditor
                        items={editArrayValues["awards"] || awards}
                        onChange={(items) =>
                          setEditArrayValues({ ...editArrayValues, awards: items })
                        }
                        placeholder="例如：复旦大学KLA冠名奖学金"
                        helpText="添加您获得的荣誉和奖项"
                      />
                      <div className="flex gap-2">
                        <Button
                          onClick={() => saveEditArray("awards")}
                          disabled={updateMemberMutation.isPending}
                          className="flex-1 gap-1"
                        >
                          <Check className="h-3 w-3" />
                          保存
                        </Button>
                        <Button
                          variant="outline"
                          onClick={cancelEditArray}
                          className="flex-1 gap-1"
                        >
                          <X className="h-3 w-3" />
                          取消
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {awards.length > 0 ? (
                        awards.map((award: string, idx: number) => (
                          <Badge key={idx} variant="outline">
                            {award}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">未设置</p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Avatar Upload Dialog */}
        <Dialog open={avatarUploadOpen} onOpenChange={setAvatarUploadOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>上传成员头像</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <ImageUpload
                onUpload={handleAvatarUpload}
                disabled={updateMemberMutation.isPending}
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
