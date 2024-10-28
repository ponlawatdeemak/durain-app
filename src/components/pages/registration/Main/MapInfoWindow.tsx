import { ResponseLanguage } from '@/api/interface'
import {
	PopupReistrationLogo,
	PopupRegistrationPin,
	PopupRegistrationChecked,
	PopupRegistrationCross,
} from '@/components/svg/MenuIcon'
import { RegisterType } from '@/enum'
import { useTranslation } from 'react-i18next'
import { GetRegisteredLocationDtoOut } from '@/api/registration/dto-out.dto'

const MapInfoWindowContent: React.FC<{ data: GetRegisteredLocationDtoOut | null }> = ({ data }) => {
	const { t, i18n } = useTranslation()
	const language = i18n.language as keyof ResponseLanguage

	if (!data) {
		return null
	}

	return (
		<div className='flex h-[145px] w-[315px] flex-col items-end bg-green-light p-6'>
			<div className={`flex h-full w-full gap-2 text-[14px] font-medium`}>
				<div className='flex h-full items-center'>
					<PopupReistrationLogo />
				</div>
				<div className='flex flex-col gap-2'>
					<div className='flex gap-2'>
						<div className='pt-[1px]'>
							<PopupRegistrationPin />
						</div>
						<p className='flex text-white'>{data?.admNameFull?.[language]}</p>
					</div>
					<div className='flex w-full items-center gap-2 rounded-[4px] bg-white px-2 py-1'>
						{data?.status === RegisterType.Registered ? (
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
