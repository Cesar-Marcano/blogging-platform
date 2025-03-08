-- CreateTable
CREATE TABLE "Session" (
    "id" UUID NOT NULL,
    "userId" INTEGER NOT NULL,
    "expiration" TIMESTAMP(3) NOT NULL,
    "ipAddress" INET NOT NULL,
    "userAgent" TEXT NOT NULL,
    "clientUUID" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- CreateIndex
CREATE INDEX "Session_id_idx" ON "Session"("id");

-- CreateIndex
CREATE INDEX "Session_userId_id_idx" ON "Session"("userId", "id");

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
