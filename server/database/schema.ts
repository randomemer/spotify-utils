import {
  json,
  mysqlEnum,
  mysqlTable,
  primaryKey,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: varchar("id", { length: 256 }).primaryKey(),
  username: varchar("username", { length: 256 }).unique(),
  displayName: varchar("display_name", { length: 256 }).notNull(),
  picture: varchar("picture", { length: 256 }),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" }).onUpdateNow(),
});

export const friendRequests = mysqlTable("friend_requests", {
  id: varchar("id", { length: 256 }).primaryKey(),
  userOne: varchar("user1", { length: 256 })
    .notNull()
    .references(() => users.id),
  userTwo: varchar("user2", { length: 256 })
    .notNull()
    .references(() => users.id),
  requestor: mysqlEnum("requestor", ["user1", "user2"]),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
});

export const userFriends = mysqlTable("user_friends", {
  id: varchar("id", { length: 256 }).primaryKey(),
  userId: varchar("user_id", { length: 256 })
    .notNull()
    .references(() => users.id),
  friendId: varchar("friend_id", { length: 256 })
    .notNull()
    .references(() => users.id),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
});

export const playlists = mysqlTable(
  "playlists",
  {
    playlistId: varchar("playlist_id", { length: 256 }),
    snapshotId: varchar("snapshot_id", { length: 256 }),
    analysis: json("analysis").$type<PlaylistAnalysis>().notNull(),
    artists: json("artists").$type<ArtistItemData[]>().notNull(),
    createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.playlistId, table.snapshotId] }),
    };
  }
);

export const recommends = mysqlTable("recommends", {
  id: varchar("id", { length: 256 }).primaryKey(),
  userId: varchar("user_id", { length: 256 })
    .notNull()
    .references(() => users.id),
  data: json("data").$type<SpotifyApi.RecommendationsObject>().notNull(),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
});
