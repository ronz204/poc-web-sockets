-- CreateTable
CREATE TABLE "sample"."sessions" (
    "id" SERIAL NOT NULL,
    "hash" TEXT NOT NULL,
    "agent" TEXT NOT NULL,
    "device" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "revokedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "sessions_hash_key" ON "sample"."sessions"("hash");

-- CreateIndex
CREATE INDEX "sessions_userId_idx" ON "sample"."sessions"("userId");

-- AddForeignKey
ALTER TABLE "sample"."sessions" ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "sample"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
