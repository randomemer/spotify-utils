CREATE TABLE `friend_requests` (
	`id` varchar(256) NOT NULL,
	`user1` varchar(256) NOT NULL,
	`user2` varchar(256) NOT NULL,
	`requestor` enum('user1','user2'),
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `friend_requests_id` PRIMARY KEY(`id`),
  CONSTRAINT `friend_requests_check_uid` CHECK(`user1` < `user2`)
);
--> statement-breakpoint
CREATE TABLE `playlists` (
	`playlist_id` varchar(256) NOT NULL,
	`snapshot_id` varchar(256) NOT NULL,
	`analysis` json NOT NULL,
	`artists` json NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `playlists_playlist_id_snapshot_id_pk` PRIMARY KEY(`playlist_id`,`snapshot_id`)
);
--> statement-breakpoint
CREATE TABLE `recommends` (
	`id` varchar(256) NOT NULL,
	`user_id` varchar(256) NOT NULL,
	`data` json NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `recommends_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_friends` (
	`id` varchar(256) NOT NULL,
	`user_id` varchar(256) NOT NULL,
	`friend_id` varchar(256) NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `user_friends_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` varchar(256) NOT NULL,
	`username` varchar(256),
	`display_name` varchar(256) NOT NULL,
	`picture` varchar(256),
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_username_unique` UNIQUE(`username`)
);
--> statement-breakpoint
ALTER TABLE `friend_requests` ADD CONSTRAINT `friend_requests_user1_users_id_fk` FOREIGN KEY (`user1`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `friend_requests` ADD CONSTRAINT `friend_requests_user2_users_id_fk` FOREIGN KEY (`user2`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `recommends` ADD CONSTRAINT `recommends_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_friends` ADD CONSTRAINT `user_friends_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_friends` ADD CONSTRAINT `user_friends_friend_id_users_id_fk` FOREIGN KEY (`friend_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;
