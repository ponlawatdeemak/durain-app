import React from 'react'
import AutocompleteInput from '@/components/common/input/AutocompleteInput'
import FormInput from '@/components/common/input/FormInput'
import UploadImage from '@/components/common/upload/UploadImage'
import { Box, Button, Divider, Typography } from '@mui/material'
import { FormikProps } from 'formik'
import { useEffect } from 'react'
import service from '@/api'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'next-i18next'
// import { useSwitchLanguage } from '@/i18n/client'

import classNames from 'classnames'
import { UserDialogMode } from '../UserDialog'
import useResponsive from '@/hook/responsive'
import { ContactIcon, EmailIcon, LockIcon } from '@/components/svg/MenuIcon'
import { GetProfileDtoOut, GetUmDtoOut } from '@/api/um/dto-out.dto'
import { Language } from '@mui/icons-material'
import { ResponseLanguage } from '@/api/interface'
// import { Languages } from '@/config/app.config'
import clsx from 'clsx'

export interface ProfileFormProps {
	formik: FormikProps<any>
	loading?: boolean
	isDisabledProfile?: boolean
	isHiddenProfile?: boolean
	isFormUM?: boolean
	isEditFormUM?: boolean
	userDialogmode?: UserDialogMode
	userData?: GetProfileDtoOut | GetUmDtoOut
	isResetPasswordOpen?: boolean
	setIsResetPasswordOpen?: React.Dispatch<React.SetStateAction<boolean>>
}

