import { describe, it, expect } from "vitest";
import { safeJsonParse, isValidJson, safeJsonStringify } from "./jsonParser";

describe("JSON Parser Utilities", () => {
  describe("safeJsonParse", () => {
    it("should parse valid JSON strings", () => {
      const result = safeJsonParse('["item1", "item2"]');
      expect(result).toEqual(["item1", "item2"]);
    });

    it("should parse valid JSON objects", () => {
      const result = safeJsonParse('{"name": "test", "value": 123}');
      expect(result).toEqual({ name: "test", value: 123 });
    });

    it("should return default value for invalid JSON", () => {
      const result = safeJsonParse("复旦大学KLA冠名奖学金", []);
      expect(result).toEqual([]);
    });

    it("should return default value for null or undefined", () => {
      expect(safeJsonParse(null, [])).toEqual([]);
      expect(safeJsonParse(undefined, [])).toEqual([]);
      expect(safeJsonParse("", [])).toEqual([]);
    });

    it("should return custom default value", () => {
      const customDefault = { error: true };
      const result = safeJsonParse("invalid json", customDefault);
      expect(result).toEqual(customDefault);
    });

    it("should handle Chinese characters in invalid JSON", () => {
      const result = safeJsonParse("这是一个无效的JSON字符串", []);
      expect(result).toEqual([]);
    });

    it("should handle mixed content", () => {
      const result = safeJsonParse("复旦大学KLA冠名奖学金", { fallback: true });
      expect(result).toEqual({ fallback: true });
    });
  });

  describe("isValidJson", () => {
    it("should return true for valid JSON", () => {
      expect(isValidJson('["item1", "item2"]')).toBe(true);
      expect(isValidJson('{"name": "test"}')).toBe(true);
      expect(isValidJson("123")).toBe(true);
      expect(isValidJson('"string"')).toBe(true);
    });

    it("should return false for invalid JSON", () => {
      expect(isValidJson("复旦大学KLA冠名奖学金")).toBe(false);
      expect(isValidJson("not valid json")).toBe(false);
      expect(isValidJson("{invalid}")).toBe(false);
    });

    it("should return false for null or undefined", () => {
      expect(isValidJson(null)).toBe(false);
      expect(isValidJson(undefined)).toBe(false);
      expect(isValidJson("")).toBe(false);
    });
  });

  describe("safeJsonStringify", () => {
    it("should stringify valid objects", () => {
      const obj = { name: "test", value: 123 };
      const result = safeJsonStringify(obj);
      expect(result).toBe('{"name":"test","value":123}');
    });

    it("should stringify arrays", () => {
      const arr = ["item1", "item2", "item3"];
      const result = safeJsonStringify(arr);
      expect(result).toBe('["item1","item2","item3"]');
    });

    it("should return default value for circular references", () => {
      const obj: any = { name: "test" };
      obj.self = obj; // Create circular reference
      const result = safeJsonStringify(obj, '[]');
      expect(result).toBe('[]');
    });

    it("should handle null and undefined", () => {
      expect(safeJsonStringify(null)).toBe("null");
      expect(safeJsonStringify(undefined)).toBe("null");
    });
  });

  describe("Real-world scenarios", () => {
    it("should handle award data with Chinese characters", () => {
      const invalidAwardData = "复旦大学KLA冠名奖学金";
      const result = safeJsonParse(invalidAwardData, []);
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(0);
    });

    it("should handle research interests data", () => {
      const validData = '["光通信", "光电子", "无线融合"]';
      const result = safeJsonParse(validData, []);
      expect(result).toEqual(["光通信", "光电子", "无线融合"]);
    });

    it("should handle image array data", () => {
      const imageData = '["https://example.com/img1.jpg", "https://example.com/img2.jpg"]';
      const result = safeJsonParse(imageData, []);
      expect(result).toEqual([
        "https://example.com/img1.jpg",
        "https://example.com/img2.jpg",
      ]);
    });

    it("should gracefully handle corrupted image data", () => {
      const corruptedData = "https://example.com/img1.jpg, https://example.com/img2.jpg";
      const result = safeJsonParse(corruptedData, []);
      expect(result).toEqual([]);
    });
  });
});
