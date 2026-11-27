## HTTP

| Метод | Путь | Описание |
|---|---|---|
| POST | /register | Регистрация |
| POST | /login | Логин, возвращает accessToken + roomId |
| POST | /refresh | Обновить accessToken |
| POST | /logout | Отозвать refresh |
| GET | /rooms | Список комнат |
| POST | /rooms | Создать комнату (`name`, `maxPlayers` 2–4, `boardSize` 5 или 10, `accessLevel`, `password`) |
| PUT | /player/room/:id | Войти в комнату (пароль) |
| DELETE | /player/room | Выйти из комнаты |

## Socket.IO

| Событие | Направление | Payload | Описание |
|---|---|---|---|
| join-room | client → server | {roomId} | Подписаться на комнату |
| leave-room | client → server | — | Отписаться, выйти |
| game-state | server → client | IGameState | Полное состояние |
| move | client → server | {roomId, move} | Ход (позже) |
| move-made | server → client | IMoveResult | Дельта хода (позже) |