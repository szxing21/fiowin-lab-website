import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface AddMemberDialogProps {
  role: string;
  onMemberAdded?: () => void;
}

export function AddMemberDialog({ role, onMemberAdded }: AddMemberDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    nameCn: "",
    nameEn: "",
    title: "",
    year: "",
  });

  const createMemberMutation = trpc.lab.createMember.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nameCn || !formData.nameEn) {
      toast.error("请填写中文名和英文名");
      return;
    }

    try {
      await createMemberMutation.mutateAsync({
        nameCn: formData.nameCn,
        nameEn: formData.nameEn,
        role: role as any,
        title: formData.title || undefined,
        year: formData.year || undefined,
      });

      toast.success("成员添加成功");
      setOpen(false);
      setFormData({ nameCn: "", nameEn: "", title: "", year: "" });
      onMemberAdded?.();
    } catch (error) {
      toast.error("添加成员失败");
    }
  };

  const isStudent = ["PhD", "Master", "Undergraduate"].includes(role);
  const isTeacher = ["PI", "Postdoc"].includes(role);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="gap-2">
          + 添加成员
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>添加新成员</DialogTitle>
          <DialogDescription>
            为 {role} 分类添加新的团队成员
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">中文名 *</label>
            <Input
              value={formData.nameCn}
              onChange={(e) =>
                setFormData({ ...formData, nameCn: e.target.value })
              }
              placeholder="例如：张三"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium">英文名 *</label>
            <Input
              value={formData.nameEn}
              onChange={(e) =>
                setFormData({ ...formData, nameEn: e.target.value })
              }
              placeholder="例如：Zhang San"
              required
            />
          </div>

          {isTeacher && (
            <div>
              <label className="text-sm font-medium">职位</label>
              <Input
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="例如：教授、副教授"
              />
            </div>
          )}

          {isStudent && (
            <div>
              <label className="text-sm font-medium">年级</label>
              <Input
                value={formData.year}
                onChange={(e) =>
                  setFormData({ ...formData, year: e.target.value })
                }
                placeholder="例如：一年级、二年级"
              />
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <Button
              type="submit"
              disabled={createMemberMutation.isPending}
              className="flex-1"
            >
              {createMemberMutation.isPending ? "添加中..." : "添加成员"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1"
            >
              取消
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
