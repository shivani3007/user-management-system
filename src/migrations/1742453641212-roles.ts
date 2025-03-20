import { MigrationInterface, QueryRunner } from 'typeorm';

export class Roles1742453641212 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
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
