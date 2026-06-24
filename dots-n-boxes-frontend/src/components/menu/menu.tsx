import {Link} from 'react-router-dom'
import {useLeaveRoom, useLogout} from '@hooks'
import {useAuthStore, usePlayerStore} from '@stores'
import {LEAVE_ROOM, LOGO, LOGOUT, PROFILE, SETTINGS} from '@svg'
import {MenuDesktop} from './menuDesktop.tsx'
import {MenuMobile} from './menuMobile.tsx'
import {SvgImage} from '../svgImage.tsx'

export const Menu = () => {
  const name = useAuthStore(state => state.name)
  const currentRoomId = usePlayerStore(state => state.currentRoomId)
  const isInRoom = !!currentRoomId
  const logout = useLogout()
  const leaveRoom = useLeaveRoom()

  const handleLogout = () => {
    logout.mutate()
  }

  const handleLeaveRoom = () => {
    leaveRoom.mutate()
  }

  const menuItems = [
    ...(isInRoom ? [{
      className: 'menu-btn-base menu-btn-leave',
      onClick: handleLeaveRoom,
      title: 'Покинуть',
      svgPath: LEAVE_ROOM
    }] : []),
    {
      to: '/profile',
      title: 'Профиль',
      svgPath: PROFILE
    },
    {
      to: '/settings',
      title: 'Настройки',
      svgPath: SETTINGS
    }
  ]

  return (
    <nav className='menu-nav'>
      <div className='menu-container'>
        <div className='menu-content'>
          <Link to='/rooms' className='menu-logo'>
            <div className='menu-logo-icon'>
              <SvgImage className='menu-logo-icon-svg' path={LOGO} />
            </div>
            <span className='menu-logo-text'>Dots & Boxes</span>
          </Link>

          <div className='menu-actions'>
            <MenuDesktop
              name={name}
              menuItems={menuItems}
            >
              <button onClick={handleLogout} disabled={logout.isPending} className='menu-btn-logout'>
                <SvgImage className='menu-icon-sm' path={LOGOUT} />
                <span>{logout.isPending ? 'Выход...' : 'Выйти'}</span>
              </button>
            </MenuDesktop>

            <MenuMobile name={name} menuItems={menuItems}>
              <div className='menu-sidebar-footer'>
                <button onClick={handleLogout} disabled={logout.isPending} className='menu-sidebar-item-logout'>
                  <SvgImage className='menu-sidebar-icon' path={LOGOUT} />
                  <span>{logout.isPending ? 'Выход...' : 'Выйти из аккаунта'}</span>
                </button>
              </div>
            </MenuMobile>
          </div>
        </div>
      </div>
    </nav>
  )
}
