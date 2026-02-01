import { drizzle } from "drizzle-orm/mysql2";
import { eq, desc } from "drizzle-orm";
import { InsertUser, users, members, publications, news, conferences, researchAreas, pages, InsertPage, Page } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Laboratory data queries
export async function getAllMembers() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(members).orderBy(members.displayOrder, members.id);
}

export async function getMembersByRole(role: "PI" | "Postdoc" | "PhD" | "Master" | "Undergraduate" | "Alumni" | "Member") {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(members).where(eq(members.role, role)).orderBy(members.displayOrder, members.id);
}

export async function createMember(data: {
  nameEn: string;
  nameCn: string;
  role: "PI" | "Postdoc" | "PhD" | "Master" | "Undergraduate" | "Alumni" | "Member";
  title?: string;
  year?: string;
  bio?: string;
  identity?: string;
  grade?: string;
  displayOrder?: number;
}) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.insert(members).values({
    nameEn: data.nameEn,
    nameCn: data.nameCn,
    role: data.role,
    title: data.title,
    year: data.year,
    bio: data.bio,
    identity: data.identity,
    grade: data.grade,
    displayOrder: data.displayOrder ?? 0,
  });
  
  return result;
}

export async function updateMember(id: number, data: Partial<{
  nameEn: string;
  nameCn: string;
  role: "PI" | "Postdoc" | "PhD" | "Master" | "Undergraduate" | "Alumni" | "Member";
  title: string;
  year: string;
  bio: string;
  identity: string;
  grade: string;
  displayOrder: number;
  researchInterests: string;
  awards: string;
  photoUrl: string;
  email: string;
  publications: number;
  citations: number;
  hIndex: number;
}>) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.update(members).set(data).where(eq(members.id, id));
  return result;
}

export async function deleteMember(id: number) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.delete(members).where(eq(members.id, id));
  return result;
}

export async function updateMembersOrder(memberIds: number[]) {
  const db = await getDb();
  if (!db) return;
  
  for (let i = 0; i < memberIds.length; i++) {
    await db.update(members).set({ displayOrder: i }).where(eq(members.id, memberIds[i]));
  }
}

export async function getAllPublications() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(publications).orderBy(desc(publications.year), desc(publications.month));
}

export async function getFeaturedPublications() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(publications).where(eq(publications.featured, 1)).orderBy(desc(publications.year), desc(publications.month));
}

export async function getAllNews() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(news).orderBy(desc(news.publishedAt));
}

export async function getFeaturedNews() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(news).where(eq(news.featured, 1)).orderBy(desc(news.publishedAt)).limit(6);
}

export async function getAllConferences() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(conferences).orderBy(desc(conferences.year), desc(conferences.startDate));
}

export async function getAllResearchAreas() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(researchAreas).orderBy(researchAreas.displayOrder, researchAreas.id);
}

export async function getMemberById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(members).where(eq(members.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function getPublicationsByMember(memberName: string) {
  const db = await getDb();
  if (!db) return [];
  const allPublications = await db.select().from(publications).orderBy(desc(publications.year), desc(publications.month));
  return allPublications.filter(pub => {
    const authors = pub.authors || '';
    const labMembers = pub.labMembers || '';
    return authors.includes(memberName) || labMembers.includes(memberName);
  });
}

// Pages (editable content)
export async function getPageBySlug(slug: string): Promise<Page | null> {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(pages).where(eq(pages.slug, slug)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function getAllPages() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(pages).orderBy(pages.slug);
}

export async function upsertPage(slug: string, data: Partial<InsertPage>) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert page: database not available");
    return null;
  }

  try {
    const existing = await getPageBySlug(slug);
    if (existing) {
      await db.update(pages).set({
        ...data,
        updatedAt: new Date(),
      }).where(eq(pages.slug, slug));
      return existing;
    } else {
      const result = await db.insert(pages).values({
        slug,
        title: data.title || slug,
        contentHtml: data.contentHtml,
        contentJson: data.contentJson,
        description: data.description,
      });
      return result;
    }
  } catch (error) {
    console.error("[Database] Failed to upsert page:", error);
    throw error;
  }
}

export async function updatePublication(id: number, data: any) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  try {
    return await db.update(publications).set(data).where(eq(publications.id, id));
  } catch (error) {
    console.error("[Database] Failed to update publication:", error);
    throw error;
  }
}

export async function deletePublication(id: number) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  try {
    return await db.delete(publications).where(eq(publications.id, id));
  } catch (error) {
    console.error("[Database] Failed to delete publication:", error);
    throw error;
  }
}


export async function updateNews(id: number, data: Record<string, any>) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  try {
    return await db.update(news).set(data).where(eq(news.id, id));
  } catch (error) {
    console.error("[Database] Failed to update news:", error);
    throw error;
  }
}

export async function deleteNews(id: number) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  try {
    return await db.delete(news).where(eq(news.id, id));
  } catch (error) {
    console.error("[Database] Failed to delete news:", error);
    throw error;
  }
}

export async function createNews(data: {
  title: string;
  category?: string;
  author?: string;
  summary?: string;
  content?: string;
  publishedAt?: Date;
}) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  try {
    return await db.insert(news).values({
      title: data.title,
      category: data.category || null,
      author: data.author || null,
      summary: data.summary || null,
      content: data.content || null,
      publishedAt: data.publishedAt || new Date(),
    });
  } catch (error) {
    console.error("[Database] Failed to create news:", error);
    throw error;
  }
}

export async function createPublication(data: {
  title: string;
  authors?: string;
  journal?: string;
  year?: number;
  url?: string;
  type?: "journal" | "conference";
  journalTier?: string;
}) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  try {
    return await db.insert(publications).values({
      title: data.title,
      authors: data.authors || null,
      journal: data.journal || null,
      year: data.year || null,
      url: data.url || null,
      type: data.type || "journal",
      journalTier: data.journalTier || null,
    });
  } catch (error) {
    console.error("[Database] Failed to create publication:", error);
    throw error;
  }
}
