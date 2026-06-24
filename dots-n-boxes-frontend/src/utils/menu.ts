import {JSX} from 'react'
import {MenuItemsProps, RenderButton, RenderLink} from '@types'

export const list = (
  link: RenderLink,
  button: RenderButton,
  menuItems: MenuItemsProps[]
): (JSX.Element | undefined)[] => menuItems.map((item) => {
  if (item.to) {
    return link(item.to, item.title, item.svgPath)
  } else if (item.onClick) {
    return button(item.onClick, item.className || '', item.title, item.svgPath)
  }
  return undefined
}).filter(Boolean)