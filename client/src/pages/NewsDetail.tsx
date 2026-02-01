import { useParams, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, ArrowLeft, Edit2, Trash2, Check, X } from "lucide-react";
import { useState } from "react";
import { useEditMode } from "@/contexts/EditModeContext";
import { toast } from "sonner";

export default function NewsDetail() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const { isEditMode } = useEditMode();
  const { data: news, isLoading, refetch } = trpc.lab.news.useQuery();
  
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Record<string, string>>({});
  
  const updateNewsMutation = trpc.lab.updateNews.useMutation({
    onSuccess: () => {
      toast.success("保存成功");
      setEditingField(null);
      refetch();
    },
    onError: () => {
      toast.error("保存失败");
    },
  });
  
  const deleteNewsMutation = trpc.lab.deleteNews.useMutation({
    onSuccess: () => {
      toast.success("删除成功");
      navigate("/news");
    },
    onError: () => {
      toast.error("删除失败");
    },
  });

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

  const newsItem = news?.find((n) => n.id === parseInt(id || "0"));

  if (!newsItem) {
    return (
      <div className="min-h-screen py-16">
        <div className="container">
          <div className="text-center">
            <p className="text-muted-foreground">新闻不存在</p>
            <Button onClick={() => navigate("/news")} variant="outline" className="mt-4">
              返回新闻列表
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const handleEdit = (field: string, value: string) => {
    setEditingField(field);
    setEditValues({ [field]: value });
  };

  const handleSave = async (field: string) => {
    const value = editValues[field];
    if (value === undefined || value === null) return;

    await updateNewsMutation.mutateAsync({
      id: newsItem.id,
      [field]: value,
    });
  };

  const handleCancel = () => {
    setEditingField(null);
    setEditValues({});
  };

  const handleDelete = async () => {
    if (confirm("确定要删除这条新闻吗？")) {
      await deleteNewsMutation.mutateAsync({ id: newsItem.id });
    }
  };

  const renderEditableField = (field: string, value: string, label: string, isTextarea = false) => {
    const isEditing = editingField === field;

    if (isEditing && isEditMode) {
      return (
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">{label}</label>
          {isTextarea ? (
            <textarea
              value={editValues[field] || value}
              onChange={(e) => setEditValues({ ...editValues, [field]: e.target.value })}
              className="w-full min-h-32 p-3 rounded-lg border border-input bg-background text-foreground"
              placeholder={`输入${label}`}
            />
          ) : (
            <input
              type="text"
              value={editValues[field] || value}
              onChange={(e) => setEditValues({ ...editValues, [field]: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground"
              placeholder={`输入${label}`}
            />
          )}
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={() => handleSave(field)}
              disabled={updateNewsMutation.isPending}
              className="bg-green-600 hover:bg-green-700"
            >
              <Check className="h-4 w-4 mr-1" />
              保存
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleCancel}
              disabled={updateNewsMutation.isPending}
            >
              <X className="h-4 w-4 mr-1" />
              取消
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="flex items-start justify-between group">
        <div className="flex-1">
          <label className="text-sm font-medium text-muted-foreground block mb-2">{label}</label>
          <p className="text-foreground whitespace-pre-wrap">{value || "未设置"}</p>
        </div>
        {isEditMode && (
          <button
            onClick={() => handleEdit(field, value)}
            className="ml-4 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-accent/10"
          >
            <Edit2 className="h-4 w-4 text-accent" />
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen py-16 bg-background">
      <div className="container max-w-4xl">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate("/news")}
          className="mb-8 -ml-2"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          返回新闻列表
        </Button>

        {/* News Detail Card */}
        <Card className="border-border/40">
          <CardContent className="p-8 space-y-8">
            {/* Header Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 flex-wrap">
                {newsItem.category && (
                  <Badge variant="default" className="bg-accent text-accent-foreground">
                    {newsItem.category}
                  </Badge>
                )}
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(newsItem.publishedAt).toLocaleDateString("zh-CN")}</span>
                </div>
                {newsItem.author && (
                  <span className="text-sm text-muted-foreground">作者：{newsItem.author}</span>
                )}
              </div>

              {/* Title */}
              {editingField === "title" && isEditMode ? (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">标题</label>
                  <input
                    type="text"
                    value={editValues["title"] !== undefined ? editValues["title"] : newsItem.title}
                    onChange={(e) => setEditValues({ ...editValues, "title": e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground text-4xl font-bold"
                    placeholder="输入标题"
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleSave("title")}
                      disabled={updateNewsMutation.isPending}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Check className="h-4 w-4 mr-1" />
                      保存
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleCancel}
                      disabled={updateNewsMutation.isPending}
                    >
                      <X className="h-4 w-4 mr-1" />
                      取消
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2 group">
                  <h1 className="text-4xl font-bold text-foreground">{newsItem.title}</h1>
                  {isEditMode && (
                    <button
                      onClick={() => handleEdit("title", newsItem.title)}
                      className="text-sm text-accent hover:underline flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Edit2 className="h-3 w-3" />
                      编辑标题
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="border-t border-border" />

            {/* Content Fields */}
            <div className="space-y-8">
              {renderEditableField("category", newsItem.category || "", "分类")}
              {renderEditableField("author", newsItem.author || "", "作者")}
              {renderEditableField("summary", newsItem.summary || "", "摘要")}
              {renderEditableField("content", newsItem.content || "", "内容", true)}
            </div>

            {/* Delete Button */}
            {isEditMode && (
              <div className="pt-4 border-t border-border">
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={deleteNewsMutation.isPending}
                  className="w-full"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  删除新闻
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
