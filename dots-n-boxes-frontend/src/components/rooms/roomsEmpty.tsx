import {PLUS_SMALL} from '@svg'

export const RoomsEmpty = () => {

  return (
    <div className='rooms-empty'>
      <div className='rooms-empty-icon'>
        <svg className='rooms-empty-icon-svg' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d={PLUS_SMALL} />
        </svg>
      </div>
      <h3 className='rooms-empty-title'>Нет доступных комнат</h3>
      <p className='rooms-empty-text'>Создайте первую комнату и пригласите друзей!</p>
    </div>
  )
}