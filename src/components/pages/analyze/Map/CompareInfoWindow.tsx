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
import { registerPinLayerId } from '../Detail/MapDetail'
import { GetAgeclassLocationDtoOut, GetCompareLocationDtoOut } from '@/api/analyze/dto.out.dto'
import { DurianChangeAreaColor } from '@/config/color'
import classNames from 'classnames'
import useAreaUnit from '@/store/area-unit'

const CompareInfoWindow: React.FC<{ data: GetCompareLocationDtoOut; color: string }> = ({ data, color }) => {
	const { areaUnit } = useAreaUnit()
	const { t, i18n } = useTranslation()
	const language = i18n.language as keyof ResponseLanguage

	const { removeLayer, setInfoWindow } = useMapStore()

	return (
		<div className='relative flex w-[315px] flex-col rounded-lg border-2 border-solid border-[#E9ECEE] bg-[#2F7A59] p-5 md:w-[350px] md:p-6'>
			<IconButton
				onClick={() => {
					setInfoWindow(null)
					removeLayer(registerPinLayerId)
				}}
				className='!absolute right-2 top-2 h-6 w-6'
			>
				<CloseIcon fontSize='small' className='text-white' />
			</IconButton>
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
								style={{ backgroundColor: color }}
								className='relative flex h-[20px] w-[20px] items-center justify-center rounded-full'
							>
								{color === DurianChangeAreaColor.increased ? (
									<div className='absolute top-[6px] h-0 w-0 border-[6px] border-t-0 border-solid border-transparent border-b-white'></div>
								) : color === DurianChangeAreaColor.decreased ? (
									<div className='absolute top-[7px] h-0 w-0 border-[6px] border-b-0 border-solid border-transparent border-t-white'></div>
								) : (
									<div className='h-0 w-[10px] border-0 border-b-[3px] border-solid border-white'></div>
								)}
							</div>
							<span style={{ color }} className='text-[18px] font-medium leading-[24px]'>
								{color === DurianChangeAreaColor.increased
									? t('analyze:increasedArea')
									: color === DurianChangeAreaColor.decreased
										? t('analyze:decreasedArea')
										: t('analyze:noChangedArea')}
							</span>
						</div>
						{color !== DurianChangeAreaColor.noChanged && (
							<div className='flex flex-wrap items-center justify-end gap-2'>
								<div className='flex items-center gap-1'>
									<div className='flex flex-col items-center gap-0.5'>
										<div
											style={
												color === DurianChangeAreaColor.increased
													? { borderBottomColor: color }
													: {}
											}
											className='h-0 w-0 border-4 border-t-0 border-solid border-transparent border-b-white'
										></div>
										<div
											style={
												color === DurianChangeAreaColor.decreased
													? { borderTopColor: color }
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
