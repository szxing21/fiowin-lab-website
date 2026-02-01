import { useState, useRef, useEffect } from "react";
import { useEditMode } from "@/contexts/EditModeContext";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Pencil, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EditableTextProps {
  slug: string;
  field: string;
  content: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p" | "div";
}

export function EditableText({
  slug,
  field,
  content,
  className = "",
  as: Component = "p",
}: EditableTextProps) {
  const { isEditMode } = useEditMode();
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(content);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const updatePageMutation = trpc.admin.savePage.useMutation();

  useEffect(() => {
    setEditValue(content);
  }, [content]);

  const handleSave = async () => {
    if (editValue === content) {
      setIsEditing(false);
      return;
    }

    try {
      await updatePageMutation.mutateAsync({
        slug,
        title: slug,
        contentHtml: editValue,
      });
      toast.success("内容已保存");
      setIsEditing(false);
    } catch (error) {
      toast.error("保存失败");
    }
  };

  const handleCancel = () => {
    setEditValue(content);
    setIsEditing(false);
  };

  if (!isEditMode) {
    return (
      <Component className={className}>
        {content}
      </Component>
    );
  }

  if (isEditing) {
    return (
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          className={`w-full p-2 border-2 border-blue-400 rounded resize-none ${className}`}
          rows={Math.max(3, editValue.split("\n").length)}
          autoFocus
        />
        <div className="flex gap-2 mt-2">
          <Button
            size="sm"
            onClick={handleSave}
            disabled={updatePageMutation.isPending}
            className="bg-green-500 hover:bg-green-600"
          >
            <Check className="w-4 h-4" />
            保存
          </Button>
          <Button
            size="sm"
            onClick={handleCancel}
            variant="outline"
          >
            <X className="w-4 h-4" />
            取消
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative">
      <Component className={`${className} group-hover:bg-blue-50 transition-colors`}>
        {content}
      </Component>
      <button
        onClick={() => setIsEditing(true)}
        className="absolute top-0 right-0 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
        title="编辑"
      >
        <Pencil className="w-4 h-4 text-blue-500" />
      </button>
    </div>
  );
}
