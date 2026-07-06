import {LOADER_SPIN} from '@svg'

export const Loader = ({title}: {title: string}) => {

  return (
    <div className='loadingContainer'>
      <div className='text-center'>
        <div className='iconContainer mx-auto mb-4'>
          <svg className='icon animate-spin' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d={LOADER_SPIN} />
          </svg>
        </div>
        <p className='loadingText'>{title}</p>
      </div>
    </div>
  )
}
