import {useState, useRef, ReactNode} from 'react'
import {Link} from 'react-router-dom'
import {MenuItemsProps} from '@types'
import {list} from '@utils'
import {SvgImage} from '../svgImage.tsx'

interface MenuMobileProps {
  name: string
  children: ReactNode
  menuItems: MenuItemsProps[]
}

export const MenuMobile = ({
                             name,
                             children,
                             menuItems,
                           }: MenuMobileProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const link = (to: string, title: string, svgPath: string) =>
    <Link to={to} onClick={() => setIsMenuOpen(false)} className='menu-sidebar-item'>
      <SvgImage className='menu-sidebar-icon' path={svgPath} />
      <span>{title}</span>
    </Link>

  const button = (onClick: () => void, className: string, title: string, svgPath: string) =>
    <button onClick={onClick} className={className}>
      <SvgImage className='menu-sidebar-icon' path={svgPath} />
      <span>{title}</span>
    </button>

  return (
    <div className='menu-mobile-wrapper' ref={menuRef}>
      <button onClick={() => setIsMenuOpen((prev) => !prev)} className='menu-mobile-btn' aria-label='Меню'>
        {isMenuOpen ? (
          <svg className='menu-mobile-icon' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
          </svg>
        ) : (
          <svg className='menu-mobile-icon' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 6h16M4 12h16M4 18h16' />
          </svg>
        )}
      </button>


      <div
        className={`menu-overlay ${isMenuOpen ? 'open' : ''}`}
        onClick={() => setIsMenuOpen(false)}
      />
      <div className={`menu-sidebar ${isMenuOpen ? 'open' : ''}`}>
        <div className='menu-sidebar-content'>
          <div className='menu-sidebar-header'>
            <span className='menu-sidebar-title'>Меню</span>
            <button onClick={() => setIsMenuOpen(false)} className='menu-sidebar-close'>
              <svg className='menu-sidebar-close-icon' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
              </svg>
            </button>
          </div>

          <div className='menu-sidebar-body'>
            {name && (
              <div className='menu-sidebar-profile'>
                <div className='menu-sidebar-profile-content'>
                  <div className='menu-sidebar-avatar'>
                    <svg className='menu-sidebar-avatar-icon' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' />
                    </svg>
                  </div>
                  <div>
                    <div className='menu-sidebar-profile-name'>{name}</div>
                    <div className='menu-sidebar-profile-status'>
                      <div className='menu-sidebar-status-dot'></div>
                      Онлайн
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className='menu-sidebar-items'>
              {list(link, button, menuItems)}
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
