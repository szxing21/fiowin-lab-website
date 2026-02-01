import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Laboratory Members
export const members = mysqlTable("members", {
  id: int("id").autoincrement().primaryKey(),
  nameEn: varchar("nameEn", { length: 128 }).notNull(),
  nameCn: varchar("nameCn", { length: 128 }).notNull(),
  role: mysqlEnum("role", ["PI", "Postdoc", "PhD", "Master", "Member"]).notNull(),
  title: varchar("title", { length: 64 }),
  year: varchar("year", { length: 32 }),
  researchInterests: text("researchInterests"),
  bio: text("bio"),
  publications: int("publications").default(0),
  citations: int("citations").default(0),
  hIndex: int("hIndex").default(0),
  awards: text("awards"),
  photoUrl: text("photoUrl"),
  email: varchar("email", { length: 320 }),
  displayOrder: int("displayOrder").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Member = typeof members.$inferSelect;
export type InsertMember = typeof members.$inferInsert;

// Publications
export const publications = mysqlTable("publications", {
  id: int("id").autoincrement().primaryKey(),
  title: text("title").notNull(),
  journal: varchar("journal", { length: 256 }),
  year: int("year").notNull(),
  month: int("month"),
  firstAuthor: varchar("firstAuthor", { length: 128 }),
  authors: text("authors"),
  labMembers: text("labMembers"),
  keywords: text("keywords"),
  abstract: text("abstract"),
  doi: varchar("doi", { length: 256 }),
  url: text("url"),
  pdfUrl: text("pdfUrl"),
  type: mysqlEnum("type", ["journal", "conference", "patent"]).default("journal").notNull(),
  featured: int("featured").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Publication = typeof publications.$inferSelect;
export type InsertPublication = typeof publications.$inferInsert;

// News
export const news = mysqlTable("news", {
  id: int("id").autoincrement().primaryKey(),
  title: text("title").notNull(),
  summary: text("summary"),
  content: text("content"),
  category: varchar("category", { length: 64 }),
  author: varchar("author", { length: 128 }),
  coverImage: text("coverImage"),
  publishedAt: timestamp("publishedAt").notNull(),
  featured: int("featured").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type News = typeof news.$inferSelect;
export type InsertNews = typeof news.$inferInsert;

// Conferences
export const conferences = mysqlTable("conferences", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 128 }).notNull(),
  fullName: text("fullName"),
  location: varchar("location", { length: 256 }),
  startDate: timestamp("startDate").notNull(),
  endDate: timestamp("endDate"),
  year: int("year").notNull(),
  papers: int("papers").default(0),
  oral: int("oral").default(0),
  poster: int("poster").default(0),
  invited: int("invited").default(0),
  attendees: text("attendees"),
  invitedTalks: text("invitedTalks"),
  description: text("description"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Conference = typeof conferences.$inferSelect;
export type InsertConference = typeof conferences.$inferInsert;

// Research Areas
export const researchAreas = mysqlTable("researchAreas", {
  id: int("id").autoincrement().primaryKey(),
  nameEn: varchar("nameEn", { length: 256 }).notNull(),
  nameCn: varchar("nameCn", { length: 256 }).notNull(),
  description: text("description"),
  topics: text("topics"),
  icon: varchar("icon", { length: 64 }),
  displayOrder: int("displayOrder").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ResearchArea = typeof researchAreas.$inferSelect;
export type InsertResearchArea = typeof researchAreas.$inferInsert;