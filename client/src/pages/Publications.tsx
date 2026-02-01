import { trpc } from "@/lib/trpc";
import { ExternalLink } from "lucide-react";
import { useMemo, useState } from "react";
import { EditableText } from "@/components/EditableText";
import { EditablePublication } from "@/components/EditablePublication";
import { useEditMode } from "@/contexts/EditModeContext";
import { GeometricDecoration } from "@/components/GeometricDecoration";

const JOURNAL_TIER_ORDER = { top: 0, high: 1, medium: 2, other: 3 };

export default function Publications() {
  const { isEditMode } = useEditMode();
  const { data: publications, isLoading, refetch } = trpc.lab.publications.useQuery();
  const [key, setKey] = useState(0);

  // Sort publications by journal tier and year (descending)
  const sortedPublications = useMemo(() => {
    if (!publications) return [];
    return [...publications].sort((a, b) => {
      const tierA = JOURNAL_TIER_ORDER[a.journalTier as keyof typeof JOURNAL_TIER_ORDER] ?? 3;
      const tierB = JOURNAL_TIER_ORDER[b.journalTier as keyof typeof JOURNAL_TIER_ORDER] ?? 3;
      const tierDiff = tierA - tierB;
      if (tierDiff !== 0) return tierDiff;
      return (b.year || 0) - (a.year || 0);
    });
  }, [publications]);

  // Group publications by year
  const publicationsByYear = useMemo(() => {
    const grouped: Record<number, typeof sortedPublications> = {};
    sortedPublications.forEach((pub) => {
      const year = pub.year || 0;
      if (!grouped[year]) {
        grouped[year] = [];
      }
      if (grouped[year]) {
        grouped[year].push(pub);
      }
    });
    return grouped;
  }, [sortedPublications]);

  const years = useMemo(() => {
    return Object.keys(publicationsByYear)
      .map(Number)
      .sort((a, b) => b - a);
  }, [publicationsByYear]);

  const getCitationFormat = (pub: any, index: number) => {
    const authors = pub.authors || "Unknown Authors";
    const title = pub.title || "Untitled";
    const journal = pub.journal || "Unknown Journal";
    const year = pub.year || "N/A";

    if (pub.type === "conference") {
      return `[${index}] ${authors}, "${title}," in Proc. ${journal}, ${year}.`;
    } else {
      return `[${index}] ${authors}, "${title}," ${journal}, ${year}.`;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4">研究成果</h1>
            <p className="text-lg text-muted-foreground">加载中...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16 bg-background">
      <GeometricDecoration />
      <div className="container relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          {isEditMode ? (
            <EditableText
              slug="publications-title"
              field="title"
              content="研究成果"
              className="text-4xl md:text-6xl font-bold text-foreground mb-4"
              as="h1"
            />
          ) : (
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4">研究成果</h1>
          )}
          {isEditMode ? (
            <EditableText
              slug="publications-description"
              field="content"
              content="我们的研究成果发表在Nature Communications等国际顶级期刊和会议上，推动光通信领域的技术进步"
              className="text-lg text-muted-foreground max-w-2xl mx-auto"
            />
          ) : (
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              我们的研究成果发表在Nature Communications等国际顶级期刊和会议上，推动光通信领域的技术进步
            </p>
          )}
        </div>

        {/* Publications List */}
        <div className="max-w-4xl mx-auto">
          {years.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">暂无论文数据</p>
            </div>
          ) : (
            years.map((year) => {
              const pubs = publicationsByYear[year];
              let citationIndex = 1;

              // Calculate starting index for this year
              for (const y of years) {
                if (y >= year) break;
                citationIndex += publicationsByYear[y].length;
              }

              return (
                <div key={year} className="mb-12">
                  <h2 className="text-2xl font-bold text-foreground mb-6 pb-3 border-b-2 border-accent">
                    {year}
                  </h2>
                  <div className="space-y-4">
                    {pubs && Array.isArray(pubs) && pubs.map((pub, idx) => {
                      const currentIndex = citationIndex + idx;
                      return (
                        <EditablePublication
                          key={`${pub.id}-${key}`}
                          id={pub.id}
                          title={pub.title || ""}
                          authors={pub.authors || ""}
                          journal={pub.journal || ""}
                          year={pub.year || 0}
                          url={pub.url}
                          type={pub.type as "journal" | "conference"}
                          journalTier={pub.journalTier}
                          onUpdate={() => {
                            refetch();
                            setKey(k => k + 1);
                          }}
                          onDelete={() => {
                            refetch();
                            setKey(k => k + 1);
                          }}
                        />
                      );
                    })}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer note */}
        <div className="mt-16 pt-8 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            总计 {sortedPublications.length} 篇论文 | 期刊论文 {sortedPublications.filter(p => p.type === 'journal').length} 篇 | 会议论文 {sortedPublications.filter(p => p.type === 'conference').length} 篇
          </p>
        </div>
      </div>
    </div>
  );
}
