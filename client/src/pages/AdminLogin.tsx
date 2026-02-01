import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { toast } from "sonner";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [, setLocation] = useLocation();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  
  const loginMutation = trpc.admin.login.useMutation();
  
  // 监听认证状态
  const { data: authData, isLoading: isAuthLoading } = trpc.auth.me.useQuery(undefined, {
    retry: false,
  });

  // 如果已经登录，自动跳转到编辑器
  useEffect(() => {
    if (authData?.id && !isAuthLoading && !isLoggingIn) {
      setLocation("/admin/editor");
    }
  }, [authData, isAuthLoading, isLoggingIn, setLocation]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    
    try {
      // 执行登录
      await loginMutation.mutateAsync({ username, password });
      toast.success("登录成功");
      
      // 登录成功后，等待一下让认证状态更新
      // 然后自动跳转（由useEffect处理）
      setTimeout(() => {
        setIsLoggingIn(false);
      }, 500);
    } catch (error) {
      toast.error("用户名或密码错误");
      setIsLoggingIn(false);
    }
  };

  // 如果已经在加载认证状态或正在登录，显示加载状态
  if (isAuthLoading || isLoggingIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardContent className="pt-8">
            <div className="text-center">
              <p className="text-lg">正在处理...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>管理员登录</CardTitle>
          <CardDescription>输入管理员用户名和密码以访问编辑器</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-sm font-medium">用户名</label>
              <Input
                type="text"
                placeholder="输入用户名"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={loginMutation.isPending}
              />
            </div>
            <div>
              <label className="text-sm font-medium">密码</label>
              <Input
                type="password"
                placeholder="输入密码"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loginMutation.isPending}
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? "登录中..." : "登录"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
