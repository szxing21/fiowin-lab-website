import { useState } from "react";
import { Edit2, Save, X, Trash2 } from "lucide-react";
import { useEditMode } from "@/contexts/EditModeContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface EditablePublicationProps {
  id: number;
  title: string;
  authors: string;
  journal: string;
  year: number;
  url?: string;
  type: "journal" | "conference";
  journalTier?: string;
  onUpdate?: () => void;
  onDelete?: () => void;
}

export function EditablePublication({
  id,
  title,
  authors,
  journal,
  year,
  url,
  type,
  journalTier,
  onUpdate,
  onDelete,
}: EditablePublicationProps) {
  const { isEditMode } = useEditMode();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title,
    authors,
    journal,
    year: year.toString(),
    url: url || "",
    type,
    journalTier: journalTier || "other",
  });

  const updateMutation = trpc.lab.updatePublication.useMutation({
    onSuccess: () => {
      toast.success("论文已更新");
      setIsEditing(false);
      onUpdate?.();
    },
    onError: (error) => {
      toast.error(`更新失败: ${error.message}`);
    },
  });

  const deleteMutation = trpc.lab.deletePublication.useMutation({
    onSuccess: () => {
      toast.success("论文已删除");
      onDelete?.();
    },
    onError: (error) => {
      toast.error(`删除失败: ${error.message}`);
    },
  });

  const handleSave = async () => {
    await updateMutation.mutateAsync({
      id,
      title: editData.title,
      authors: editData.authors,
      journal: editData.journal,
      year: parseInt(editData.year),
      url: editData.url || undefined,
      type: editData.type as "journal" | "conference",
      journalTier: editData.journalTier,
    });
  };

  const handleDelete = async () => {
    if (confirm("确定要删除这篇论文吗？")) {
      await deleteMutation.mutateAsync({ id });
    }
  };

  if (isEditMode && isEditing) {
    return (
      <div className="p-4 rounded-lg bg-card border-2 border-accent space-y-4">
        <div>
          <label className="text-sm font-semibold text-foreground">论文标题</label>
          <Input
            value={editData.title}
            onChange={(e) => setEditData({ ...editData, title: e.target.value })}
            placeholder="输入论文标题"
            className="mt-1"
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-foreground">作者</label>
          <Textarea
            value={editData.authors}
            onChange={(e) => setEditData({ ...editData, authors: e.target.value })}
            placeholder="输入作者信息"
            className="mt-1"
            rows={2}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-semibold text-foreground">期刊/会议</label>
            <Input
              value={editData.journal}
              onChange={(e) => setEditData({ ...editData, journal: e.target.value })}
              placeholder="输入期刊或会议名称"
              className="mt-1"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-foreground">发表年份</label>
            <Input
              type="number"
              value={editData.year}
              onChange={(e) => setEditData({ ...editData, year: e.target.value })}
              placeholder="输入年份"
              className="mt-1"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold text-foreground">论文链接</label>
          <Input
            value={editData.url}
            onChange={(e) => setEditData({ ...editData, url: e.target.value })}
            placeholder="输入论文链接（可选）"
            className="mt-1"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-semibold text-foreground">类型</label>
            <select
              value={editData.type}
              onChange={(e) => setEditData({ ...editData, type: e.target.value as "journal" | "conference" })}
              className="w-full mt-1 px-3 py-2 rounded-md border border-input bg-background text-foreground"
            >
              <option value="journal">期刊论文</option>
              <option value="conference">会议论文</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-semibold text-foreground">期刊等级</label>
            <select
              value={editData.journalTier}
              onChange={(e) => setEditData({ ...editData, journalTier: e.target.value })}
              className="w-full mt-1 px-3 py-2 rounded-md border border-input bg-background text-foreground"
            >
              <option value="top">顶级</option>
              <option value="high">高水平</option>
              <option value="medium">中等</option>
              <option value="other">其他</option>
            </select>
          </div>
        </div>

        <div className="flex gap-2 justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setIsEditing(false);
              setEditData({ title, authors, journal, year: year.toString(), url: url || "", type, journalTier: journalTier || "other" });
            }}
            disabled={updateMutation.isPending}
          >
            <X className="w-4 h-4 mr-1" />
            取消
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            disabled={updateMutation.isPending}
          >
            <Save className="w-4 h-4 mr-1" />
            保存
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="group p-4 rounded-lg bg-card hover:bg-accent/5 transition-colors duration-200 relative">
      {isEditMode && (
        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(true)}
            className="h-8 w-8 p-0"
          >
            <Edit2 className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
            disabled={deleteMutation.isPending}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      )}
      
      <div className="flex gap-4">
        <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-accent text-accent-foreground font-semibold text-sm">
          {/* Index will be provided by parent */}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-foreground/80 leading-relaxed font-mono break-words">
            [{year}] {authors}, "{title}," {type === "conference" ? `in Proc. ${journal}` : journal}, {year}.
          </p>
          {url && (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 mt-2 text-xs text-accent hover:text-accent/80 transition-colors"
            >
              查看论文
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
