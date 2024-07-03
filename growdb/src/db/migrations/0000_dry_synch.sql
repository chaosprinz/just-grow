CREATE TABLE `collectionTypeToStation` (
	`collectionTypeId` integer NOT NULL,
	`stationId` integer NOT NULL,
	PRIMARY KEY(`collectionTypeId`, `stationId`),
	FOREIGN KEY (`collectionTypeId`) REFERENCES `collectionTypes`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`stationId`) REFERENCES `stations`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `collectionTypes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text
);
--> statement-breakpoint
CREATE TABLE `measurementCollections` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`createdAt` integer DEFAULT (UNIXEPOCH(CURRENT_TIMESTAMP)),
	`updatedAt` integer DEFAULT (UNIXEPOCH(CURRENT_TIMESTAMP)),
	`collectionTypeId` integer,
	FOREIGN KEY (`collectionTypeId`) REFERENCES `collectionTypes`(`id`) ON UPDATE cascade ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `stationTypes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `stations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`stationTypeId` integer,
	FOREIGN KEY (`stationTypeId`) REFERENCES `stationTypes`(`id`) ON UPDATE cascade ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `tempHumidMeasurements` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`temperature` integer NOT NULL,
	`humidity` integer NOT NULL,
	`stationId` integer,
	`collectionId` integer,
	FOREIGN KEY (`stationId`) REFERENCES `stations`(`id`) ON UPDATE cascade ON DELETE set null,
	FOREIGN KEY (`collectionId`) REFERENCES `measurementCollections`(`id`) ON UPDATE cascade ON DELETE set null
);
--> statement-breakpoint
CREATE UNIQUE INDEX `collectionTypes_name_unique` ON `collectionTypes` (`name`);--> statement-breakpoint
CREATE UNIQUE INDEX `stationTypes_name_unique` ON `stationTypes` (`name`);