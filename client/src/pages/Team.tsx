import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GeometricDecoration } from "@/components/GeometricDecoration";
import { DraggableMemberCard } from "@/components/DraggableMemberCard";
import { trpc } from "@/lib/trpc";
import { Award, BookOpen, User, Plus } from "lucide-react";
import { Link } from "wouter";
import { EditableText } from "@/components/EditableText";
import { useEditMode } from "@/contexts/EditModeContext";
import { useState, useEffect } from "react";
import { toast } from "sonner";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import { AddMemberDialog } from "@/components/AddMemberDialog";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

export default function Team() {
  const { isEditMode } = useEditMode();
  const { data: members, isLoading, refetch } = trpc.lab.members.useQuery();
  const updateOrderMutation = trpc.lab.updateMembersOrder.useMutation();
  const deleteMemberMutation = trpc.lab.deleteMember.useMutation();

  const [sortedMembers, setSortedMembers] = useState<typeof members>([]);

  useEffect(() => {
    if (members) {
      setSortedMembers([...members].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0)));
    }
  }, [members]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      distance: 8,
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = sortedMembers?.findIndex((m) => m.id === active.id) ?? 0;
      const newIndex = sortedMembers?.findIndex((m) => m.id === over.id) ?? 0;

      const newOrder = arrayMove(sortedMembers || [], oldIndex, newIndex);
      setSortedMembers(newOrder);

      const memberIds = newOrder.map((m) => m.id);
      try {
        await updateOrderMutation.mutateAsync({ memberIds });
        toast.success("排序已保存");
      } catch (error) {
        toast.error("保存排序失败");
        refetch();
      }
    }
  };

  const handleDeleteMember = async (id: number) => {
    try {
      await deleteMemberMutation.mutateAsync({ id });
      toast.success("成员已删除");
      refetch();
    } catch (error) {
      toast.error("删除失败");
    }
  };

  const groupedMembers = {
    PI: sortedMembers?.filter((m) => m.role === "PI") || [],
    Postdoc: sortedMembers?.filter((m) => m.role === "Postdoc") || [],
    PhD: sortedMembers?.filter((m) => m.role === "PhD") || [],
    Master: sortedMembers?.filter((m) => m.role === "Master") || [],
    Undergraduate: sortedMembers?.filter((m) => m.role === "Undergraduate") || [],
    Alumni: sortedMembers?.filter((m) => m.role === "Alumni") || [],
    Member: sortedMembers?.filter((m) => m.role === "Member") || [],
  };

  const roleLabels = {
    PI: "导师团队",
    Postdoc: "博士后",
    PhD: "博士生",
    Master: "硕士生",
    Undergraduate: "本科生",
    Alumni: "已毕业学生",
    Member: "团队成员",
  };

  if (isLoading) {
    return (
      <div className="min-h-screen py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4">团队成员</h1>
            <p className="text-lg text-muted-foreground">加载中...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <GeometricDecoration variant="hero" />
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            {isEditMode ? (
              <EditableText
                slug="team-title"
                field="title"
                content="团队成员"
                className="text-4xl md:text-6xl font-bold text-foreground"
                as="h1"
              />
            ) : (
              <h1 className="text-4xl md:text-6xl font-bold text-foreground">团队成员</h1>
            )}
            {isEditMode ? (
              <EditableText
                slug="team-description"
                field="content"
                content="我们的团队由经验丰富的导师、充满活力的博士后和研究生组成，共同推动光通信领域的前沿研究"
                className="text-lg text-muted-foreground leading-relaxed"
              />
            ) : (
              <p className="text-lg text-muted-foreground leading-relaxed">
                我们的团队由经验丰富的导师、充满活力的博士后和研究生组成，共同推动光通信领域的前沿研究
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Members by Role */}
      <section className="py-16">
        <div className="container space-y-16">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            {(Object.keys(groupedMembers) as Array<keyof typeof groupedMembers>).map((role) => {
              const roleMembers = groupedMembers[role];
              if (roleMembers.length === 0) return null;

              return (
                <div key={role}>
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl font-bold text-foreground">{roleLabels[role]}</h2>
                    {isEditMode && (
                      <AddMemberDialog
                        role={role}
                        onMemberAdded={() => refetch()}
                      />
                    )}
                  </div>

                  <SortableContext
                    items={roleMembers.map((m) => m.id)}
                    strategy={verticalListSortingStrategy}
                    disabled={!isEditMode}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {roleMembers.map((member) => (
                        <DraggableMemberCard
                          key={member.id}
                          member={member}
                          onDelete={handleDeleteMember}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </div>
              );
            })}
          </DndContext>
        </div>
      </section>
    </div>
  );
}
