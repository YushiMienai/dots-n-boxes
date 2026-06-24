import {ReactNode} from 'react'

interface IAuthLayout {
  children: ReactNode
  links?: ReactNode
}

export const AuthLayout = ({children, links}: IAuthLayout) => {

  return (
    <div className='pageContainer bgGradientBlue'>
      <div className='card'>
        {children}
        {links ? <div className='linksContainer'>{links}</div> : <></>}
      </div>
    </div>
  )
}