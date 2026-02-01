import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { useEditMode } from "@/contexts/EditModeContext";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [, setLocation] = useLocation();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { setIsEditMode, setIsAdmin } = useEditMode();
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    
    try {
      // 验证凭证
      const adminUsername = "LabAdmin";
      const adminPassword = "FiowinLab2021";
      
      if (username === adminUsername && password === adminPassword) {
        // 登录成功，设置编辑模式
        setIsEditMode(true);
        setIsAdmin(true);
        
        // 保存登录状态到localStorage
        localStorage.setItem("admin_logged_in", "true");
        
        toast.success("登录成功");
        
        // 跳转到首页
        setTimeout(() => {
          setLocation("/");
        }, 500);
      } else {
        toast.error("用户名或密码错误");
        setIsLoggingIn(false);
      }
    } catch (error) {
      toast.error("登录失败");
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>管理员登录</CardTitle>
          <CardDescription>输入管理员用户名和密码以访问编辑功能</CardDescription>
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
                disabled={isLoggingIn}
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
                disabled={isLoggingIn}
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? "登录中..." : "登录"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
