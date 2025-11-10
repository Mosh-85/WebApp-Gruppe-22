CREATE TABLE `available_times` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`table_id` integer NOT NULL,
	`day_of_week` text(20),
	`open_time` text NOT NULL,
	`close_time` text NOT NULL,
	`slot_duration_minutes` integer
);
--> statement-breakpoint
CREATE TABLE `bookings` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`table_id` integer NOT NULL,
	`available_time_id` integer,
	`customer_first_name` text(100),
	`customer_last_name` text(100),
	`customer_email` text(255),
	`from_date_time` text NOT NULL,
	`until_date_time` text NOT NULL,
	`status` text(50),
	`vipps_transaction_id` text(255),
	`created_at` text
);
--> statement-breakpoint
CREATE TABLE `staff` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`first_name` text(100),
	`last_name` text(100),
	`email` text(255) NOT NULL,
	`password` text(255) NOT NULL,
	`role` text(50),
	`created_at` text
);
--> statement-breakpoint
CREATE TABLE `tables` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`seats` integer,
	`status` text(50)
);
--> statement-breakpoint
CREATE TABLE `qrcodes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`table_id` integer NOT NULL,
	`qr_data` text
);
--> statement-breakpoint
CREATE TABLE `waitlist` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`table_id` integer NOT NULL,
	`customer_name` text(150),
	`customer_email` text(255),
	`date_time` text,
	`status` text(50)
);
