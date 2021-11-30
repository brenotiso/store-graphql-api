import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitiDb1638139761357 implements MigrationInterface {
  name = 'InitiDb1638139761357';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "product" ("created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "deleted_at" datetime, "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "image_url" varchar NOT NULL, "description" varchar NOT NULL, "weight" decimal NOT NULL, "price" decimal(13,2) NOT NULL, "stock" decimal NOT NULL)`
    );
    await queryRunner.query(
      `CREATE TABLE "order_product" ("created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "deleted_at" datetime, "order_id" integer NOT NULL, "product_id" integer NOT NULL, "quantity" decimal NOT NULL, "observation" varchar NOT NULL, PRIMARY KEY ("order_id", "product_id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "order" ("created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "deleted_at" datetime, "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "status" varchar NOT NULL, "parcels" integer NOT NULL, "customer_id" integer NOT NULL)`
    );
    await queryRunner.query(
      `CREATE TABLE "customer" ("created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "deleted_at" datetime, "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "email" varchar NOT NULL, "cpf" varchar NOT NULL, "birthDate" date NOT NULL, CONSTRAINT "UQ_fdb2f3ad8115da4c7718109a6eb" UNIQUE ("email"), CONSTRAINT "UQ_e96edf3964ada73dc7e048d4f31" UNIQUE ("cpf"))`
    );
    await queryRunner.query(
      `CREATE TABLE "customer_address" ("created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "deleted_at" datetime, "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "customer_id" integer NOT NULL, "street" varchar NOT NULL, "number" integer NOT NULL, "neighborhood" varchar NOT NULL, "city" varchar NOT NULL, "state" varchar NOT NULL, "country" varchar NOT NULL, "postal_code" varchar NOT NULL, CONSTRAINT "REL_1f5ed21a5f3390cdbafb6f2245" UNIQUE ("customer_id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_order_product" ("created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "deleted_at" datetime, "order_id" integer NOT NULL, "product_id" integer NOT NULL, "quantity" decimal NOT NULL, "observation" varchar NOT NULL, CONSTRAINT "FK_ea143999ecfa6a152f2202895e2" FOREIGN KEY ("order_id") REFERENCES "order" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_400f1584bf37c21172da3b15e2d" FOREIGN KEY ("product_id") REFERENCES "product" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, PRIMARY KEY ("order_id", "product_id"))`
    );
    await queryRunner.query(
      `INSERT INTO "temporary_order_product"("created_at", "updated_at", "deleted_at", "order_id", "product_id", "quantity", "observation") SELECT "created_at", "updated_at", "deleted_at", "order_id", "product_id", "quantity", "observation" FROM "order_product"`
    );
    await queryRunner.query(`DROP TABLE "order_product"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_order_product" RENAME TO "order_product"`
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_order" ("created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "deleted_at" datetime, "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "status" varchar NOT NULL, "parcels" integer NOT NULL, "customer_id" integer NOT NULL, CONSTRAINT "FK_cd7812c96209c5bdd48a6b858b0" FOREIGN KEY ("customer_id") REFERENCES "customer" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`
    );
    await queryRunner.query(
      `INSERT INTO "temporary_order"("created_at", "updated_at", "deleted_at", "id", "status", "parcels", "customer_id") SELECT "created_at", "updated_at", "deleted_at", "id", "status", "parcels", "customer_id" FROM "order"`
    );
    await queryRunner.query(`DROP TABLE "order"`);
    await queryRunner.query(`ALTER TABLE "temporary_order" RENAME TO "order"`);
    await queryRunner.query(
      `CREATE TABLE "temporary_customer_address" ("created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "deleted_at" datetime, "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "customer_id" integer NOT NULL, "street" varchar NOT NULL, "number" integer NOT NULL, "neighborhood" varchar NOT NULL, "city" varchar NOT NULL, "state" varchar NOT NULL, "country" varchar NOT NULL, "postal_code" varchar NOT NULL, CONSTRAINT "REL_1f5ed21a5f3390cdbafb6f2245" UNIQUE ("customer_id"), CONSTRAINT "FK_1f5ed21a5f3390cdbafb6f22452" FOREIGN KEY ("customer_id") REFERENCES "customer" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`
    );
    await queryRunner.query(
      `INSERT INTO "temporary_customer_address"("created_at", "updated_at", "deleted_at", "id", "customer_id", "street", "number", "neighborhood", "city", "state", "country", "postal_code") SELECT "created_at", "updated_at", "deleted_at", "id", "customer_id", "street", "number", "neighborhood", "city", "state", "country", "postal_code" FROM "customer_address"`
    );
    await queryRunner.query(`DROP TABLE "customer_address"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_customer_address" RENAME TO "customer_address"`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "customer_address" RENAME TO "temporary_customer_address"`
    );
    await queryRunner.query(
      `CREATE TABLE "customer_address" ("created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "deleted_at" datetime, "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "customer_id" integer NOT NULL, "street" varchar NOT NULL, "number" integer NOT NULL, "neighborhood" varchar NOT NULL, "city" varchar NOT NULL, "state" varchar NOT NULL, "country" varchar NOT NULL, "postal_code" varchar NOT NULL, CONSTRAINT "REL_1f5ed21a5f3390cdbafb6f2245" UNIQUE ("customer_id"))`
    );
    await queryRunner.query(
      `INSERT INTO "customer_address"("created_at", "updated_at", "deleted_at", "id", "customer_id", "street", "number", "neighborhood", "city", "state", "country", "postal_code") SELECT "created_at", "updated_at", "deleted_at", "id", "customer_id", "street", "number", "neighborhood", "city", "state", "country", "postal_code" FROM "temporary_customer_address"`
    );
    await queryRunner.query(`DROP TABLE "temporary_customer_address"`);
    await queryRunner.query(`ALTER TABLE "order" RENAME TO "temporary_order"`);
    await queryRunner.query(
      `CREATE TABLE "order" ("created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "deleted_at" datetime, "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "status" varchar NOT NULL, "parcels" integer NOT NULL, "customer_id" integer NOT NULL)`
    );
    await queryRunner.query(
      `INSERT INTO "order"("created_at", "updated_at", "deleted_at", "id", "status", "parcels", "customer_id") SELECT "created_at", "updated_at", "deleted_at", "id", "status", "parcels", "customer_id" FROM "temporary_order"`
    );
    await queryRunner.query(`DROP TABLE "temporary_order"`);
    await queryRunner.query(
      `ALTER TABLE "order_product" RENAME TO "temporary_order_product"`
    );
    await queryRunner.query(
      `CREATE TABLE "order_product" ("created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "deleted_at" datetime, "order_id" integer NOT NULL, "product_id" integer NOT NULL, "quantity" decimal NOT NULL, "observation" varchar NOT NULL, PRIMARY KEY ("order_id", "product_id"))`
    );
    await queryRunner.query(
      `INSERT INTO "order_product"("created_at", "updated_at", "deleted_at", "order_id", "product_id", "quantity", "observation") SELECT "created_at", "updated_at", "deleted_at", "order_id", "product_id", "quantity", "observation" FROM "temporary_order_product"`
    );
    await queryRunner.query(`DROP TABLE "temporary_order_product"`);
    await queryRunner.query(`DROP TABLE "customer_address"`);
    await queryRunner.query(`DROP TABLE "customer"`);
    await queryRunner.query(`DROP TABLE "order"`);
    await queryRunner.query(`DROP TABLE "order_product"`);
    await queryRunner.query(`DROP TABLE "product"`);
  }
}
