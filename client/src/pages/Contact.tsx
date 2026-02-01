import { Card, CardContent } from "@/components/ui/card";
import { GeometricDecoration } from "@/components/GeometricDecoration";
import { Building2, Mail, MapPin, MessageSquare } from "lucide-react";

export default function Contact() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <GeometricDecoration variant="hero" />
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground">联系我们</h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              欢迎与我们交流合作，共同推动光通信领域的发展
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {/* Laboratory */}
              <Card className="border-border/40">
                <CardContent className="p-8 space-y-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-accent/20 to-chart-2/20 flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-2">实验室名称</h3>
                    <p className="text-base text-muted-foreground leading-relaxed">
                      未来智能光子无线融合实验室
                      <br />
                      Future Intelligent Optical-Wireless Integrated Network (FiOWIN)
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Institution */}
              <Card className="border-border/40">
                <CardContent className="p-8 space-y-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-accent/20 to-chart-2/20 flex items-center justify-center">
                    <MapPin className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-2">所属单位</h3>
                    <p className="text-base text-muted-foreground leading-relaxed">
                      复旦大学
                      <br />
                      未来信息创新学院
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* WeChat */}
              <Card className="border-border/40">
                <CardContent className="p-8 space-y-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-accent/20 to-chart-2/20 flex items-center justify-center">
                    <MessageSquare className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-2">微信公众号</h3>
                    <p className="text-base text-muted-foreground leading-relaxed">
                      未来智能光子无线集成创新
                      <br />
                      微信号：FiOWIN_LAB
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Director */}
              <Card className="border-border/40">
                <CardContent className="p-8 space-y-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-accent/20 to-chart-2/20 flex items-center justify-center">
                    <Mail className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-2">实验室负责人</h3>
                    <p className="text-base text-muted-foreground leading-relaxed">
                      张俊文 教授
                      <br />
                      迟楠 教授
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Additional Info */}
            <Card className="border-border/40 bg-gradient-to-br from-accent/5 to-chart-2/5">
              <CardContent className="p-8 space-y-4">
                <h3 className="text-2xl font-bold text-foreground">加入我们</h3>
                <p className="text-base text-muted-foreground leading-relaxed">
                  我们欢迎对光通信、光电子器件、光纤-无线融合等领域感兴趣的优秀学生和研究人员加入我们的团队。实验室提供良好的科研环境和学术氛围，致力于培养具有国际视野和创新能力的高水平人才。
                </p>
                <p className="text-base text-muted-foreground leading-relaxed">
                  如有合作意向或咨询事宜，欢迎通过微信公众号与我们联系。
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
