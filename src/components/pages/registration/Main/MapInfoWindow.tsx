import { ResponseLanguage } from '@/api/interface'
import useMapStore from '@/components/common/map/store/map'
import {
	PopupReistrationLogo,
	PopupRegistrationPin,
	PopupRegistrationChecked,
	PopupRegistrationCross,
} from '@/components/svg/MenuIcon'
import { Languages, RegisterType } from '@/enum'
import { IconButton } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { useTranslation } from 'react-i18next'
import { registerPinLayerId } from '.'

interface MapInfoWindowContentProp {
	provinceTH: string
	districtTH: string
	subDistrictTH: string
	provinceEN: string
	districtEN: string
	subDistrictEN: string
	status: string
}

const MapInfoWindowContent: React.FC<{ data: MapInfoWindowContentProp }> = ({ data }) => {
	const { t, i18n } = useTranslation()
	const language = i18n.language as keyof ResponseLanguage

	const { removeLayer, setInfoWindow } = useMapStore()

	return (
		<div className='flex h-[145px] w-[315px] flex-col items-end rounded-[8px] bg-green-light p-1'>
			<IconButton
				onClick={() => {
					setInfoWindow(null)
					removeLayer(registerPinLayerId)
				}}
				className='self-right flex h-[25px] w-[25px]'
			>
				<CloseIcon fontSize='small' className='text-white' />
			</IconButton>
			<div className={`flex h-full w-full gap-2 px-4 py-1 text-[14px] font-medium`}>
				<div className='flex h-full'>
					<PopupReistrationLogo />
				</div>
				<div className='flex flex-col gap-2'>
					<div className='flex gap-2'>
						<div className='pt-[1px]'>
							<PopupRegistrationPin />
						</div>
						<p className='flex text-white'>
							{language === Languages.TH
								? `ตำบล${data.subDistrictTH} อำเภอ${data.districtTH} จังหวัด${data.provinceTH}`
								: `${data.subDistrictEN}, ${data.districtEN}, ${data.provinceEN}`}
						</p>
					</div>
					<div className='flex w-max gap-2 rounded-[4px] bg-white px-2 py-1'>
						{data.status === RegisterType.Registered ? (
							<>
								<PopupRegistrationChecked />
								<p className='text-[16px] font-medium text-primary'>
									{t('registration:registeredArea')}
								</p>
							</>
						) : (
							<>
								<PopupRegistrationCross />
								<p className='text-[16px] font-medium text-registerType-nonRegistered'>
									{t('registration:unregisteredArea')}
								</p>
							</>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}

export default MapInfoWindowContent
