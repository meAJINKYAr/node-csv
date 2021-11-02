DROP TABLE IF EXISTS `authors`;
DROP TABLE IF EXISTS `books`;
DROP TABLE IF EXISTS `magazines`;

CREATE TABLE `authors` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(255) NOT NULL,
    `firstname` VARCHAR(255) NOT NULL,
    `lastname` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP,
    PRIMARY KEY(`id`)
)ENGINE = InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `books` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `isbn` VARCHAR(255) NOT NULL,
    `authors` VARCHAR(255) NOT NULL,
    `description` VARCHAR(1000),
    `created_at` TIMESTAMP,
    PRIMARY KEY(`id`)
)ENGINE = InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `magazines` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `isbn` VARCHAR(255) NOT NULL,
    `authors` VARCHAR(255) NOT NULL,
    `publishedAt` DATE,
    `created_at` TIMESTAMP,
    PRIMARY KEY(`id`)
)ENGINE = InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;