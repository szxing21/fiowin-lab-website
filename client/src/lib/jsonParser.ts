/**
 * 安全的 JSON 解析函数
 * 如果解析失败，返回默认值而不是抛出异常
 */
export function safeJsonParse<T = any>(
  jsonString: string | null | undefined,
  defaultValue: T = [] as T
): T {
  if (!jsonString) {
    return defaultValue;
  }

  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("JSON parse error:", error, "Input:", jsonString);
    return defaultValue;
  }
}

/**
 * 验证字符串是否是有效的 JSON
 */
export function isValidJson(jsonString: string | null | undefined): boolean {
  if (!jsonString) {
    return false;
  }

  try {
    JSON.parse(jsonString);
    return true;
  } catch {
    return false;
  }
}

/**
 * 安全的 JSON 字符串化
 */
export function safeJsonStringify(value: any, defaultValue: string = "[]"): string {
  try {
    const result = JSON.stringify(value);
    // JSON.stringify returns undefined for undefined values, but we want to return the string null
    return result === undefined ? "null" : result;
  } catch (error) {
    console.error("JSON stringify error:", error);
    return defaultValue;
  }
}
