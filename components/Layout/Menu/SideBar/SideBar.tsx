import React from 'react'
import styles from './SideBar.module.css'
import { Button } from '@mui/material'
import { useRouter } from 'next/router'
import { AppPath } from '@/config/app.config'

const SideBar = () => {
	const router = useRouter()
	return (
		<div className={styles.main}>
			<div>SideBar</div>
			<Button onClick={() => router.push(AppPath.Overview)}>Overview</Button>
			<Button onClick={() => router.push(AppPath.UserManagement)}>UM</Button>
		</div>
	)
}

export default SideBar
