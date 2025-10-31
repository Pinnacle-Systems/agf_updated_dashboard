-- AddForeignKey
ALTER TABLE `useronpage` ADD CONSTRAINT `useronpage_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
