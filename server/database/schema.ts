import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";
import {
  json,
  mysqlEnum,
  mysqlTable,
  primaryKey,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

// *********************
// ***** TABLES ********
// *********************

export const users = mysqlTable("users", {
  id: varchar("id", { length: 256 }).primaryKey(),
  username: varchar("username", { length: 256 }).unique().notNull(),
  displayName: varchar("display_name", { length: 256 }).notNull(),
  picture: varchar("picture", { length: 256 }),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "string" })
    .defaultNow()
    .onUpdateNow()
    .notNull(),
});

export const friendRequests = mysqlTable("friend_requests", {
  id: varchar("id", { length: 256 }).primaryKey(),
  userOne: varchar("user1", { length: 256 })
    .notNull()
    .references(() => users.id),
  userTwo: varchar("user2", { length: 256 })
    .notNull()
    .references(() => users.id),
  requestor: mysqlEnum("requestor", ["user1", "user2"]).notNull(),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow().notNull(),
});

export const userFriends = mysqlTable("user_friends", {
  id: varchar("id", { length: 256 }).primaryKey(),
  userId: varchar("user_id", { length: 256 })
    .notNull()
    .references(() => users.id),
  friendId: varchar("friend_id", { length: 256 })
    .notNull()
    .references(() => users.id),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow().notNull(),
});

export const playlists = mysqlTable(
  "playlists",
  {
    playlistId: varchar("playlist_id", { length: 256 }).notNull(),
    snapshotId: varchar("snapshot_id", { length: 256 }).notNull(),
    analysis: json("analysis").$type<PlaylistAnalysis>().notNull(),
    artists: json("artists").$type<ArtistItemData[]>().notNull(),
    createdAt: timestamp("created_at", { mode: "string" })
      .defaultNow()
      .notNull(),
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
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow().notNull(),
});

// *********************
// **** RELATIONS ******
// *********************

export const usersRelations = relations(users, ({ many }) => ({
  friends: many(userFriends, { relationName: "friends" }),
  friendRequests: many(friendRequests, { relationName: "friendRequests" }),
}));

export const userFriendsRelations = relations(userFriends, ({ one }) => ({
  user: one(users, { fields: [userFriends.userId], references: [users.id] }),
  friend: one(users, {
    fields: [userFriends.friendId],
    references: [users.id],
  }),
}));

export const friendRequestRelations = relations(friendRequests, ({ one }) => ({
  userOneRecord: one(users, {
    fields: [friendRequests.userOne],
    references: [users.id],
  }),
  userTwoRecord: one(users, {
    fields: [friendRequests.userTwo],
    references: [users.id],
  }),
}));

// *********************
// ****** TYPES ********
// *********************

export type SelectUser = InferSelectModel<typeof users>;
export type InsertUser = InferInsertModel<typeof users>;

export type SelectFriendRequest = InferSelectModel<typeof friendRequests>;
export type InsertFriendRequest = InferInsertModel<typeof friendRequests>;

export type SelectUserFriend = InferSelectModel<typeof userFriends>;
export type InsertUserFriend = InferInsertModel<typeof userFriends>;

export type SelectPlaylist = InferSelectModel<typeof playlists>;
export type InsertPlaylist = InferInsertModel<typeof playlists>;

export type SelectRecommend = InferSelectModel<typeof recommends>;
export type InsertRecommend = InferInsertModel<typeof recommends>;
