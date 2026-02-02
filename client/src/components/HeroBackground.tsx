import { useState, useEffect } from 'react';

interface HeroBackgroundProps {
  imageUrl?: string;
  blurAmount?: number;
  gradientOpacity?: number;
}

/**
 * Hero背景组件
 * 支持：
 * 1. 从上到下逐渐渐变的模糊效果
 * 2. 上滑时露出完整的图片
 * 3. 平滑的过渡动画
 */
export function HeroBackground({
  imageUrl,
  blurAmount = 15,
  gradientOpacity = 0.6,
}: HeroBackgroundProps) {
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    setIsVisible(true);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 计算模糊程度：向下滚动时增加模糊，向上滚动时减少模糊
  // scrollY = 0 时，模糊度为 blurAmount
  // scrollY > 0 时，模糊度逐渐减少，最终露出完整图片
  const calculatedBlur = Math.max(0, blurAmount - scrollY / 10);

  if (!imageUrl || !isVisible) {
    return null;
  }

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* 背景图片层 */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-300"
        style={{
          backgroundImage: `url('${imageUrl}')`,
          filter: `blur(${calculatedBlur}px)`,
          transform: `scale(${1 + calculatedBlur / 100})`, // 轻微缩放以补偿模糊
        }}
      />

      {/* 从上到下逐渐渐变的遮罩层 */}
      <div
        className="absolute inset-0 transition-opacity duration-300"
        style={{
          background: `linear-gradient(
            to bottom,
            rgba(255, 255, 255, ${gradientOpacity}),
            rgba(255, 255, 255, ${gradientOpacity * 0.5}),
            rgba(255, 255, 255, 0)
          )`,
          opacity: Math.max(0, 1 - scrollY / 200), // 向下滚动时逐渐隐藏遮罩
        }}
      />
    </div>
  );
}
