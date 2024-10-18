import { ResponseLanguage } from '@/api/interface'
import { PopupReistrationLogo, PopupRegistrationPin } from '@/components/svg/MenuIcon'
import { useTranslation } from 'react-i18next'
import { GetAgeclassLocationDtoOut } from '@/api/analyze/dto.out.dto'

const SummaryInfoWindow: React.FC<{ data: GetAgeclassLocationDtoOut | null }> = ({ data }) => {
	const { t, i18n } = useTranslation()
	const language = i18n.language as keyof ResponseLanguage

	if (!data) {
		return null
	}

	return (
		<div className='relative flex w-[315px] flex-col rounded-lg bg-white p-5 md:w-[350px] md:p-6'>
			<div className={`flex h-full w-full flex-col gap-2`}>
				<div className='flex items-center justify-between'>
					<span className='text-[18px] font-medium leading-[24px] text-[#333333]'>
						{data?.ageClass?.name?.[language] || '-'}
					</span>
					<div className='flex items-center gap-4'>
						<span style={{ color: data?.ageClass?.color }} className='text-[36px] font-bold leading-[40px]'>
							{data?.ageClass?.age?.[language] || '-'}
						</span>
						<span className='text-[18px] font-medium leading-[24px] text-[#333333]'>
							{data?.ageClass?.unit?.[language] || '-'}
						</span>
					</div>
				</div>
				<div className='flex items-center gap-2'>
					<div className='flex h-full'>
						<PopupReistrationLogo />
					</div>
					<div className='flex items-start gap-2'>
						<div className=''>
							<PopupRegistrationPin />
						</div>
						<p className='flex flex-wrap text-[14px] font-medium leading-[18px] text-[#333333]'>
							{data?.admNameFull?.[language] || '-'}
						</p>
					</div>
				</div>
			</div>
		</div>
	)
}

export default SummaryInfoWindow
