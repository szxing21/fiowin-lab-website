import { useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import Paragraph from "@editorjs/paragraph";
import List from "@editorjs/list";
import Table from "@editorjs/table";
import Code from "@editorjs/code";
import Quote from "@editorjs/quote";
import Image from "@editorjs/image";
import Delimiter from "@editorjs/delimiter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

const PAGES = [
  { slug: "about", label: "关于实验室" },
  { slug: "research-overview", label: "研究方向简介" },
  { slug: "contact", label: "联系我们" },
];

export default function AdminEditor() {
  const [, navigate] = useLocation();
  const editorRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState("about");
  const [pageTitle, setPageTitle] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // 检查认证状态
  const { data: authData } = trpc.auth.me.useQuery();
  
  // 获取页面内容
  const { data: pageData, isLoading: isLoadingPage } = trpc.admin.getPage.useQuery(
    { slug: currentPage },
    { enabled: !!authData }
  );

  // 保存页面
  const saveMutation = trpc.admin.savePage.useMutation({
    onSuccess: () => {
      toast.success("页面已保存！");
      setIsSaving(false);
    },
    onError: (error) => {
      toast.error(`保存失败: ${error.message}`);
      setIsSaving(false);
    },
  });

  // 初始化编辑器
  useEffect(() => {
    if (!containerRef.current || editorRef.current) return;

    const initEditor = async () => {
      try {
        const editor = new EditorJS({
          holder: containerRef.current!,
          tools: {
            header: Header,
            paragraph: Paragraph,
            list: List,
            table: Table,
            code: Code,
            quote: Quote,
            image: Image,
            delimiter: Delimiter,
          } as any,
          onReady: () => {
            console.log("Editor.js is ready to work!");
            setIsLoading(false);
          },
          autofocus: true,
          placeholder: "开始编辑您的内容...",
        });

        editorRef.current = editor;

        // 加载页面内容
        if (pageData?.contentHtml) {
      try {
        // 尝试解析保存的JSON数据
        const savedData = JSON.parse(pageData.contentHtml as string);
            await editor.render(savedData);
          } catch {
            // 如果不是JSON，作为HTML处理
            editor.blocks.clear();
            await editor.blocks.insert(
              "paragraph",
              { text: pageData.contentHtml as string },
              undefined,
              0,
              false
            );
          }
        }
      } catch (error) {
        console.error("Failed to initialize editor:", error);
        toast.error("编辑器初始化失败");
      }
    };

    initEditor();

    return () => {
      if (editorRef.current) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, [containerRef]);

  // 当页面切换时重新加载内容
  useEffect(() => {
    if (pageData && editorRef.current && pageData.contentHtml) {
      setPageTitle(pageData.title);
      editorRef.current.blocks.clear();
      try {
        const savedData = JSON.parse(pageData.contentHtml as string);
        editorRef.current.render(savedData);
      } catch {
        editorRef.current.blocks.insert(
          "paragraph",
          { text: pageData.contentHtml as string },
          undefined,
          0,
          false
        );
      }
    }
  }, [pageData, currentPage]);

  const handleSave = async () => {
    if (!editorRef.current) return;

    setIsSaving(true);
    try {
      const data = await editorRef.current.save();
      
      saveMutation.mutate({
        slug: currentPage,
        title: pageTitle.trim() || "未命名页面",
        contentHtml: JSON.stringify(data),
      });
    } catch (error) {
      console.error("Save error:", error);
      toast.error("保存失败，请检查内容");
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    navigate("/");
  };

  if (!authData || !authData.id) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8">
          <p className="text-lg">未授权访问</p>
          <Button onClick={() => navigate("/admin")} className="mt-4">
            返回登录
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部工具栏 */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4 mb-4">
            <h1 className="text-2xl font-bold text-gray-900">编辑页面</h1>
            <Button onClick={handleLogout} variant="outline">
              登出
            </Button>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                选择页面
              </label>
              <Select value={currentPage} onValueChange={setCurrentPage}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PAGES.map((page) => (
                    <SelectItem key={page.slug} value={page.slug}>
                      {page.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                页面标题
              </label>
              <Input
                value={pageTitle}
                onChange={(e) => setPageTitle(e.target.value)}
                placeholder="输入页面标题"
                className="w-full"
              />
            </div>

            <div className="flex items-end gap-2">
              <Button
                onClick={handleSave}
                disabled={isSaving || isLoading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isSaving ? "保存中..." : "保存页面"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* 编辑器容器 */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {isLoadingPage ? (
          <Card className="p-8 text-center">
            <p className="text-gray-500">加载中...</p>
          </Card>
        ) : (
          <Card className="p-8 bg-white">
            <div
              ref={containerRef}
              className="prose prose-sm max-w-none
                [&_.ce-block]:mb-4
                [&_.ce-block__content]:max-w-none
                [&_.ce-paragraph]:text-base
                [&_.ce-header]:font-bold
                [&_.ce-header--h1]:text-3xl
                [&_.ce-header--h2]:text-2xl
                [&_.ce-header--h3]:text-xl
                [&_.ce-list]:ml-4
                [&_.ce-list__item]:mb-2
                [&_.ce-table]:w-full
                [&_.ce-table__content]:border-collapse
                [&_.ce-table__cell]:border
                [&_.ce-table__cell]:p-2
                [&_.ce-code]:bg-gray-100
                [&_.ce-code__textarea]:font-mono
                [&_.ce-quote]:border-l-4
                [&_.ce-quote]:border-gray-300
                [&_.ce-quote]:pl-4
                [&_.ce-quote]:italic
              "
            />
          </Card>
        )}

        {/* 帮助提示 */}
        <Card className="mt-8 p-6 bg-blue-50 border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-2">编辑器功能提示</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• 按 <code className="bg-blue-100 px-1 rounded">/</code> 快速插入内容块</li>
            <li>• 支持标题、段落、列表、表格、代码块、引用、图片等</li>
            <li>• 使用工具栏格式化文本（粗体、斜体等）</li>
            <li>• 拖拽块可以重新排序内容</li>
            <li>• 点击"保存页面"按钮保存更改</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
