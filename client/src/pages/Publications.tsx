import { trpc } from "@/lib/trpc";
import { ExternalLink, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { EditableText } from "@/components/EditableText";
import { EditablePublication } from "@/components/EditablePublication";
import { useEditMode } from "@/contexts/EditModeContext";
import { GeometricDecoration } from "@/components/GeometricDecoration";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const JOURNAL_TIER_ORDER = { top: 0, high: 1, medium: 2, other: 3 };

export default function Publications() {
  const { isEditMode } = useEditMode();
  const { data: publications, isLoading, refetch } = trpc.lab.publications.useQuery();
  const [key, setKey] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    authors: "",
    journal: "",
    year: new Date().getFullYear(),
    url: "",
    type: "journal" as "journal" | "conference",
    journalTier: "other",
  });

  const createPublicationMutation = trpc.lab.createPublication.useMutation({
    onSuccess: () => {
      toast.success("新增成功");
      setFormData({
        title: "",
        authors: "",
        journal: "",
        year: new Date().getFullYear(),
        url: "",
        type: "journal",
        journalTier: "other",
      });
      setIsDialogOpen(false);
      refetch();
      setKey(k => k + 1);
    },
    onError: () => {
      toast.error("新增失败");
    },
  });

  const handleCreatePublication = async () => {
    if (!formData.title.trim()) {
      toast.error("请输入论文标题");
      return;
    }
    await createPublicationMutation.mutateAsync({
      title: formData.title,
      authors: formData.authors,
      journal: formData.journal,
      year: formData.year,
      url: formData.url,
      type: formData.type,
      journalTier: formData.journalTier,
    });
  };

  // Sort publications by journal tier and year (descending)
  const sortedPublications = useMemo(() => {
    if (!publications) return [];
    return [...publications].sort((a, b) => {
      const tierA = JOURNAL_TIER_ORDER[a.journalTier as keyof typeof JOURNAL_TIER_ORDER] ?? 3;
      const tierB = JOURNAL_TIER_ORDER[b.journalTier as keyof typeof JOURNAL_TIER_ORDER] ?? 3;
      const tierDiff = tierA - tierB;
      if (tierDiff !== 0) return tierDiff;
      return (b.year || 0) - (a.year || 0);
    });
  }, [publications]);

  // Group publications by year
  const publicationsByYear = useMemo(() => {
    const grouped: Record<number, typeof sortedPublications> = {};
    sortedPublications.forEach((pub) => {
      const year = pub.year || 0;
      if (!grouped[year]) {
        grouped[year] = [];
      }
      if (grouped[year]) {
        grouped[year].push(pub);
      }
    });
    return grouped;
  }, [sortedPublications]);

  const years = useMemo(() => {
    return Object.keys(publicationsByYear)
      .map(Number)
      .sort((a, b) => b - a);
  }, [publicationsByYear]);

  const getCitationFormat = (pub: any, index: number) => {
    const authors = pub.authors || "Unknown Authors";
    const title = pub.title || "Untitled";
    const journal = pub.journal || "Unknown Journal";
    const year = pub.year || "N/A";

    if (pub.type === "conference") {
      return `[${index}] ${authors}, "${title}," in Proc. ${journal}, ${year}.`;
    } else {
      return `[${index}] ${authors}, "${title}," ${journal}, ${year}.`;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4">研究成果</h1>
            <p className="text-lg text-muted-foreground">加载中...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16 bg-background">
      <GeometricDecoration />
      <div className="container relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          {isEditMode ? (
            <EditableText
              slug="publications-title"
              field="title"
              content="研究成果"
              className="text-4xl md:text-6xl font-bold text-foreground mb-4"
              as="h1"
            />
          ) : (
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4">研究成果</h1>
          )}
          {isEditMode ? (
            <EditableText
              slug="publications-description"
              field="content"
              content="我们的研究成果发表在Nature Communications等国际顶级期刊和会议上，推动光通信领域的技术进步"
              className="text-lg text-muted-foreground max-w-2xl mx-auto"
            />
          ) : (
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              我们的研究成果发表在Nature Communications等国际顶级期刊和会议上，推动光通信领域的技术进步
            </p>
          )}
        </div>

        {/* Publications List */}
        <div className="max-w-4xl mx-auto">
          {isEditMode && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full bg-accent hover:bg-accent/90 mb-6">
                  <Plus className="h-4 w-4 mr-2" />
                  新增研究成果
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>新增研究成果</DialogTitle>
                  <DialogDescription>填写论文信息</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">标题 *</label>
                    <Input
                      placeholder="输入论文标题"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">作者</label>
                    <Input
                      placeholder="输入作者名称（用逗号分隔）"
                      value={formData.authors}
                      onChange={(e) => setFormData({ ...formData, authors: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">期刊/会议名称</label>
                    <Input
                      placeholder="输入期刊或会议名称"
                      value={formData.journal}
                      onChange={(e) => setFormData({ ...formData, journal: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">年份</label>
                    <Input
                      type="number"
                      placeholder="输入发表年份"
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) || new Date().getFullYear() })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">类型</label>
                    <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value as "journal" | "conference" })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="journal">期刊论文</SelectItem>
                        <SelectItem value="conference">会议论文</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">期刊等级</label>
                    <Select value={formData.journalTier} onValueChange={(value) => setFormData({ ...formData, journalTier: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="other">未分类</SelectItem>
                        <SelectItem value="top">Top</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">链接</label>
                    <Input
                      placeholder="输入论文链接（可选）"
                      value={formData.url}
                      onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    />
                  </div>
                  <Button
                    onClick={handleCreatePublication}
                    disabled={createPublicationMutation.isPending}
                    className="w-full"
                  >
                    {createPublicationMutation.isPending ? "创建中..." : "创建"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
          {years.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">暂无论文数据</p>
            </div>
          ) : (
            years.map((year) => {
              const pubs = publicationsByYear[year];
              let citationIndex = 1;

              // Calculate starting index for this year
              for (const y of years) {
                if (y >= year) break;
                citationIndex += publicationsByYear[y].length;
              }

              return (
                <div key={year} className="mb-12">
                  <h2 className="text-2xl font-bold text-foreground mb-6 pb-3 border-b-2 border-accent">
                    {year}
                  </h2>
                  <div className="space-y-4">
                    {pubs && Array.isArray(pubs) && pubs.map((pub, idx) => {
                      const currentIndex = citationIndex + idx;
                      return (
                        <EditablePublication
                          key={`${pub.id}-${key}`}
                          id={pub.id}
                          title={pub.title || ""}
                          authors={pub.authors || ""}
                          journal={pub.journal || ""}
                          year={pub.year || 0}
                          url={pub.url}
                          type={pub.type as "journal" | "conference"}
                          journalTier={pub.journalTier}
                          onUpdate={() => {
                            refetch();
                            setKey(k => k + 1);
                          }}
                          onDelete={() => {
                            refetch();
                            setKey(k => k + 1);
                          }}
                        />
                      );
                    })}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer note */}
        <div className="mt-16 pt-8 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            总计 {sortedPublications.length} 篇论文 | 期刊论文 {sortedPublications.filter(p => p.type === 'journal').length} 篇 | 会议论文 {sortedPublications.filter(p => p.type === 'conference').length} 篇
          </p>
        </div>
      </div>
    </div>
  );
}
