import { useState, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { Bold, Italic, List, Link2, Image as ImageIcon, Save } from "lucide-react";

const EDITABLE_PAGES = [
  { slug: "about", label: "关于实验室" },
  { slug: "research-overview", label: "研究方向简介" },
  { slug: "contact", label: "联系我们" },
];

export default function AdminEditor() {
  const [selectedPage, setSelectedPage] = useState("about");
  const [pageTitle, setPageTitle] = useState("");
  const [, setLocation] = useLocation();
  
  const getPageQuery = trpc.lab.pageBySlug.useQuery({ slug: selectedPage });
  const savePageMutation = trpc.admin.savePage.useMutation();

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        allowBase64: true,
      }),
    ],
    content: "",
  });

  useEffect(() => {
    if (getPageQuery.data) {
      setPageTitle(getPageQuery.data.title);
      editor?.commands.setContent(getPageQuery.data.contentHtml || "");
    } else {
      setPageTitle("");
      editor?.commands.setContent("");
    }
  }, [getPageQuery.data, editor]);

  const handleSave = async () => {
    if (!editor) return;
    
    try {
      await savePageMutation.mutateAsync({
        slug: selectedPage,
        title: pageTitle,
        contentHtml: editor.getHTML(),
        contentJson: JSON.stringify(editor.getJSON()),
      });
      toast.success("页面已保存");
    } catch (error) {
      toast.error("保存失败");
    }
  };

  const addImage = () => {
    const url = window.prompt("输入图片URL:");
    if (url) {
      editor?.commands.setImage({ src: url });
    }
  };

  if (!editor) {
    return <div>加载中...</div>;
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">页面编辑器</h1>
          <Button variant="outline" onClick={() => setLocation("/admin")}>
            登出
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>选择要编辑的页面</CardTitle>
            <CardDescription>选择一个页面进行编辑</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select value={selectedPage} onValueChange={setSelectedPage}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {EDITABLE_PAGES.map((page) => (
                  <SelectItem key={page.slug} value={page.slug}>
                    {page.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div>
              <label className="text-sm font-medium">页面标题</label>
              <Input
                value={pageTitle}
                onChange={(e) => setPageTitle(e.target.value)}
                placeholder="输入页面标题"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>编辑内容</CardTitle>
            <CardDescription>使用下方工具栏编辑页面内容</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border rounded-lg p-3 bg-muted space-y-2">
              <div className="flex gap-2 flex-wrap">
                <Button
                  size="sm"
                  variant={editor.isActive("bold") ? "default" : "outline"}
                  onClick={() => editor.chain().focus().toggleBold().run()}
                >
                  <Bold className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant={editor.isActive("italic") ? "default" : "outline"}
                  onClick={() => editor.chain().focus().toggleItalic().run()}
                >
                  <Italic className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant={editor.isActive("bulletList") ? "default" : "outline"}
                  onClick={() => editor.chain().focus().toggleBulletList().run()}
                >
                  <List className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    const url = window.prompt("输入链接URL:");
                    if (url) {
                      editor.chain().focus().setLink({ href: url }).run();
                    }
                  }}
                >
                  <Link2 className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={addImage}
                >
                  <ImageIcon className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="border rounded-lg p-4 min-h-96 bg-white">
              <EditorContent editor={editor} />
            </div>

            <Button
              onClick={handleSave}
              disabled={savePageMutation.isPending}
              className="w-full"
            >
              <Save className="w-4 h-4 mr-2" />
              {savePageMutation.isPending ? "保存中..." : "保存页面"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
