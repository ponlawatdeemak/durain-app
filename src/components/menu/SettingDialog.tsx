import { Dialog, DialogContent, DialogTitle, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import { AreaUnit, Languages } from '@/enum'
import useAreaUnit from '@/store/area-unit'

interface SettingDialogProps {
	open: boolean
	onClose: () => void
}

const SettingDialog: React.FC<SettingDialogProps> = ({ ...props }) => {
	const { open, onClose } = props
	const router = useRouter()
	const { t, i18n } = useTranslation('common')
	const { areaUnit, setAreaUnit } = useAreaUnit()

	const handleUnitChange = (_: React.MouseEvent<HTMLElement>, unit: AreaUnit) => {
		if (unit !== null) setAreaUnit(unit)
	}

	const handleLangChange = (_: React.MouseEvent<HTMLElement>, locale: Languages) => {
		if (locale) {
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
	}

	return (
		<Dialog open={open} onClose={onClose}>
			<DialogTitle>{t('setting')}</DialogTitle>
			<DialogContent>
				<Typography className='text-sm'>{t('unitArea')}</Typography>
				<ToggleButtonGroup value={areaUnit} exclusive onChange={handleUnitChange}>
					<ToggleButton value={AreaUnit.Rai}>{t('unitRai')}</ToggleButton>
					<ToggleButton value={AreaUnit.Sqkm}>{t('unitSqkm')}</ToggleButton>
					<ToggleButton value={AreaUnit.Hectare}>{t('unitHectare')}</ToggleButton>
				</ToggleButtonGroup>
				<Typography className='text-sm'>{t('languages')}</Typography>
				<ToggleButtonGroup value={i18n.language} exclusive onChange={handleLangChange}>
					<ToggleButton value={Languages.TH}>{t('languagesTh')}</ToggleButton>
					<ToggleButton value={Languages.EN}>{t('languagesEn')}</ToggleButton>
				</ToggleButtonGroup>
			</DialogContent>
		</Dialog>
	)
}

export default SettingDialog
