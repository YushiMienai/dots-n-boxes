import {MigrationInterface, QueryRunner} from 'typeorm'

export class AddIsGameFinishedToGameRooms1700000000004 implements MigrationInterface {
  name = 'AddIsGameFinishedToGameRooms1700000000004'

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Добавляем колонку is_game_finished с значением по умолчанию false
    await queryRunner.query(`
            ALTER TABLE game_rooms 
            ADD COLUMN is_game_finished BOOLEAN NOT NULL DEFAULT false
        `)

    // Создаём индекс для быстрого поиска активных игр
    await queryRunner.query(`
            CREATE INDEX idx_game_rooms_is_game_finished ON game_rooms(is_game_finished)
        `)

    // Комбинационный индекс для поиска активных публичных комнат
    await queryRunner.query(`
            CREATE INDEX idx_game_rooms_active_public 
            ON game_rooms(is_game_finished, is_private) 
            WHERE is_game_finished = false AND is_private = false
        `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Удаляем индексы
    await queryRunner.query('DROP INDEX idx_game_rooms_active_public')
    await queryRunner.query('DROP INDEX idx_game_rooms_is_game_finished')

    // Удаляем колонку
    await queryRunner.query(`
            ALTER TABLE game_rooms 
            DROP COLUMN is_game_finished
        `)
  }
}
