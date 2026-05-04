-- CreateTable
CREATE TABLE "sample"."scopes" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "scopes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sample"."_RoleToScope" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_RoleToScope_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "scopes_name_key" ON "sample"."scopes"("name");

-- CreateIndex
CREATE INDEX "_RoleToScope_B_index" ON "sample"."_RoleToScope"("B");

-- AddForeignKey
ALTER TABLE "sample"."_RoleToScope" ADD CONSTRAINT "_RoleToScope_A_fkey" FOREIGN KEY ("A") REFERENCES "sample"."roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sample"."_RoleToScope" ADD CONSTRAINT "_RoleToScope_B_fkey" FOREIGN KEY ("B") REFERENCES "sample"."scopes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
