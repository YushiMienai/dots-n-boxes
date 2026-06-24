import {MigrationInterface, QueryRunner} from 'typeorm'

export class AddPasswordToPlayers20251113154901 implements MigrationInterface {
  name = 'AddPasswordToPlayers20251113154901'

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Добавляем колонку password с временным DEFAULT
    await queryRunner.query(`
            ALTER TABLE players 
            ADD COLUMN password VARCHAR(100) NOT NULL DEFAULT 'temp_password'
        `)

    // Убираем DEFAULT после добавления данных
    await queryRunner.query(`
            ALTER TABLE players 
            ALTER COLUMN password DROP DEFAULT
        `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // ✅ Полный откат - удаляем колонку password
    await queryRunner.query(`
            ALTER TABLE players 
            DROP COLUMN password
        `)
  }
}