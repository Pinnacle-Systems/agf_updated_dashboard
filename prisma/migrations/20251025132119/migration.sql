-- CreateTable
CREATE TABLE `role` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `rolename` VARCHAR(191) NULL,
    `active` BOOLEAN NULL DEFAULT true,

    UNIQUE INDEX `Role_rolename_key`(`rolename`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `roleId` INTEGER NULL,
    `username` VARCHAR(191) NULL,
    `employeeId` VARCHAR(191) NULL,
    `active` BOOLEAN NULL DEFAULT true,
    `password` VARCHAR(191) NULL,
    `COMPCODE` VARCHAR(191) NULL,

    UNIQUE INDEX `User_username_key`(`username`),
    UNIQUE INDEX `User_employeeId_key`(`employeeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `useronpage` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `roleId` INTEGER NULL,
    `username` VARCHAR(191) NULL,
    `active` BOOLEAN NULL DEFAULT true,
    `read` BOOLEAN NULL DEFAULT false,
    `create` BOOLEAN NULL DEFAULT false,
    `edit` BOOLEAN NULL DEFAULT false,
    `link` VARCHAR(191) NULL,
    `delete` BOOLEAN NULL DEFAULT false,
    `isdefault` BOOLEAN NULL DEFAULT false,
    `userId` INTEGER NOT NULL,

    INDEX `UserOnPage_userId_fkey`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
