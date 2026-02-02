import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { useState } from "react";
import { Card } from "@/components/ui/card";

interface ArrayEditorProps {
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
  label?: string;
  helpText?: string;
  maxItems?: number;
}

/**
 * 数组编辑器组件
 * 提供友好的界面来编辑字符串数组，而不需要用户输入 JSON
 * 
 * 使用示例：
 * ```tsx
 * const [interests, setInterests] = useState(["光通信", "光电子"]);
 * <ArrayEditor 
 *   items={interests}
 *   onChange={setInterests}
 *   label="研究方向"
 *   placeholder="例如：光通信"
 *   helpText="每项代表一个研究方向"
 * />
 * ```
 */
export function ArrayEditor({
  items,
  onChange,
  placeholder = "输入内容",
  label,
  helpText,
  maxItems,
}: ArrayEditorProps) {
  const [newItem, setNewItem] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");

  const handleAddItem = () => {
    if (newItem.trim()) {
      if (maxItems && items.length >= maxItems) {
        return;
      }
      onChange([...items, newItem.trim()]);
      setNewItem("");
    }
  };

  const handleRemoveItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  const handleStartEdit = (index: number) => {
    setEditingIndex(index);
    setEditValue(items[index]);
  };

  const handleSaveEdit = (index: number) => {
    if (editValue.trim()) {
      const newItems = [...items];
      newItems[index] = editValue.trim();
      onChange(newItems);
      setEditingIndex(null);
      setEditValue("");
    }
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === "Enter") {
      e.preventDefault();
      action();
    } else if (e.key === "Escape") {
      e.preventDefault();
      handleCancelEdit();
    }
  };

  return (
    <div className="space-y-3">
      {label && (
        <div>
          <label className="text-sm font-medium text-foreground">{label}</label>
          {helpText && (
            <p className="text-xs text-muted-foreground mt-1">{helpText}</p>
          )}
        </div>
      )}

      {/* Items List */}
      <div className="space-y-2">
        {items.length === 0 ? (
          <Card className="p-4 text-center">
            <p className="text-sm text-muted-foreground">
              还没有添加任何项目，点击下方按钮添加
            </p>
          </Card>
        ) : (
          <div className="space-y-2">
            {items.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-2 p-3 rounded border border-border/40 bg-card hover:bg-card/80 transition-colors"
              >
                <GripVertical className="h-4 w-4 text-muted-foreground flex-shrink-0" />

                {editingIndex === index ? (
                  <div className="flex-1 flex gap-2">
                    <Input
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, () => handleSaveEdit(index))}
                      placeholder={placeholder}
                      autoFocus
                      className="flex-1"
                    />
                    <Button
                      size="sm"
                      onClick={() => handleSaveEdit(index)}
                      className="px-3"
                    >
                      保存
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleCancelEdit}
                      className="px-3"
                    >
                      取消
                    </Button>
                  </div>
                ) : (
                  <>
                    <span className="flex-1 text-sm">{item}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleStartEdit(index)}
                      className="h-8 w-8 p-0"
                    >
                      编辑
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleRemoveItem(index)}
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add New Item */}
      <div className="flex gap-2">
        <Input
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyDown={(e) => handleKeyDown(e, handleAddItem)}
          placeholder={placeholder}
          disabled={maxItems && items.length >= maxItems}
        />
        <Button
          onClick={handleAddItem}
          disabled={!newItem.trim() || (maxItems && items.length >= maxItems)}
          className="px-3 gap-2"
        >
          <Plus className="h-4 w-4" />
          添加
        </Button>
      </div>

      {maxItems && (
        <p className="text-xs text-muted-foreground">
          {items.length} / {maxItems}
        </p>
      )}
    </div>
  );
}
