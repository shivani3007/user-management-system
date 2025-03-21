import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class Roles1742453641212 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const tableExists = await queryRunner.hasTable('roles');

    if (!tableExists) {
      await queryRunner.createTable(
        new Table({
          name: 'roles',
          columns: [
            {
              name: 'id',
              type: 'integer', // Change "number" to "integer"
              isPrimary: true,
              isGenerated: true,
              generationStrategy: 'increment',
            },
            {
              name: 'name',
              type: 'varchar',
              isUnique: true,
            },
          ],
        }),
      );
    }
    await queryRunner.query(`
            INSERT INTO roles (name) VALUES ('admin'), ('user')
          `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM roles WHERE name IN ('admin', 'user');`,
    );
  }
}
