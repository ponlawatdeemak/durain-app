import React from 'react'
import { Button } from '@mui/material'
import { useRouter } from 'next/router'
import { AppPath } from '@/config/app.config'

const SideBar = () => {
	const router = useRouter()
	return (
		<div className='flex w-full max-w-[90px] flex-1 flex-col bg-white'>
			<div>SideBar</div>
			<Button onClick={() => router.push(AppPath.Overview)}>Overview</Button>
			<Button onClick={() => router.push(AppPath.UserManagement)}>UM</Button>
		</div>
	)
}

export default SideBar
