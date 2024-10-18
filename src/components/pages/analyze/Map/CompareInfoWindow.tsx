import { ResponseLanguage } from '@/api/interface'
import { PopupReistrationLogo, PopupRegistrationPin } from '@/components/svg/MenuIcon'
import { useTranslation } from 'react-i18next'
import { GetCompareLocationDtoOut } from '@/api/analyze/dto.out.dto'
import { DurianChangeAreaColor } from '@/config/color'
import useAreaUnit from '@/store/area-unit'

const CompareInfoWindow: React.FC<{ data: GetCompareLocationDtoOut | null }> = ({ data }) => {
	const { areaUnit } = useAreaUnit()
	const { t, i18n } = useTranslation()
	const language = i18n.language as keyof ResponseLanguage

	if (!data) {
		return null
	}

	return (
		<div className='relative flex w-[315px] flex-col rounded-lg bg-green-light p-5 md:w-[350px] md:p-6'>
			<div className={`flex h-full w-full items-center gap-2`}>
				<div className='flex h-full'>
					<PopupReistrationLogo />
				</div>
				<div className='flex flex-col gap-2'>
					<div className='flex items-start gap-2'>
						<div className=''>
							<PopupRegistrationPin />
						</div>
						<p className='flex flex-wrap text-[14px] font-medium leading-[18px] text-white'>
							{data?.admNameFull?.[language] || '-'}
						</p>
					</div>
					<div className='flex flex-col gap-1'>
						<div className='flex items-center gap-2'>
							<div
								style={{
									backgroundColor:
										data?.change?.totalChange?.[areaUnit] === 0
											? DurianChangeAreaColor.noChanged
											: Math.sign(data?.change?.totalChange?.[areaUnit]) === 1
												? DurianChangeAreaColor.increased
												: DurianChangeAreaColor.decreased,
								}}
								className='relative flex h-[20px] w-[20px] items-center justify-center rounded-full'
							>
								{data?.change?.totalChange?.[areaUnit] === 0 ? (
									<div className='h-0 w-[10px] border-0 border-b-[3px] border-solid border-white'></div>
								) : Math.sign(data?.change?.totalChange?.[areaUnit]) === 1 ? (
									<div className='absolute top-[6px] h-0 w-0 border-[6px] border-t-0 border-solid border-transparent border-b-white'></div>
								) : (
									<div className='absolute top-[7px] h-0 w-0 border-[6px] border-b-0 border-solid border-transparent border-t-white'></div>
								)}
							</div>
							<span
								style={{
									color:
										data?.change?.totalChange?.[areaUnit] === 0
											? DurianChangeAreaColor.noChanged
											: Math.sign(data?.change?.totalChange?.[areaUnit]) === 1
												? DurianChangeAreaColor.increased
												: DurianChangeAreaColor.decreased,
								}}
								className='text-[18px] font-medium leading-[24px]'
							>
								{data?.change?.totalChange?.[areaUnit] === 0
									? t('analyze:noChangedArea')
									: Math.sign(data?.change?.totalChange?.[areaUnit]) === 1
										? t('analyze:increasedArea')
										: t('analyze:decreasedArea')}
							</span>
						</div>
						{data?.change?.totalChange?.[areaUnit] !== 0 && (
							<div className='flex flex-wrap items-center justify-end gap-2'>
								<div className='flex items-center gap-1'>
									<div className='flex flex-col items-center gap-0.5'>
										<div
											style={
												Math.sign(data?.change?.totalChange?.[areaUnit]) === 1
													? { borderBottomColor: DurianChangeAreaColor.increased }
													: {}
											}
											className='h-0 w-0 border-4 border-t-0 border-solid border-transparent border-b-white'
										></div>
										<div
											style={
												Math.sign(data?.change?.totalChange?.[areaUnit]) === -1
													? { borderTopColor: DurianChangeAreaColor.decreased }
													: {}
											}
											className='h-0 w-0 border-4 border-b-0 border-solid border-transparent border-t-white'
										></div>
									</div>
									<span className='text-sm font-medium text-white'>
										{Number(
											Math.abs(data?.change?.totalChange?.[areaUnit])?.toFixed(2) || 0,
										)?.toLocaleString()}
									</span>
								</div>
								<div className='flex items-center gap-1'>
									<span className='text-sm font-medium text-white'>{'('}</span>
									<div className='flex items-center gap-1'>
										<div className='flex flex-col items-center gap-0.5'>
											<div
												style={{ borderBottomColor: DurianChangeAreaColor.increased }}
												className='h-0 w-0 border-4 border-t-0 border-solid border-transparent border-b-white'
											></div>
											<div className='h-0 w-0 border-4 border-b-0 border-solid border-transparent border-t-white'></div>
										</div>
										<span className='text-sm font-medium text-white'>
											{Number(
												Math.abs(data?.change?.increase?.[areaUnit])?.toFixed(2) || 0,
											)?.toLocaleString()}
										</span>
									</div>
									<span className='text-sm font-medium text-white'>{'/'}</span>
									<div className='flex items-center gap-1'>
										<div className='flex flex-col items-center gap-0.5'>
											<div className='h-0 w-0 border-4 border-t-0 border-solid border-transparent border-b-white'></div>
											<div
												style={{ borderTopColor: DurianChangeAreaColor.decreased }}
												className='h-0 w-0 border-4 border-b-0 border-solid border-transparent border-t-white'
											></div>
										</div>
										<span className='text-sm font-medium text-white'>
											{Number(
												Math.abs(data?.change?.decrease?.[areaUnit])?.toFixed(2) || 0,
											)?.toLocaleString()}
										</span>
									</div>
									<span className='text-sm font-medium text-white'>{')'}</span>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}

export default CompareInfoWindow