const ProfileForm: React.FC<ProfileFormProps> = ({
	formik,
	loading = false,
	isDisabledProfile = false,
	isHiddenProfile = false,
	isFormUM = false,
	isEditFormUM = false,
	userDialogmode,
	userData,
	isResetPasswordOpen,
	setIsResetPasswordOpen = () => {},
}) => {
	const { t, i18n } = useTranslation(['common', 'um'])
	// const { i18n: i18nWithCookie } = useSwitchLanguage(i18n.language as Languages, 'appbar')
	const isDesktop = useResponsive()

	const { data: provinceLookupData, isLoading: isProvinceDataLoading } = useQuery({
		queryKey: ['getProvince'],
		queryFn: () => service.lookup.get('provinces'),
	})

	const {
		data: districtLookupData,
		isLoading: isDistricDataLoading,
		refetch: refetchDistricts,
	} = useQuery({
		queryKey: ['getDistrict'],
		queryFn: () => service.lookup.get(`districts/${formik.values.responsibleProvinceCode}`),
		enabled: !!formik.values.responsibleProvinceCode,
	})

	useEffect(() => {
		if (formik.values.responsibleProvinceCode) {
			refetchDistricts()
		} else {
			formik.setFieldValue('responsibleDistrictCode', null)
		}
	}, [formik.values.responsibleProvinceCode, refetchDistricts])

	const { data: organizationLookupData, isLoading: isOrganizationDataLoading } = useQuery({
		queryKey: ['getOrganization'],
		queryFn: () => service.lookup.get('organizations'),
	})

	const { data: roleLookupData, isLoading: isRoleDataLoading } = useQuery({
		queryKey: ['getRole'],
		queryFn: () => service.lookup.get('roles'),
	})

	const handleClickResetPassword = () => {
		setIsResetPasswordOpen((prev) => !prev)
	}

	return (
		<>
			<div className='w-full self-start'>
				<UploadImage
					name='image'
					formik={formik}
					className='flex flex-col items-center gap-[12px] py-[16px] [&_.MuiAvatar-root]:h-[168px] [&_.MuiAvatar-root]:w-[168px]'
					disabled={loading}
				/>
				{userDialogmode === UserDialogMode.UserProfile && (
					<Box className='mb-[16px] flex flex-col items-center gap-[16px]'>
						<Typography className='max-w-full !overflow-hidden !text-ellipsis !whitespace-nowrap !text-lg !font-medium'>
							{userData?.firstName}
							&nbsp;
							{userData?.lastName}
						</Typography>
						<Box className='max-w-full'>
							<Typography className='max-w-full !overflow-hidden !text-ellipsis !whitespace-nowrap'>
								<span className='inline-flex items-center'>
									<div className='[&>svg]:fill-dark1'>
										<EmailIcon width={26} height={24} />
									</div>
								</span>
								&nbsp;&nbsp;&nbsp;
								<span>{userData?.email}</span>
							</Typography>
							<Typography className='max-w-full !overflow-hidden !text-ellipsis !whitespace-nowrap'>
								<Box className='inline-flex items-center'>
									<div className='[&>svg]:fill-dark1'>
										<ContactIcon width={26} height={24} />
									</div>
									&nbsp;&nbsp;&nbsp;
									<span className='inline-flex'>
										{userData?.orgCode.toLocaleUpperCase()},&nbsp;
										{
											provinceLookupData?.data?.find(
												(item) => item.code === parseInt(userData?.responsibleProvinceCode),
											)?.name[i18n.language as keyof ResponseLanguage]
										}
										,&nbsp;
										{
											districtLookupData?.data?.find(
												(item) => item.code === parseInt(userData?.responsibleDistrictCode),
											)?.name[i18n.language as keyof ResponseLanguage]
										}
									</span>
								</Box>
							</Typography>
						</Box>
					</Box>
				)}
			</div>
			{isDesktop && <Divider orientation='vertical' flexItem />}
			<div className='flex flex-col gap-[16px] self-start'>
				<Box className='flex flex-col gap-[12px]'>
					<div className='flex gap-[12px] max-lg:flex-col'>
						<FormInput
							className='!lg:w-[50%] w-full text-sm font-medium'
							name='username'
							label={t('username')}
							formik={formik}
							required
							disabled={
								loading ||
								isEditFormUM ||
								userDialogmode === UserDialogMode.UserEdit ||
								userDialogmode === UserDialogMode.UserProfile
							}
							placeholder={t('pleaseEnter')}
						/>
						<FormInput
							className='w-full text-sm font-medium lg:w-[240px]'
							name='email'
							label={t('email')}
							formik={formik}
							required
							disabled={
								isDisabledProfile ||
								loading ||
								isEditFormUM ||
								userDialogmode === UserDialogMode.UserEdit ||
								userDialogmode === UserDialogMode.UserProfile
							}
							placeholder={t('pleaseEnter')}
						/>
					</div>
					<div className='flex gap-[12px] max-lg:flex-col'>
						<FormInput
							className='w-full text-sm font-medium lg:w-[240px]'
							name='firstName'
							label={t('firstName')}
							formik={formik}
							required
							disabled={loading}
							placeholder={t('pleaseEnter')}
						/>
						<FormInput
							className='w-full text-sm font-medium lg:w-[240px]'
							name='lastName'
							label={t('lastName')}
							formik={formik}
							required
							disabled={loading}
							placeholder={t('pleaseEnter')}
						/>
					</div>
				</Box>
				<Box className='flex flex-col gap-[16px] lg:gap-[12px]'>
					<div className='flex gap-[16px] max-lg:flex-col lg:gap-[12px]'>
						<AutocompleteInput
							className='w-full text-sm font-medium lg:w-[240px]'
							options={
								provinceLookupData?.data?.map((item) => ({
									...item,
									value: String(item.code),
								})) || []
							}
							getOptionLabel={(option) => option.name[i18n.language]}
							name='responsibleProvinceCode'
							label={t('belongProvince', { ns: 'um' })}
							formik={formik}
							disabled={isProvinceDataLoading || loading}
							required
							placeholder={t('pleaseEnter')}
						/>
						<AutocompleteInput
							className='w-full text-sm font-medium lg:w-[240px]'
							options={
								districtLookupData?.data?.map((item) => ({
									...item,
									value: String(item.code),
								})) || []
							}
							getOptionLabel={(option) => option.name?.[i18n.language]}
							name='responsibleDistrictCode'
							label={t('belongDistrict', { ns: 'um' })}
							formik={formik}
							disabled={isDistricDataLoading || loading || !formik.values.responsibleProvinceCode}
							required={false}
							placeholder={t('notEnter')}
						/>
					</div>
					<div
						className={classNames('flex gap-[16px] max-lg:flex-col lg:gap-[12px]', {
							'max-lg:hidden': isHiddenProfile,
						})}
					>
						<AutocompleteInput
							className='w-full text-sm font-medium lg:w-[240px]'
							options={
								organizationLookupData?.data?.map((item) => ({
									...item,
									value: item.code,
								})) || []
							}
							getOptionLabel={(option) => option.name[i18n.language]}
							name='orgCode'
							label={t('org')}
							formik={formik}
							disabled={
								isDisabledProfile ||
								loading ||
								userDialogmode === UserDialogMode.UserProfile ||
								userDialogmode === UserDialogMode.UserEdit
							}
							required={userDialogmode === UserDialogMode.UserAdd ? true : false}
							placeholder={userDialogmode === UserDialogMode.UserAdd ? t('pleaseEnter') : t('notEnter')}
						/>
						<AutocompleteInput
							className='w-full text-sm font-medium lg:w-[240px]'
							options={
								roleLookupData?.data?.map((item) => ({
									...item,
									value: item.code,
								})) || []
							}
							getOptionLabel={(option) => option.name[i18n.language]}
							name='role'
							label={t('role')}
							formik={formik}
							disabled={
								isDisabledProfile ||
								loading ||
								userDialogmode === UserDialogMode.UserProfile ||
								userDialogmode === UserDialogMode.UserEdit
							}
							required={userDialogmode === UserDialogMode.UserAdd ? true : false}
							placeholder={userDialogmode === UserDialogMode.UserAdd ? t('pleaseEnter') : t('notEnter')}
						/>
					</div>
					{userDialogmode === UserDialogMode.UserProfile && (
						<div
							className={classNames('flex gap-[16px] max-lg:flex-col lg:mt-[24px] lg:gap-[12px]', {
								'max-lg:hidden': isHiddenProfile,
							})}
						>
							<Button
								className={clsx(
									'!border-green-light !text-green-light h-[40px] w-[150px] bg-white text-sm',
									{
										'w-[178px]': isDesktop,
									},
								)}
								variant='outlined'
								onClick={handleClickResetPassword}
								startIcon={
									<div className='[&>svg]:fill-green-dark1'>
										<LockIcon width={24} height={24} />
									</div>
								}
								// disabled={isPostProfileUMPending || isPutProfileUMPending || isUserDataLoading}
							>
								{t('resetPassword')}
							</Button>
						</div>
					)}
				</Box>
			</div>
		</>
	)

	// return <></>
}

export default ProfileForm
