import { useParams, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, ArrowLeft, Edit2, Trash2, Check, X, Upload, Trash } from "lucide-react";
import { useState } from "react";
import { useEditMode } from "@/contexts/EditModeContext";
import { toast } from "sonner";
import { ImageUpload } from "@/components/ImageUpload";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function NewsDetail() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const { isEditMode } = useEditMode();
  const { data: news, isLoading, refetch } = trpc.lab.news.useQuery();
  
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Record<string, string>>({});
  const [imageUploadOpen, setImageUploadOpen] = useState(false);
  
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

  const handleImageUpload = async (url: string) => {
    const currentImages = newsItem?.images ? JSON.parse(newsItem.images) : [];
    const newImages = [...currentImages, url];
    try {
      await updateNewsMutation.mutateAsync({
        id: newsItem.id,
        images: JSON.stringify(newImages),
      });
      toast.success("图片上传成功");
      setImageUploadOpen(false);
      await refetch();
    } catch (error) {
      toast.error("图片上传失败");
    }
  };

  const handleDeleteImage = async (index: number) => {
    const currentImages = newsItem?.images ? JSON.parse(newsItem.images) : [];
    const newImages = currentImages.filter((_: string, i: number) => i !== index);
    await updateNewsMutation.mutateAsync({
      id: newsItem.id,
      images: JSON.stringify(newImages),
    });
    toast.success("图片删除成功");
    refetch();
  };

  const renderEditableField = (field: string, value: string, label: string, isTextarea = false) => {
    const isEditing = editingField === field;

    if (isEditing && isEditMode) {
      return (
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">{label}</label>
          {isTextarea ? (
            <textarea
              value={editValues[field] !== undefined ? editValues[field] : value}
              onChange={(e) => setEditValues({ ...editValues, [field]: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground"
              placeholder={`输入${label}`}
              rows={5}
              autoFocus
            />
          ) : (
            <input
              type="text"
              value={editValues[field] !== undefined ? editValues[field] : value}
              onChange={(e) => setEditValues({ ...editValues, [field]: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground"
              placeholder={`输入${label}`}
              autoFocus
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
      <div className="space-y-2 group">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-foreground">{value || "未设置"}</p>
          </div>
        </div>
        {isEditMode && (
          <button
            onClick={() => handleEdit(field, value)}
            className="ml-4 p-2 rounded-lg transition-all hover:bg-accent/20 hover:scale-110"
            title="点击编辑"
          >
            <Edit2 className="h-4 w-4 text-accent" />
          </button>
        )}
      </div>
    );
  };

  const images = newsItem?.images ? JSON.parse(newsItem.images) : [];

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
                      className="text-sm text-accent hover:underline flex items-center gap-1 opacity-100"
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

            {/* Images Section */}
            {images.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">新闻图片</h2>
                  {isEditMode && (
                    <button
                      onClick={() => setImageUploadOpen(true)}
                      className="flex items-center gap-1 text-sm text-accent hover:underline"
                    >
                      <Upload className="h-4 w-4" />
                      添加图片
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {images.map((image: string, index: number) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`News image ${index + 1}`}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      {isEditMode && (
                        <button
                          onClick={() => handleDeleteImage(index)}
                          className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Add Images Button */}
            {isEditMode && images.length === 0 && (
              <button
                onClick={() => setImageUploadOpen(true)}
                className="w-full py-8 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center gap-2 hover:bg-accent/5 transition-colors"
              >
                <Upload className="h-8 w-8 text-muted-foreground" />
                <span className="text-muted-foreground">点击添加新闻图片</span>
              </button>
            )}

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

        {/* Image Upload Dialog */}
        <Dialog open={imageUploadOpen} onOpenChange={setImageUploadOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>上传新闻图片</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <ImageUpload
                onUpload={handleImageUpload}
                disabled={updateNewsMutation.isPending}
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
