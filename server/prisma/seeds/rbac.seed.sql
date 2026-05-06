INSERT INTO "sample"."roles" (name, "createdAt", "updatedAt") VALUES
('ADMIR', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('USER', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO "sample"."scopes" (name, "createdAt", "updatedAt") VALUES
('user:read', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('user:write', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('user:delete', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('system:admin', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO "sample"."_RoleToScope" ("A", "B") VALUES
(1, 4), (2, 1), (2, 2);
