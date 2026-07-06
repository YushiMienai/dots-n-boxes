import {JSX} from 'react'

export interface MenuLinkProps {
  to: string,
  title: string,
  svgPath: string
}

export interface MenuButtonProps {
  onClick: () => void,
  className: string,
  title: string,
  svgPath: string
}

export interface MenuItemsProps {
  condition?: boolean
  className?: string
  onClick?: () => void
  to?: string
  title: string
  svgPath: string
}

export type RenderLink = (to: string, title: string, svgPath: string) => JSX.Element
export type RenderButton = (onClick: () => void, className: string, title: string, svgPath: string) => JSX.Element
