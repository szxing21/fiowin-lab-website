CREATE TABLE `conferences` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(128) NOT NULL,
	`fullName` text,
	`location` varchar(256),
	`startDate` timestamp NOT NULL,
	`endDate` timestamp,
	`year` int NOT NULL,
	`papers` int DEFAULT 0,
	`oral` int DEFAULT 0,
	`poster` int DEFAULT 0,
	`invited` int DEFAULT 0,
	`attendees` text,
	`invitedTalks` text,
	`description` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `conferences_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `members` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nameEn` varchar(128) NOT NULL,
	`nameCn` varchar(128) NOT NULL,
	`role` enum('PI','Postdoc','PhD','Master','Member') NOT NULL,
	`title` varchar(64),
	`year` varchar(32),
	`researchInterests` text,
	`bio` text,
	`publications` int DEFAULT 0,
	`citations` int DEFAULT 0,
	`hIndex` int DEFAULT 0,
	`awards` text,
	`photoUrl` text,
	`email` varchar(320),
	`displayOrder` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `members_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `news` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` text NOT NULL,
	`summary` text,
	`content` text,
	`category` varchar(64),
	`author` varchar(128),
	`coverImage` text,
	`publishedAt` timestamp NOT NULL,
	`featured` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `news_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `publications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` text NOT NULL,
	`journal` varchar(256),
	`year` int NOT NULL,
	`month` int,
	`firstAuthor` varchar(128),
	`authors` text,
	`labMembers` text,
	`keywords` text,
	`abstract` text,
	`doi` varchar(256),
	`url` text,
	`pdfUrl` text,
	`type` enum('journal','conference','patent') NOT NULL DEFAULT 'journal',
	`featured` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `publications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `researchAreas` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nameEn` varchar(256) NOT NULL,
	`nameCn` varchar(256) NOT NULL,
	`description` text,
	`topics` text,
	`icon` varchar(64),
	`displayOrder` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `researchAreas_id` PRIMARY KEY(`id`)
);
