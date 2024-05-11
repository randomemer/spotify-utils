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
    .references(() => users.id, { onUpdate: "cascade", onDelete: "cascade" }),
  userTwo: varchar("user2", { length: 256 })
    .notNull()
    .references(() => users.id, { onUpdate: "cascade", onDelete: "cascade" }),
  requestor: mysqlEnum("requestor", ["user1", "user2"]).notNull(),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow().notNull(),
});

export const userFriends = mysqlTable("user_friends", {
  id: varchar("id", { length: 256 }).primaryKey(),
  userId: varchar("user_id", { length: 256 })
    .notNull()
    .references(() => users.id, { onUpdate: "cascade", onDelete: "cascade" }),
  friendId: varchar("friend_id", { length: 256 })
    .notNull()
    .references(() => users.id, { onUpdate: "cascade", onDelete: "cascade" }),
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
    .references(() => users.id, { onUpdate: "cascade", onDelete: "cascade" }),
  data: json("data").$type<SpotifyApi.RecommendationsObject>().notNull(),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow().notNull(),
});

// *********************
// **** RELATIONS ******
// *********************

export const usersRelations = relations(users, ({ many }) => ({
  friends: many(userFriends, { relationName: "friends_friend" }),
  friendRequests: many(friendRequests),
}));

export const userFriendsRelations = relations(userFriends, ({ one }) => ({
  user: one(users, {
    relationName: "friends_user",
    fields: [userFriends.userId],
    references: [users.id],
  }),
  friend: one(users, {
    relationName: "friends_friend",
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

export type UserModel = InferSelectModel<typeof users>;
export type InsertUserModel = InferInsertModel<typeof users>;

export type FriendRequestModel = InferSelectModel<typeof friendRequests>;
export type InsertFriendRequestModel = InferInsertModel<typeof friendRequests>;

export type UserFriendModel = InferSelectModel<typeof userFriends>;
export type InsertUserFriendModel = InferInsertModel<typeof userFriends>;

export type PlaylistModel = InferSelectModel<typeof playlists>;
export type InsertPlaylistModel = InferInsertModel<typeof playlists>;

export type RecommendModel = InferSelectModel<typeof recommends>;
export type InsertRecommendModel = InferInsertModel<typeof recommends>;
