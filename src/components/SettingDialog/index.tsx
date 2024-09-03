import { Button, Dialog, DialogContent, DialogContentText, DialogTitle } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/router'
import { Languages } from '@/config/app.config'
import { AreaUnitKey } from '@/enum'

interface SettingDialogProps {
	open: boolean
	onClose: () => void
}

const SettingDialog: React.FC<SettingDialogProps> = ({ ...props }) => {
	const router = useRouter()
	const { open, onClose } = props
	const { t, i18n } = useTranslation('common')

	const switchLanguage = (locale: Languages) => {
		i18n.changeLanguage(Languages.EN)
		router.push(
			{
				pathname: router.pathname,
				query: router.query,
			},
			router.asPath,
			{ locale },
		)
	}

	const switchUnit = (unit: AreaUnitKey) => {
		console.log('unit', unit)
	}

	return (
		<Dialog open={open} onClose={onClose}>
			<DialogTitle>การตั้งค่า</DialogTitle>
			<DialogContent>
				<DialogContentText>หน่วยพื้นที่</DialogContentText>
				<Button onClick={() => switchUnit(AreaUnitKey.Rai)}>ไร่</Button>
				<Button onClick={() => switchUnit(AreaUnitKey.Sqkm)}>ตร.กม</Button>
				<Button onClick={() => switchUnit(AreaUnitKey.Hectare)}>เฮกตาร์</Button>
				<DialogContentText>เปลี่ยนภาษา</DialogContentText>
				<Button onClick={() => switchLanguage(Languages.TH)}>ภาษาไทย</Button>
				<Button onClick={() => switchLanguage(Languages.EN)}>English</Button>
			</DialogContent>
		</Dialog>
	)
}

export default SettingDialog
