CREATE TABLE `markers` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text,
	`description` text,
	`coordinate` text NOT NULL,
	`created_at` integer DEFAULT (cast(strftime('%s','now') as integer) * 1000) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `photos` (
	`id` text PRIMARY KEY NOT NULL,
	`uri` text,
	`added_at` integer DEFAULT (cast(strftime('%s','now') as integer) * 1000) NOT NULL
);
