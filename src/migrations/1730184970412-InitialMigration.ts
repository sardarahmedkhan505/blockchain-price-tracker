import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1730184970412 implements MigrationInterface {
    name = 'InitialMigration1730184970412'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_price_chain_timestamp"`);
        await queryRunner.query(`CREATE INDEX "IDX_e88d9388127e5be0f74796b718" ON "price" ("chain", "timestamp") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_e88d9388127e5be0f74796b718"`);
        await queryRunner.query(`CREATE INDEX "IDX_price_chain_timestamp" ON "price" ("chain", "timestamp") `);
    }

}
