-- ============================================================
-- AZM Flow — Production Database Schema
-- Run in Supabase Dashboard → SQL Editor → New Query
-- Idempotent: safe to run multiple times
-- ============================================================

-- ===================== CLEANUP (idempotent) =====================

DROP TABLE IF EXISTS "DeliveryAttempt" CASCADE;
DROP TABLE IF EXISTS "Shipment" CASCADE;
DROP TABLE IF EXISTS "Partner" CASCADE;
DROP TABLE IF EXISTS "User" CASCADE;

DROP TYPE IF EXISTS "ShipmentStatus" CASCADE;
DROP TYPE IF EXISTS "PartnerType" CASCADE;
DROP TYPE IF EXISTS "UserRole" CASCADE;

DROP FUNCTION IF EXISTS "update_updated_at_column" CASCADE;

-- ===================== ENUMS =====================

CREATE TYPE "UserRole" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'GENERAL_MANAGER', 'PROJECT_MANAGER', 'ACCOUNTANT', 'DATA_ENTRY', 'DISPATCHER', 'AGENT');

CREATE TYPE "PartnerType" AS ENUM ('ECOMMERCE', 'LOGISTICS');

CREATE TYPE "ShipmentStatus" AS ENUM (
  'NEW',
  'RECEIVED',
  'READY',
  'ASSIGNED',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
  'FAILED',
  'RETURNED'
);

-- ===================== TABLES =====================

CREATE TABLE "User" (
  "id"        TEXT        NOT NULL PRIMARY KEY,
  "name"      TEXT        NOT NULL,
  "username"  TEXT        NOT NULL,
  "phone"     TEXT        NOT NULL,
  "role"      "UserRole" NOT NULL,
  "password"  TEXT        NOT NULL,
  "jobTitle"  TEXT        NOT NULL DEFAULT '',
  "isActive"  BOOLEAN     NOT NULL DEFAULT TRUE,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Partner" (
  "id"        TEXT          NOT NULL PRIMARY KEY,
  "name"      TEXT          NOT NULL,
  "type"      "PartnerType" NOT NULL,
  "city"      TEXT          NOT NULL,
  "phone"     TEXT          NOT NULL,
  "isActive"  BOOLEAN       NOT NULL DEFAULT TRUE,
  "createdAt" TIMESTAMPTZ   NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ   NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Shipment" (
  "id"              TEXT            NOT NULL PRIMARY KEY,
  "trackingNumber"  TEXT            NOT NULL,
  "partnerId"       TEXT            NOT NULL,
  "agentId"         TEXT,
  "customerName"    TEXT            NOT NULL,
  "customerPhone"   TEXT            NOT NULL,
  "district"        TEXT            NOT NULL,
  "status"          "ShipmentStatus" NOT NULL DEFAULT 'NEW',
  "notes"           TEXT,
  "createdAt"       TIMESTAMPTZ     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"       TIMESTAMPTZ     NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "fk_shipment_partner"
    FOREIGN KEY ("partnerId") REFERENCES "Partner"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE,

  CONSTRAINT "fk_shipment_agent"
    FOREIGN KEY ("agentId") REFERENCES "User"("id")
    ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE "DeliveryAttempt" (
  "id"            TEXT        NOT NULL PRIMARY KEY,
  "shipmentId"    TEXT        NOT NULL,
  "agentId"       TEXT        NOT NULL,
  "failureReason" TEXT,
  "attemptDate"   TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "fk_delivery_shipment"
    FOREIGN KEY ("shipmentId") REFERENCES "Shipment"("id")
    ON DELETE CASCADE ON UPDATE CASCADE,

  CONSTRAINT "fk_delivery_agent"
    FOREIGN KEY ("agentId") REFERENCES "User"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE
);

-- ===================== UNIQUE CONSTRAINTS =====================

ALTER TABLE "User"     ADD CONSTRAINT "uq_user_username"      UNIQUE ("username");
ALTER TABLE "User"     ADD CONSTRAINT "uq_user_phone"         UNIQUE ("phone");
ALTER TABLE "Shipment" ADD CONSTRAINT "uq_shipment_tracking"  UNIQUE ("trackingNumber");

-- ===================== INDEXES =====================

CREATE INDEX "idx_user_role"             ON "User" ("role");
CREATE INDEX "idx_partner_type"          ON "Partner" ("type");
CREATE INDEX "idx_shipment_partner"      ON "Shipment" ("partnerId");
CREATE INDEX "idx_shipment_agent"        ON "Shipment" ("agentId");
CREATE INDEX "idx_shipment_status"       ON "Shipment" ("status");
CREATE INDEX "idx_shipment_district"     ON "Shipment" ("district");
CREATE INDEX "idx_shipment_created_at"   ON "Shipment" ("createdAt");
CREATE INDEX "idx_delivery_shipment"     ON "DeliveryAttempt" ("shipmentId");
CREATE INDEX "idx_delivery_agent"        ON "DeliveryAttempt" ("agentId");
CREATE INDEX "idx_delivery_attempt_date" ON "DeliveryAttempt" ("attemptDate");

-- ===================== UPDATED_AT TRIGGER =====================

CREATE OR REPLACE FUNCTION "update_updated_at_column"()
RETURNS TRIGGER AS $$
BEGIN
  NEW."updatedAt" = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- User
DROP TRIGGER IF EXISTS "trg_user_updated_at" ON "User";
CREATE TRIGGER "trg_user_updated_at"
  BEFORE UPDATE ON "User"
  FOR EACH ROW
  EXECUTE FUNCTION "update_updated_at_column"();

-- Partner
DROP TRIGGER IF EXISTS "trg_partner_updated_at" ON "Partner";
CREATE TRIGGER "trg_partner_updated_at"
  BEFORE UPDATE ON "Partner"
  FOR EACH ROW
  EXECUTE FUNCTION "update_updated_at_column"();

-- Shipment
DROP TRIGGER IF EXISTS "trg_shipment_updated_at" ON "Shipment";
CREATE TRIGGER "trg_shipment_updated_at"
  BEFORE UPDATE ON "Shipment"
  FOR EACH ROW
  EXECUTE FUNCTION "update_updated_at_column"();

-- ===================== VERIFICATION =====================

DO $$
BEGIN
  RAISE NOTICE 'Schema created successfully: User, Partner, Shipment, DeliveryAttempt';
END $$;

-- ===================== DONE =====================
