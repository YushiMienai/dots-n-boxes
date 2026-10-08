import {EAccessLevel} from './enums.ts'

export const ACCESS_OPTIONS: {value: EAccessLevel; label: string; hint: string}[] = [
  {value: EAccessLevel.PUBLIC,       label: 'Публичная',             hint: 'Заходит кто угодно'},
  {value: EAccessLevel.PASSWORD,     label: 'По паролю',             hint: 'Нужен пароль для входа'},
  {value: EAccessLevel.FRIENDS_ONLY, label: 'Только для друзей',     hint: 'Друзья владельца + по инвайту'},
  {value: EAccessLevel.INVITE_ONLY,  label: 'Только по приглашению', hint: 'Вход только по инвайт-ссылке'}
]

export const PLAYER_COUNTS = [2, 3, 4]
