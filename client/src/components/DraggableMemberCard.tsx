import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Member } from "@/lib/types";
import { Link } from "wouter";
import { User, Trash2, GripVertical } from "lucide-react";
import { useEditMode } from "@/contexts/EditModeContext";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface DraggableMemberCardProps {
  member: Member;
  onDelete?: (id: number) => void;
}

export function DraggableMemberCard({ member, onDelete }: DraggableMemberCardProps) {
  const { isEditMode } = useEditMode();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: member.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const interests = member.researchInterests ? JSON.parse(member.researchInterests) : [];
  const awards = member.awards ? JSON.parse(member.awards) : [];

  return (
    <div ref={setNodeRef} style={style}>
      <Link href={`/member/${member.id}`}>
        <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/40 cursor-pointer relative">
          {/* Drag Handle */}
          {isEditMode && (
            <div
              {...attributes}
              {...listeners}
              className="absolute top-2 right-2 p-2 bg-accent/10 rounded hover:bg-accent/20 cursor-grab active:cursor-grabbing z-10"
              title="拖拽排序"
            >
              <GripVertical className="h-4 w-4 text-accent" />
            </div>
          )}

          <CardContent className="p-6 space-y-4">
            {/* Avatar */}
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent/20 to-chart-2/20 flex items-center justify-center flex-shrink-0">
                {member.photoUrl ? (
                  <img
                    src={member.photoUrl}
                    alt={member.nameCn}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <User className="h-8 w-8 text-accent" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-bold text-foreground">{member.nameCn}</h3>
                <p className="text-sm text-muted-foreground">{member.nameEn}</p>
                <div className="flex gap-1 mt-1 flex-wrap">
                  {member.title && (
                    <Badge variant="secondary" className="text-xs">
                      {member.title}
                    </Badge>
                  )}
                  {member.identity && (
                    <Badge variant="outline" className="text-xs">
                      {member.identity}
                    </Badge>
                  )}
                  {member.grade && (
                    <Badge variant="outline" className="text-xs">
                      {member.grade}
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Bio */}
            {member.bio && (
              <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                {member.bio}
              </p>
            )}

            {/* Research Interests */}
            {interests.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-foreground mb-2">研究方向</p>
                <div className="flex flex-wrap gap-1.5">
                  {interests.slice(0, 3).map((interest: string, idx: number) => (
                    <span
                      key={idx}
                      className="text-xs px-2 py-1 bg-accent/10 text-foreground rounded-full"
                    >
                      {interest}
                    </span>
                  ))}
                  {interests.length > 3 && (
                    <span className="text-xs px-2 py-1 text-muted-foreground">
                      +{interests.length - 3}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Delete Button (Edit Mode) */}
            {isEditMode && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  if (window.confirm(`确定要删除 ${member.nameCn} 吗？`)) {
                    onDelete?.(member.id);
                  }
                }}
                className="w-full gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4" />
                删除
              </Button>
            )}
          </CardContent>
        </Card>
      </Link>
    </div>
  );
}
