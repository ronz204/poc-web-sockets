INSERT INTO "sample"."roles" (name, "createdAt", "updatedAt") VALUES
('ADMIN', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('SALES', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('USER', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO "sample"."scopes" (name, "createdAt", "updatedAt") VALUES
-- User scopes
('user:read', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('user:write', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('user:delete', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
-- Sales scopes
('sales:read', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('sales:write', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('sales:report', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
-- Admin scopes
('system:admin', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO "sample"."_RoleToScope" ("A", "B") VALUES
-- Admin has all scopes
(1, 7),
-- Sales has sales scopes
(2, 4), (2, 5), (2, 6),
-- User has user scopes
(3, 1), (3, 2);
