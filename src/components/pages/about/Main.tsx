import { AbountIcon, AboutCompanyLogo, CallcenterIcon, GpsIcon, TelephoneIcon } from '@/components/svg/MenuIcon'
import { Languages } from '@/enum'
import useResponsive from '@/hook/responsive'
import { Typography } from '@mui/material'
import classNames from 'classnames'
import { useTranslation } from 'next-i18next'

const AboutMain: React.FC = ({}) => {
	const { t, i18n } = useTranslation()
	const { isDesktop } = useResponsive()
	const language = i18n.language

	return (
		<div
			className={classNames(
				'flex w-full flex-1 flex-col',
				isDesktop ? 'h-full max-h-[calc(100vh-130px)] p-6' : 'box-border p-4',
			)}
		>
			<div
				className={classNames(
					'flex max-h-full w-full flex-row items-center gap-3',
					isDesktop ? 'mb-3' : 'mb-4 justify-center',
				)}
			>
				<div className={classNames('[&>svg]:fill-[#0C5D52]', isDesktop ? '' : '')}>
					<AbountIcon />
				</div>
				<p className='text-2xl font-light text-[#0C5D52]'>{t('menuAbout')}</p>
			</div>
			<div
				className={classNames(
					'flex h-full max-h-full w-full gap-4',
					isDesktop ? 'flex-row' : 'flex-col-reverse',
				)}
			>
				<div
					className={classNames(
						'flex flex-col gap-4 rounded-lg bg-[#BFD6CC] p-10',
						isDesktop ? 'h-full flex-grow' : 'h-[500px]',
					)}
				>
					<iframe
						className='aspect-video h-[55%] w-full'
						src='https://www.youtube.com/embed/qREKP9oijWI?si=2ZlpZOTgc5AyDgMq'
						title='YouTube video player'
						allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
						referrerPolicy='strict-origin-when-cross-origin'
						allowFullScreen
					></iframe>
					<div className='text-left text-lg font-light text-[#21573F]'>
						{language === Languages.EN
							? 'Durian Plantation Areas Analytics System using Satellite Data and Artificial Intelligence'
							: 'ภาษาไทย'}
					</div>
					<div className='flex w-full flex-grow overflow-y-auto pr-0 text-sm font-light [&&::-webkit-scrollbar-thumb]:rounded [&&::-webkit-scrollbar-thumb]:bg-[#307A59] [&::-webkit-scrollbar-track]:rounded [&::-webkit-scrollbar-track]:bg-[#FFFFFF] [&::-webkit-scrollbar]:w-[4px]'>
						{language === Languages.EN
							? `Lorem ipsum dolor sit amet consectetur. Sit vel malesuada sed dictum euismod nisi viverra nisi
						tincidunt. Viverra malesuada consectetur in ut. Cras diam consectetur enim mattis mattis eget
						aliquam viverra adipiscing. Eget dignissim bibendum elementum tortor nunc morbi vitae ac enim.
						Ultrices sed urna sem id enim facilisis egestas purus. Erat porttitor vitae et nulla turpis
						fermentum diam. Nisi pulvinar id diam aliquam. Adipiscing nullam sem tortor porttitor quis
						convallis quam. Viverra urna scelerisque aliquet nec nec donec. Id volutpat quis feugiat posuere
						orci. Massa sit commodo eget a sollicitudin nam. Ut nec eget consequat elit. Euismod nunc
						dictumst viverra pellentesque pulvinar. Nulla aliquet cursus nulla porttitor. Risus tincidunt
						eros elementum cras lectus id sem. Tincidunt nibh tincidunt at iaculis tellus sagittis. Nunc
						lobortis feugiat lacinia augue tristique in hendrerit aliquam. Imperdiet in magna nisi nunc et
						feugiat sit. Sed vel ultrices sed praesent rutrum lacus cursus. Laoreet elementum eget etiam sit
						pharetra magna vitae et. Amet quisque est a neque lorem ac mauris integer nullam. Dolor
						consequat donec eros et. Suspendisse faucibus vitae ultrices amet elit nulla sit urna. Curabitur
						sit non nibh sed eget dolor cursus. Leo pharetra donec in convallis dignissim elit id
						scelerisque accumsan. In faucibus diam a malesuada rhoncus vitae. Lorem ipsum dolor sit amet
						consectetur. Sit vel malesuada sed dictum euismod nisi viverra nisi tincidunt. Viverra malesuada
						consectetur in ut. Cras diam consectetur enim mattis mattis eget aliquam viverra adipiscing.
						Eget dignissim bibendum elementum tortor nunc morbi vitae ac enim. Ultrices sed urna sem id enim
						facilisis egestas purus. Erat porttitor vitae et nulla turpis fermentum diam. Nisi pulvinar id
						diam aliquam. Adipiscing nullam sem tortor porttitor quis convallis quam. Viverra urna
						scelerisque aliquet nec nec donec. Id volutpat quis feugiat posuere orci. Massa sit commodo eget
						a sollicitudin nam. Ut nec eget consequat elit. Euismod nunc dictumst viverra pellentesque
						pulvinar. Nulla aliquet cursus nulla porttitor. Risus tincidunt eros elementum cras lectus id
						sem. Tincidunt nibh tincidunt at iaculis tellus sagittis. Nunc lobortis feugiat lacinia augue
						tristique in hendrerit aliquam. Imperdiet in magna nisi nunc et feugiat sit. Sed vel ultrices
						sed praesent rutrum lacus cursus. Laoreet elementum eget etiam sit pharetra magna vitae et. Amet
						quisque est a neque lorem ac mauris integer nullam. Dolor consequat donec eros et. Suspendisse
						faucibus vitae ultrices amet elit nulla sit urna. Curabitur sit non nibh sed eget dolor cursus.
						Leo pharetra donec in convallis dignissim elit id scelerisque accumsan. In faucibus diam a
						malesuada rhoncus vitae.`
							: `ภาษาไทยภาษาไทยภาษาไทยภาษาไทยภาษาไทยภาษาไทยภาษาไทยภาษาไทยภาษาไทยภาษาไทยภาษาไทยภาษาไทยภาษาไทย
                            ภาษาไทยภาษาไทยภาษาไทยภาษาไทยภาษาไทยภาษาไทยภาษาไทยภาษาไทยภาษาไทยภาษาไทยภาษาไทยภาษาไทยภาษาไทยภาษา
                            ไทยภาษาไทยภาษาไทยภาษาไทยภาษาไทยภาษาไทยภาษาไทยภาษาไทยภาษาไทยภาษาไทยภาษาไทยภาษาไทยภาษาไทยภาษาไทย
                            ภาษาไทยภาษาไทยภาษาไทยภาษาไทยภาษาไทยภาษาไทยภาษาไทยภาษาไทยภาษาไทยภาษาไทยภาษาไทยภาษาไทยภาษาไทย
                            ภาษาไทยภาษาไทยภาษาไทยภาษาไทยภาษาไทยภาษาไทยภาษาไทยภาษาไทยภาษาไทยภาษาไทยภาษาไทยภาษาไทยภาษาไทยภาษาไทย
                            ษาไทยภาษาไทยภาษาไทยภาษาไทยภาษาไทยภาษาไทยภาษาไทยภาษาไทยภาษาไทยภาษาไทยภาษาไทยภาษาไทยภาษาไทย
                            ภาษาไทยภาษาไทยภาษาไทยภาษาไทยภาษาไทยภาษาไทยภาษาไทยภาษาไทยภาษาไทยภาษาไทยภาษาไทยภาษาไทยภาษาไทยภาษา
                            ไทยภาษาไทยภาษาไทยภาษาไทยภาษาไทยภาษาไทยภาษาไทยภาษาไทยภาษาไทยภาษาไทยภาษาไทยภาษาไทยภาษาไทยภาษาไทย
                            ภาษาไทยภาษาไทยภาษาไทยภาษาไทยยภาษาไทยภาษาไทยภาษาไทยภาษาไทยภาษาไทยภาษาไทยภาษาไทยภาษาไทย
                            ภาษาไทยภาษาไทยภาษาไทยภาษาไทยภาษาไทยภาษาไทยภาษาไทยภาษาไทยภาษาไทยภาษาไทยภาษาไทยภาษาไทยภาษาไทย
                            ภาษาไทยภาษาไทยภาษาไทยภาษาไทยภาษาไทยภาษาไทยภาษาไทยภาษาไทยภาษาไทยภาษาไทยภาษาไทยภาษาไทยภาษาไทยภาษาไทย
                            ษาไทยภาษาไทยภาษาไทยภาษาไทยภาษาไทยภาษาไทยภาษาไทยภาษาไทยภาษาไทยภาษาไทยภาษาไทยภาษาไทยภาษาไทย
                            ภาษาไทยภาษาไทยภาษาไทยภาษาไทยภาษาไทยภาษาไทยภาษายภาษาไทยภาษาไทยภาษาไทยภาษาไทยภาษาไทยภาษาไทยภาษาไทยภาษาไทย
                            ภาษาไทยภาษาไทยภาษาไทยภาษาไทยภาษาไทยภาษาไทยภาษาไทยภาษาไทยภาษาไทยภาษาไทยภาษาไทยภาษาไทยภาษาไทย
                            ภาษาไทยภาษาไทยภาษาไทยภาษาไทยภาษาไทยภาษาไทยภาษาไทยภาษาไทยภาษาไทยภาษาไทยภาษาไทยภาษาไทยภาษาไทยภาษาไทย
                            ษาไทยภาษาไทยภาษาไทยภาษาไทยภาษาไทยภาษาไทยภาษาไทยภาษาไทยภาษาไทยภาษาไทยภาษาไทยภาษาไทยภาษาไทย
                            ภาษาไทยภาษาไทยภาษาไทยภาษาไทยภาษาไทยภาษาไทยภาษา`}
					</div>
				</div>
				<div
					className={classNames(
						'flex shrink-0 flex-col gap-6 rounded-lg bg-white',
						isDesktop ? 'h-full w-[400px]' : 'w-full',
					)}
				>
					<div className='flex justify-center rounded-t-lg bg-[#21573F] py-12'>
						<AboutCompanyLogo />
					</div>
					<div className='flex flex-col gap-6 px-5 pb-5 font-light'>
						<p className='text-center text-2xl text-[#21573F]'>
							{language === Languages.EN ? 'English' : 'บริษัท ไทย แอดวานซ์ อินโนเวชั่น จำกัด'}
						</p>

						<div className='flex flex-col gap-4'>
							<div className='flex flex-row gap-2'>
								<div className='w-45 flex items-start justify-start'>
									<GpsIcon />
								</div>
								<p className='text-sm'>
									{language === Languages.EN
										? 'English'
										: `349 อาคารเอสเจ อินฟินิท วัน บิสซิเนส คอมเพล็กซ์ ชั้น 28 ถนนวิภาวดีรังสิต แขวงจอมพล
									เขตจตุจักร กรุงเทพฯ 10900`}
								</p>
							</div>
							<div className='flex flex-row items-center gap-2'>
								<div className='w-45 flex items-start justify-start'>
									<TelephoneIcon />
								</div>
								<p className='text-sm'>{language === Languages.EN ? 'English' : 'โทร : 02-596-5060'}</p>
							</div>
							<div className='flex flex-row items-center gap-2'>
								<div className='w-45 flex items-start justify-start'>
									<CallcenterIcon />
								</div>
								<p className='text-sm'>
									{language === Languages.EN ? 'English' : 'Call center : 02-950-5005'}
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default AboutMain
