
CREATE TABLE "user" (
  "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
  "user_name" VARCHAR(64) NOT NULL,
  "public_name" VARCHAR(64) NOT NULL,
  "private_name" VARCHAR(64) NOT NULL,
  "email" VARCHAR(128) NOT NULL,
  "salt" CHAR(32) NOT NULL,
  "password" VARCHAR(256) NOT NULL,
  "status" SMALLINT NOT NULL DEFAULT 0,  
  "birthdate" DATE NULL,
  "login_at" TIMESTAMP NULL,
  "login_attempts" SMALLINT NOT NULL DEFAULT 0,
  "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY("id")
);
