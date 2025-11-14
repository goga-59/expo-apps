PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_markers` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text,
	`description` text,
	`coordinate` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_markers`("id", "title", "description", "coordinate", "created_at") SELECT "id", "title", "description", "coordinate", "created_at" FROM `markers`;--> statement-breakpoint
DROP TABLE `markers`;--> statement-breakpoint
ALTER TABLE `__new_markers` RENAME TO `markers`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_photos` (
	`id` text PRIMARY KEY NOT NULL,
	`uri` text NOT NULL,
	`marker_id` text NOT NULL,
	`added_at` integer NOT NULL,
	FOREIGN KEY (`marker_id`) REFERENCES `markers`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_photos`("id", "uri", "marker_id", "added_at") SELECT "id", "uri", "marker_id", "added_at" FROM `photos`;--> statement-breakpoint
DROP TABLE `photos`;--> statement-breakpoint
ALTER TABLE `__new_photos` RENAME TO `photos`;