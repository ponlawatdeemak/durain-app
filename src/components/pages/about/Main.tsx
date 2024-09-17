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
				isDesktop ? 'h-full max-h-[calc(100vh-144px)] py-[24px] pl-[40px] pr-[21px]' : 'box-border p-4',
			)}
		>
			<div
				className={classNames(
					'flex max-h-full w-full flex-row items-center gap-3',
					isDesktop ? 'mb-[24px]' : 'mb-4 justify-center',
				)}
			>
				<div className={classNames('[&>svg]:fill-[#0C5D52]', isDesktop ? '' : '')}>
					<AbountIcon />
				</div>
				<p className='text-2xl font-light text-[#0C5D52]'>{t('menuAbout')}</p>
			</div>
			<div
				className={classNames(
					'flex h-full max-h-full w-full gap-[24px]',
					isDesktop ? 'flex-row' : 'flex-col-reverse',
				)}
			>
				<div
					className={classNames(
						'flex flex-col rounded-lg bg-[#BFD6CC] p-[48px]',
						isDesktop ? 'h-full flex-grow' : '',
					)}
				>
					<iframe
						className='aspect-video h-[421px] w-full'
						src='https://www.youtube.com/embed/hObI730a-0A?si=2a6GpQzkjOQc7xy5'
						title='YouTube video player'
						allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
						referrerPolicy='strict-origin-when-cross-origin'
						allowFullScreen
					></iframe>
					<div className='pb-[24px] pt-[32px] text-left text-lg font-light text-[#21573F]'>
						{language === Languages.EN
							? 'Durian Crop Area Analysis System Using Satellite Technology and Artificial Intelligence'
							: 'ระบบวิเคราะห์พื้นที่ปลูกทุเรียนด้วยเทคโนโลยีดาวเทียมและปัญญาประดิษฐ์'}
					</div>
					<div
						className={classNames(
							'flex w-full flex-grow whitespace-pre-wrap pr-0 text-sm font-light [&&::-webkit-scrollbar-thumb]:rounded [&&::-webkit-scrollbar-thumb]:bg-[#307A59] [&::-webkit-scrollbar-track]:rounded [&::-webkit-scrollbar-track]:bg-[#FFFFFF] [&::-webkit-scrollbar]:w-[5px]',
							isDesktop ? 'overflow-y-auto' : '',
						)}
					>
						{language === Languages.EN
							? `Durian is the most economically valuable export fruit in Thailand. According to an assessment by Krungthai COMPASS, the Thai durian export market to China is expected to continue expanding, with a compound annual growth rate (CAGR) of 19.3% during the period from 2022 to 2030. The export value is projected to increase to 22.162 billion USD, or approximately 700 billion THB, in 2030, up from the current level of around 120 billion THB.

However, Thailand\'s market share of durian in China is expected to decline, from 95.9% in 2021 to 90.4% in 2025 and 88.1% in 2030. The main reasons for this are that China can now grow its own durians and the increased competition from other countries, such as Malaysia and Vietnam. This competition is anticipated to cause Thailand to lose approximately 17 to 57 billion THB in revenue per year between 2025 and 2030.

In 2021, the export value of Thai durian reached a record high of 119 billion THB, expanding by 64.5% compared to the previous year. Over the past decade, the export value of Thai durian has increased 17.1 times, or an average growth of 37% per year (CAGR from 2012-2021). This growth has been driven by the continuously rising demand for durian in key markets such as China, as well as the Free Trade Agreement (FTA) that exempts Thai fresh fruit from import duties in China.

During the same period, global durian production increased by an average of 130,000 tons per year, driven by the rising demand, especially in the Chinese market. Countries such as Thailand, Indonesia, Malaysia, and Vietnam have therefore accelerated the expansion of their durian cultivation areas to boost production. In Thailand, the durian cultivation area in 2021 was 852,000 rai, an increase of 41% compared to 2011, as many farmers have shifted to durian cultivation from other crops, such as rubber and cassava. Meanwhile, the Malaysian government has been supporting durian cultivation for export with investments in funding, technology, and transportation.

Krungthai COMPASS estimates that by 2025, Thailand\'s durian production will surpass Indonesia\'s, and by 2030, Thailand\'s production could increase 4.2 times to 5.05 million tons. In contrast, Indonesia\'s, Malaysia\'s, and Vietnam\'s durian production is projected to be around 4.05 million tons, 0.72 million tons, and 3.44 million tons, respectively. This is expected to intensify competition in the export market.

However, the current data on durian cultivation areas may not be up to date and lacks spatial accuracy. Therefore, it is difficult to accurately forecast production on a spatial level. Accurate data on durian cultivation areas would be highly beneficial for effective policy planning, such as price planning, export strategies, and logistics systems.
In the present day, the application of remote sensing technology in classifying durian cultivation areas has great potential to increase the accuracy and efficiency of agricultural strategic planning. This technology can be used to analyze and precisely classify durian cultivation areas, which helps in forecasting production in advance, as well as continuously monitoring the condition of cultivation areas.

Using satellite imagery combined with data processing technologies, such as the application of artificial intelligence (AI) and deep learning models for durian classification, can help accurately distinguish durian cultivation areas from other crops. Additionally, it can assess the health of the plants and the environmental conditions of the cultivation areas, which are crucial data for planning management and increasing production.

This technology also enables long-term monitoring of changes in cultivation areas, such as the expansion of durian cultivation areas or changes in the types of crops grown. Detailed spatial data analysis can support policy decisions, such as determining strategies for promoting cultivation in potential areas, developing infrastructure for logistics to support the expansion of exports, and managing appropriate pricing strategies.

In Thailand, applying remote sensing technology to classify durian cultivation areas would strengthen the export market, especially when facing competition from neighboring countries rapidly expanding their durian cultivation areas, such as Malaysia and Vietnam. Having accurate and detailed data would help Thailand adjust its marketing strategies and production management more effectively. Additionally, this data can be used to compare durian cultivation areas with those of competing countries, aiding in the development of strategies for penetrating international markets and maintaining leadership in the global market.`
							: `         ทุเรียนเป็นผลไม้ส่งออกที่มีมูลค่าทางเศรษฐกิจสูงที่สุดในประเทศไทย จากการประเมินของ Krungthai COMPASS คาดว่าตลาดส่งออกทุเรียนไทยไปจีนจะขยายตัวอย่างต่อเนื่อง โดยมีอัตราการเติบโตเฉลี่ยต่อปี (CAGR) อยู่ที่ 19.3% ในช่วงปี 2565-2573 มูลค่าการส่งออกอาจเพิ่มขึ้นเป็น 22,162 ล้านเหรียญสหรัฐฯ หรือประมาณ 700,000 ล้านบาท ในปี 2573 จากปัจจุบันที่ราว 120,000 ล้านบาท

        อย่างไรก็ตาม ส่วนแบ่งตลาดทุเรียนของไทยในจีนมีแนวโน้มลดลง จาก 95.9% ในปี 2564 เหลือ 90.4% ในปี 2568 และ 88.1% ในปี 2573 สาเหตุหลักมาจากการที่จีนสามารถปลูกทุเรียนได้เองและการแข่งขันจากประเทศอื่นๆ เช่น มาเลเซีย และเวียดนาม คาดว่าผลกระทบจากการแข่งขันนี้อาจทําให้ไทยสูญเสียรายได้ประมาณ 17,000-57,000 ล้านบาทต่อปี ในช่วงปี 2568-2573 ในปี 2564 มูลค่าการส่งออกทุเรียนของไทยทําสถิติสูงสุดที่ 119,000 ล้านบาท ขยายตัวถึง 64.5% เมื่อเทียบกับปีที่ผ่านมา และในช่วง 10 ปีที่ผ่านมา มูลค่าการส่งออกทุเรียนของไทยเพิ่มขึ้นถึง 17.1 เท่า หรือเติบโตเฉลี่ยปีละ 37% (CAGR ปี 2555-2564) ซึ่งได้รับแรงหนุนจากความต้องการบริโภคทุเรียนในตลาดหลักอย่างจีน รวมถึงข้อตกลงการค้าเสรี (FTA) ที่ทําให้ไทยได้รับการยกเว้นภาษีนําเข้าผลไม้สดจากจีน

        ในช่วงเวลาเดียวกัน ผลผลิตทุเรียนทั่วโลกเพิ่มขึ้นเฉลี่ยปีละ 130,000 ตัน เนื่องจากความต้องการบริโภคที่เพิ่มขึ้น โดยเฉพาะในตลาดจีน ประเทศต่างๆ เช่น ไทย อินโดนีเซีย มาเลเซีย และเวียดนาม จึงเร่งขยายพื้นที่เพาะปลูกเพื่อเพิ่มผลผลิต สําหรับประเทศไทย ในปี 2564 มีพื้นที่เพาะปลูกทุเรียนอยู่ที่ 852,000 ไร่ เพิ่มขึ้น 41% เมื่อเทียบกับปี 2554 โดยเกษตรกรหันมาปลูกทุเรียนแทนพืชอื่น เช่น ยางพาราและมันสําปะหลัง ขณะที่รัฐบาลมาเลเซียสนับสนุนการปลูกทุเรียนเพื่อการส่งออกทั้งในด้านเงินทุน เทคโนโลยี และการขนส่ง

        Krungthai COMPASS ประเมินว่าภายในปี 2568 ผลผลิตทุเรียนของไทยจะสูงกว่าอินโดนีเซีย และภายในปี 2573 ผลผลิตของไทยอาจเพิ่มขึ้นถึง 4.2 เท่า สู่ระดับ 5.05 ล้านตัน ขณะที่ผลผลิตของอินโดนีเซีย มาเลเซีย และเวียดนามมีแนวโน้มอยู่ที่ 4.05 ล้านตัน 0.72 ล้านตัน และ 3.44 ล้านตันตามลําดับ ซึ่งจะทําให้การแข่งขันในตลาดส่งออกรุนแรงมากขึ้น

        ทั้งนี้ ข้อมูลเกี่ยวกับพื้นที่ปลูกทุเรียนที่มีอยู่ในปัจจุบันอาจไม่เป็นข้อมูลที่อัปเดต และมีความละเอียดเชิงพื้นที่ไม่สูงมาก จึงยังไม่สามารถคาดการณ์ผลผลิตในเชิงพื้นที่ได้อย่างแม่นยํา ข้อมูลพื้นที่เพาะปลูกที่แม่นยําจะมีประโยชน์ในการวางแผนบริหารจัดการในเชิงนโยบายได้อย่างมีประสิทธิภาพ เช่น การวางแผนด้านราคา การส่งออก และระบบโลจิสติกส์

        ในปัจจุบัน การใช้เทคโนโลยีการสํารวจระยะไกล (Remote Sensing) ในการจําแนกพื้นที่เพาะปลูกทุเรียนมีศักยภาพอย่างมากในการเพิ่มความแม่นยําและประสิทธิภาพในการวางแผนเชิงกลยุทธ์สําหรับการเกษตร โดยเทคโนโลยีนี้สามารถนํามาใช้ในการวิเคราะห์และจําแนกพื้นที่เพาะปลูกทุเรียนได้อย่างละเอียด ซึ่งช่วยให้สามารถคาดการณ์ผลผลิตได้ล่วงหน้า รวมถึงการตรวจสอบสภาพพื้นที่เพาะปลูกได้อย่างต่อเนื่อง

        การใช้ภาพถ่ายจากดาวเทียมร่วมกับเทคโนโลยีการประมวลผลข้อมูล เช่น การประยุกต์ใช้ปัญญาประดิษฐ์ (AI) และการเรียนรู้เชิงลึก (Deep Learning) ในการจําแนกพืชทุเรียน จะช่วยให้สามารถแยกแยะพื้นที่ปลูกทุเรียนจากพืชชนิดอื่นได้อย่างแม่นยํา นอกจากนี้ยังสามารถประเมินสุขภาพของพืชและสภาพแวดล้อมการเพาะปลูกได้ ซึ่งเป็นข้อมูลสําคัญที่ใช้ในการวางแผนการจัดการและเพิ่มผลผลิต

        เทคโนโลยีนี้ยังช่วยให้สามารถติดตามการเปลี่ยนแปลงของพื้นที่เพาะปลูกในระยะยาวได้ เช่น การขยายพื้นที่เพาะปลูกหรือการเปลี่ยนแปลงชนิดของพืชที่ปลูกในพื้นที่ การวิเคราะห์ข้อมูลเชิงพื้นที่อย่างละเอียดจะช่วยสนับสนุนการตัดสินใจในเชิงนโยบาย เช่น การกําหนดแนวทางการส่งเสริมการเพาะปลูกในพื้นที่ที่มีศักยภาพ การพัฒนาโครงสร้างพื้นฐานด้านโลจิสติกส์เพื่อรองรับการขยายตัวของการส่งออก และการบริหารจัดการด้านราคาที่เหมาะสม

        สําหรับประเทศไทย การนําเทคโนโลยีการสํารวจระยะไกลมาใช้ในการจําแนกพื้นที่เพาะปลูกทุเรียนจะช่วยเสริมความแข็งแกร่งในตลาดการส่งออก โดยเฉพาะเมื่อเผชิญกับการแข่งขันจากประเทศเพื่อนบ้านที่มีการขยายพื้นที่เพาะปลูกทุเรียนอย่างรวดเร็ว เช่น มาเลเซียและเวียดนาม การมีข้อมูลเชิงลึกที่แม่นยําจะช่วยให้ไทยสามารถปรับกลยุทธ์ทางการตลาดและการจัดการการผลิตได้อย่างมีประสิทธิภาพ นอกจากนี้ยังสามารถใช้ข้อมูลนี้ในการเปรียบเทียบกับพื้นที่เพาะปลูกทุเรียนในประเทศคู่แข่ง เพื่อพัฒนากลยุทธ์การเจาะตลาดต่างประเทศและรักษาความเป็นผู้นําในตลาดโลกได้ต่อไป`}
					</div>
				</div>
				<div
					className={classNames(
						'flex shrink-0 flex-col gap-[48px] rounded-lg bg-white',
						isDesktop ? 'h-full w-[420px]' : 'w-full',
					)}
				>
					<div className='flex justify-center rounded-t-lg bg-[#21573F] p-[56px]'>
						<AboutCompanyLogo />
					</div>
					<div className='flex flex-col gap-6 px-[24px] pb-[32px] font-light'>
						<p className='text-2xl text-[#21573F]'>
							{language === Languages.EN
								? 'Thai Advance Innovation Company Limited'
								: 'บริษัท ไทย แอดวานซ์ อินโนเวชั่น จำกัด'}
						</p>

						<div className='flex flex-col gap-[16px]'>
							<div className='flex flex-row gap-2'>
								<div className='w-45 flex items-start justify-start'>
									<GpsIcon />
								</div>
								<p className='text-sm'>
									{language === Languages.EN
										? '349 SJ Infinite 1 Business Complex, 28th Floor, Vibhavadi Rangsit Rd, Chompol, Chatuchak, Bangkok 10900'
										: `349 อาคารเอสเจ อินฟินิท วัน บิสซิเนส คอมเพล็กซ์ ชั้น 28 ถนนวิภาวดีรังสิต แขวงจอมพล
									เขตจตุจักร กรุงเทพฯ 10900`}
								</p>
							</div>
							<div className='flex flex-row items-center gap-2'>
								<div className='w-45 flex items-start justify-start'>
									<TelephoneIcon />
								</div>
								<p className='text-sm'>
									{language === Languages.EN ? 'Tel. : 02-5965060' : 'โทร : 02-596-5060'}
								</p>
							</div>
							<div className='flex flex-row items-center gap-2'>
								<div className='w-45 flex items-start justify-start'>
									<CallcenterIcon />
								</div>
								<p className='text-sm'>
									{language === Languages.EN
										? 'Call center : 02-950-5005'
										: 'Call center : 02-950-5005'}
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
