interface SvgImageProps {
  className: string
  path: string
}

export const SvgImage = ({className, path}: SvgImageProps) => {

  return (
    <svg className={className} fill='none' stroke='currentColor' viewBox='0 0 24 24'>
      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d={path} />
    </svg>
  )
}
