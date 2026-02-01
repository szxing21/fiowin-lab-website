import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GeometricDecoration } from "@/components/GeometricDecoration";
import { trpc } from "@/lib/trpc";
import { Calendar, Edit2, Trash2 } from "lucide-react";
import { EditableText } from "@/components/EditableText";
import { useEditMode } from "@/contexts/EditModeContext";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function News() {
  const { isEditMode } = useEditMode();
  const [, navigate] = useLocation();
  const { data: news, isLoading, refetch } = trpc.lab.news.useQuery();
  
  const deleteNewsMutation = trpc.lab.deleteNews.useMutation({
    onSuccess: () => {
      toast.success("删除成功");
      refetch();
    },
    onError: () => {
      toast.error("删除失败");
    },
  });
  
  const handleDelete = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("确定要删除这条新闻吗？")) {
      await deleteNewsMutation.mutateAsync({ id });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4">新闻动态</h1>
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
                slug="news-title"
                field="title"
                content="新闻动态"
                className="text-4xl md:text-6xl font-bold text-foreground"
                as="h1"
              />
            ) : (
              <h1 className="text-4xl md:text-6xl font-bold text-foreground">新闻动态</h1>
            )}
            {isEditMode ? (
              <EditableText
                slug="news-description"
                field="content"
                content="了解实验室的最新进展、团队活动、获奖信息和学术交流"
                className="text-lg text-muted-foreground leading-relaxed"
              />
            ) : (
              <p className="text-lg text-muted-foreground leading-relaxed">
                了解实验室的最新进展、团队活动、获奖信息和学术交流
              </p>
            )}
          </div>
        </div>
      </section>

      {/* News List */}
      <section className="py-16">
        <div className="container">
          <div className="max-w-4xl mx-auto space-y-6">
            {news?.map((item) => (
              <Card
                key={item.id}
                className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/40 cursor-pointer"
                onClick={() => navigate(`/news/${item.id}`)}
              >
                <CardContent className="p-8 space-y-4 relative">
                  <div className="flex items-center gap-3 flex-wrap">
                    {item.category && (
                      <Badge variant="default" className="bg-accent text-accent-foreground">
                        {item.category}
                      </Badge>
                    )}
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(item.publishedAt).toLocaleDateString("zh-CN")}</span>
                    </div>
                    {item.author && (
                      <span className="text-sm text-muted-foreground">作者：{item.author}</span>
                    )}
                  </div>
                  <h2 className="text-2xl font-bold text-foreground group-hover:text-accent transition-colors">
                    {item.title}
                  </h2>
                  {item.summary && (
                    <p className="text-base text-muted-foreground leading-relaxed">{item.summary}</p>
                  )}
                  {item.content && (
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                      {item.content}
                    </p>
                  )}
                  {isEditMode && (
                    <div className="flex gap-2 mt-4 pt-4 border-t border-border/40">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/news/${item.id}`);
                        }}
                      >
                        <Edit2 className="h-4 w-4 mr-1" />
                        编辑
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={(e) => handleDelete(item.id, e)}
                        disabled={deleteNewsMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        删除
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {news?.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">暂无新闻动态</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
