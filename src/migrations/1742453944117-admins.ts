import { MigrationInterface, QueryRunner } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Role } from 'src/roles/interfaces/role.interface';

export class Admins1742453944117 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Get the roleId of "admin"
    const role = (await queryRunner.query(
      `SELECT id FROM roles WHERE name = 'admin' LIMIT 1;`,
    )) as Role[];

    if (!role.length) {
      console.log('No "admin" role found. Insert an "admin" role first.');
      return;
    }
    const roleId: number = role[0]?.id;

    const hashedPassword: string = await bcrypt.hash('Admin@123', 10);

    console.log('Executing Query:', {
      query: `INSERT INTO users (name, email, password, "roleId", "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, NOW(), NOW())`,
      params: ['Admin', 'admin@gmail.com', hashedPassword, roleId],
    });

    // Use parameterized query to prevent issues
    await queryRunner.query(
      `INSERT INTO users (name, email, password, "roleId", "createdAt", "updatedAt")
           VALUES ($1, $2, $3, $4, NOW(), NOW())`,
      ['Admin', 'admin@gmail.com', hashedPassword, roleId],
    );

    console.log('✅ Admin user inserted successfully!');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM users WHERE email = 'admin@gmail.com';`,
    );
  }
}
