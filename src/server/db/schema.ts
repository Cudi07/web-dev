// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import { index, pgTableCreator, serial, varchar, bigint, timestamp, text } from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `web-dev_${name}`);

export const posts = createTable(
  "post",
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    name: d.varchar({ length: 256 }),
    createdAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  }),
  (t) => [index("name_idx").on(t.name)],
);

export const fileUploads = createTable(
  "file_upload",
  {
    id: serial("id").primaryKey(),
    fileName: varchar("file_name", { length: 256 }).notNull(),
    fileSize: bigint("file_size", { mode: "number" }).notNull(),
    mimeType: varchar("mime_type", { length: 128 }).notNull(),
    fileData: text("file_data").notNull(),
    uploadedBy: varchar("uploaded_by", { length: 256 }).notNull(),
    status: varchar("status", { length: 50 }).default('pending').notNull(),
    fullName: varchar("full_name", { length: 256 }).notNull(),
    address: text("address").notNull(),
    documentType: varchar("document_type", { length: 100 }).notNull(),
    purpose: text("purpose").notNull(),
    requestType: varchar("request_type", { length: 50 }).default('document').notNull(),
    email: varchar("email", { length: 256 }),
    phone: varchar("phone", { length: 50 }),
    message: text("message"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    fileNameIdx: index("file_name_idx").on(table.fileName),
    uploadedByIdx: index("uploaded_by_idx").on(table.uploadedBy),
    statusIdx: index("status_idx").on(table.status),
    fullNameIdx: index("full_name_idx").on(table.fullName),
    requestTypeIdx: index("request_type_idx").on(table.requestType),
  })
);

export const announcements = createTable(
  "announcement",
  {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 256 }).notNull(),
    description: text("description").notNull(),
    date: timestamp("date", { withTimezone: true }).notNull(),
    link: varchar("link", { length: 512 }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    dateIdx: index("date_idx").on(table.date),
    titleIdx: index("title_idx").on(table.title),
  })
);
