# Архитектура

## Слои

### HTTP (Fastify routes)
- Вход/выход из комнат (пароль, БД).
- Регистрация, логин, refresh (JWT).
- Создание комнат.
- **НЕ управляет сокетами.**

### Socket.IO
- Подписка на комнату (`join-room`, `leave-room`).
- Рассылка `game-state` (полное состояние) при входе/выходе.
- **НЕ пишет в БД.**
- **НЕ проверяет пароль.**

### GameManager (в памяти)
- Единственный источник правды для активных игр.
- `Map<roomId, IGameState>`.
- Не знает про `io`, не знает про БД (кроме `RoomService` для `maxPlayers`).

### Репозитории/Services (БД)
- `RoomService`, `PlayerService` — CRUD.
- `AuthService`, `TokenService` — JWT.

## Ключевые решения (и почему)

### HTTP для входа/выхода, Socket.IO для real-time
- HTTP: надёжно, пароль, БД. Если сокет упадёт — вход не сломается.
- Socket.IO: real-time уведомления.
- Связка на фронте: HTTP-успех → `GameBoard` монтируется → `socket.emit('join-room')`.

### `game-state` вместо `player-joined`
- Полное состояние идемпотентно.
- Пропущенное событие исправляется следующим `game-state`.
- Дельты (`player-joined`) — перекладывание ответственности на фронт.

### Мягкое отключение (disconnect) vs жёсткое (leave-room)
- `disconnect`: `isOnline: false`, `socketId: null`. Игрок остаётся (F5).
- `leave-room`: полное удаление. Игрок вышел.

### `isOnline` — только в памяти, не в БД
- Это runtime-статус, не персистентные данные.
- `GameManager` — единственный источник.

### `game_states` в БД — пока не используется
- Снапшоты для восстановления/истории. Позже.

## Поток входа
1. `PUT /player/room/:id` — пароль, БД (`game_room_id`).
2. Фронт → `/rooms/:id`.
3. `GameBoard` монтируется → `socket.emit('join-room')`.
4. `GameManager.handlePlayerJoin` → `io.emit('game-state')`.

## Поток выхода
1. `DELETE /player/room` — БД (`game_room_id = null`).
2. Фронт → `/rooms`.
3. `GameBoard` размонтируется → `socket.emit('leave-room')`.
4. `GameManager.handlePlayerLeave` → `io.emit('game-state')`.

## Поток F5
1. `App` монтирует → `socket.connect()`.
2. `GameBoard` → `socket.emit('join-room')`.
3. `handlePlayerJoin` находит `existing` по `playerId`, обновляет `socketId`.
4. Счёт сохранён. `game-state` разослан.