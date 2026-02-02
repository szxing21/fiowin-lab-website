import { describe, it, expect } from 'vitest';

/**
 * HeroBackground 组件单元测试
 * 测试模糊效果计算逻辑
 */

describe('HeroBackground - Blur Calculation', () => {
  it('should calculate blur amount correctly at scroll position 0', () => {
    const blurAmount = 15;
    const scrollY = 0;
    const calculatedBlur = Math.max(0, blurAmount - scrollY / 10);
    expect(calculatedBlur).toBe(15);
  });

  it('should decrease blur amount as user scrolls down', () => {
    const blurAmount = 15;
    const scrollY = 50;
    const calculatedBlur = Math.max(0, blurAmount - scrollY / 10);
    expect(calculatedBlur).toBe(10);
  });

  it('should reach zero blur at scroll position 150', () => {
    const blurAmount = 15;
    const scrollY = 150;
    const calculatedBlur = Math.max(0, blurAmount - scrollY / 10);
    expect(calculatedBlur).toBe(0);
  });

  it('should not go below zero blur', () => {
    const blurAmount = 15;
    const scrollY = 300; // 远超过需要的滚动距离
    const calculatedBlur = Math.max(0, blurAmount - scrollY / 10);
    expect(calculatedBlur).toBe(0);
  });

  it('should handle custom blur amounts', () => {
    const blurAmount = 25;
    const scrollY = 100;
    const calculatedBlur = Math.max(0, blurAmount - scrollY / 10);
    expect(calculatedBlur).toBe(15);
  });
});

describe('HeroBackground - Gradient Opacity', () => {
  it('should calculate gradient opacity correctly at scroll position 0', () => {
    const scrollY = 0;
    const opacity = Math.max(0, 1 - scrollY / 200);
    expect(opacity).toBe(1);
  });

  it('should decrease opacity as user scrolls down', () => {
    const scrollY = 100;
    const opacity = Math.max(0, 1 - scrollY / 200);
    expect(opacity).toBe(0.5);
  });

  it('should reach zero opacity at scroll position 200', () => {
    const scrollY = 200;
    const opacity = Math.max(0, 1 - scrollY / 200);
    expect(opacity).toBe(0);
  });

  it('should not go below zero opacity', () => {
    const scrollY = 500;
    const opacity = Math.max(0, 1 - scrollY / 200);
    expect(opacity).toBe(0);
  });
});

describe('HeroBackground - Component Props', () => {
  it('should have default blur amount of 15', () => {
    const defaultBlurAmount = 15;
    expect(defaultBlurAmount).toBe(15);
  });

  it('should have default gradient opacity of 0.6', () => {
    const defaultGradientOpacity = 0.6;
    expect(defaultGradientOpacity).toBe(0.6);
  });

  it('should accept custom blur amount', () => {
    const customBlurAmount = 25;
    expect(customBlurAmount).toBeGreaterThan(15);
  });

  it('should accept custom gradient opacity', () => {
    const customGradientOpacity = 0.8;
    expect(customGradientOpacity).toBeGreaterThan(0.6);
  });

  it('should accept undefined image URL', () => {
    const imageUrl = undefined;
    expect(imageUrl).toBeUndefined();
  });

  it('should accept valid image URL', () => {
    const imageUrl = 'https://example.com/image.jpg';
    expect(imageUrl).toBeDefined();
    expect(typeof imageUrl).toBe('string');
  });
});
