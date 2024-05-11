ALTER TABLE `friend_requests` DROP FOREIGN KEY `friend_requests_user1_users_id_fk`;
--> statement-breakpoint
ALTER TABLE `recommends` DROP FOREIGN KEY `recommends_user_id_users_id_fk`;
--> statement-breakpoint
ALTER TABLE `user_friends` DROP FOREIGN KEY `user_friends_user_id_users_id_fk`;
--> statement-breakpoint
ALTER TABLE `friend_requests` ADD CONSTRAINT `friend_requests_user1_users_id_fk` FOREIGN KEY (`user1`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `recommends` ADD CONSTRAINT `recommends_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `user_friends` ADD CONSTRAINT `user_friends_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE cascade;