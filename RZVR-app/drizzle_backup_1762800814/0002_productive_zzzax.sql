PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_staff` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`first_name` text(100),
	`last_name` text(100),
	`email` text(255) NOT NULL,
	`password` text(255) NOT NULL,
	`role` integer DEFAULT 0 NOT NULL,
	`created_at` text
);
--> statement-breakpoint
INSERT INTO `__new_staff`("id", "first_name", "last_name", "email", "password", "role", "created_at") SELECT "id", "first_name", "last_name", "email", "password", "role", "created_at" FROM `staff`;--> statement-breakpoint
DROP TABLE `staff`;--> statement-breakpoint
ALTER TABLE `__new_staff` RENAME TO `staff`;--> statement-breakpoint
PRAGMA foreign_keys=ON;