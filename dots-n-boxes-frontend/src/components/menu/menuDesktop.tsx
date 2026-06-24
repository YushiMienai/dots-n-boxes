import {ReactNode} from 'react'
import {SvgImage} from '../svgImage.tsx'
import {Link} from 'react-router-dom'
import {MenuItemsProps} from '@types'
import {list} from '@utils'

interface MenuDesktopProps {
  name: string
  children: ReactNode
  menuItems: MenuItemsProps[]
}

export const MenuDesktop = ({name, children, menuItems}: MenuDesktopProps) => {

  const link = (to: string, title: string, svgPath: string) =>
    <Link to={to} className='menu-btn-link'>
      <SvgImage className='menu-icon-sm' path={svgPath} />
      <span>{title}</span>
    </Link>

  const button = (onClick: () => void, className: string, title: string, svgPath: string) =>
    <button onClick={onClick} className={className}>
      <SvgImage className='menu-icon-sm' path={svgPath} />
      <span>{title}</span>
    </button>

  return (
    <div className='menu-desktop'>
      {name && (
        <div className='menu-player-badge'>
          <div className='menu-player-status'></div>
          <span className='menu-player-name'>{name}</span>
        </div>
      )}
      {list(link, button, menuItems)}
      {children}
    </div>
  )
}
