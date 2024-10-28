import { PropsWithChildren } from 'react'

interface PageContainerProps extends PropsWithChildren {}

export default function PageContainer({ children }: PageContainerProps) {
	return <div className='flex flex-1 flex-col overflow-auto'>{children}</div>
}
