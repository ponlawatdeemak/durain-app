import React from 'react'

interface SVGProps {
	width?: number
	height?: number
}

export const OverviewIcon: React.FC<SVGProps> = ({ width = 25, height = 24 }) => {
	return (
		<svg width={width} height={height} viewBox='0 0 25 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
			<path d='M24.0283 7.0188V10.0511C24.0283 14.4056 20.7839 17.9352 16.7813 17.9352H13.994V23.9999H11.7642V15.5094L11.7853 14.2964C12.0696 10.2258 15.197 7.0188 19.0112 7.0188H24.0283Z' />
			<path d='M5.05264 3.24536C8.61562 3.24536 11.6393 5.51517 12.7075 8.66347C10.979 10.1069 9.83823 12.2046 9.68036 14.5661H8.50961C4.05473 14.5661 0.443359 11.0182 0.443359 6.64159V3.24536H5.05264Z' />
		</svg>
	)
}

export const AnalyzeIcon: React.FC<SVGProps> = ({ width = 25, height = 24 }) => {
	return (
		<svg width={width} height={height} viewBox='0 0 25 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
			<rect x='19.5' width='4' height='24' rx='1.25988' />
			<rect x='10.5' y='6' width='4' height='18' rx='1.25988' />
			<rect x='1.5' y='12' width='4' height='12' rx='1.25988' />
		</svg>
	)
}

export const RegistrationIcon: React.FC<SVGProps> = ({ width = 25, height = 24 }) => {
	return (
		<svg width={width} height={height} viewBox='0 0 25 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
			<path
				fillRule='evenodd'
				clipRule='evenodd'
				d='M12.5 1L23.9127 9.2918L19.5534 22.7082H5.44658L1.08732 9.2918L12.5 1Z'
			/>
			<path
				fillRule='evenodd'
				clipRule='evenodd'
				d='M12.4999 4.13049L20.9354 10.2592L17.7133 20.1757H7.28654L4.06448 10.2592L12.4999 4.13049Z'
				fill='white'
			/>
			<path
				fillRule='evenodd'
				clipRule='evenodd'
				d='M12.4999 7.26086L17.9581 11.2265L15.8732 17.643H9.1265L7.04164 11.2265L12.4999 7.26086Z'
			/>
		</svg>
	)
}

export const UserManagementIcon: React.FC<SVGProps> = ({ width = 25, height = 24 }) => {
	return (
		<svg width={width} height={height} viewBox='0 0 25 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
			<path d='M15.7338 17.1647L11.7013 14.1929C13.0455 13.1527 13.9416 11.6668 13.9416 9.88369V8.69495C13.9416 5.8717 11.8506 3.34563 9.01299 3.19704C6.02597 3.04844 3.48701 5.42592 3.48701 8.39776V9.88369C3.48701 11.6668 4.38312 13.1527 5.72727 14.1929L1.69481 17.3133C0.948052 17.9077 0.5 18.7992 0.5 19.6908V22.514C0.5 23.4056 1.0974 24 1.99351 24H15.4351C16.3312 24 16.9286 23.4056 16.9286 22.514V19.5422C16.9286 18.6506 16.4805 17.7591 15.7338 17.1647Z' />
			<path d='M23.2908 10.2218L20.6816 8.50198C21.2614 7.92869 21.6963 7.06876 21.6963 6.06551V4.77561C21.6963 3.05575 20.3916 1.33589 18.6521 1.04925C16.9127 0.762605 15.4631 1.76586 14.7383 3.05575C16.3328 4.48897 17.3475 6.49547 17.3475 8.78862V10.2218C17.3475 11.5117 17.0576 12.8016 16.4778 13.8049C16.4778 13.8049 18.2173 15.0948 18.2173 15.2381H23.1458C24.0156 15.2381 24.5954 14.6648 24.5954 13.8049V12.6583C24.5954 11.6551 24.1606 10.7951 23.2908 10.2218Z' />
		</svg>
	)
}

export const AbountIcon: React.FC<SVGProps> = ({ width = 25, height = 25 }) => {
	return (
		<svg width={width} height={height} viewBox='0 0 25 25' fill='none' xmlns='http://www.w3.org/2000/svg'>
			<path
				d='M14.3318 19.7068C14.2898 19.7068 14.2472 19.6887 14.2175 19.6537L11.5465 16.9952C11.4891 16.9293 11.4949 16.8278 11.5582 16.7686C11.6214 16.7088 11.7189 16.7149 11.7757 16.7807L14.4467 19.4393C14.5041 19.5052 14.4983 19.6067 14.4351 19.6658C14.4047 19.6927 14.3686 19.7068 14.3318 19.7068Z'
				stroke='#D5E2DC'
				strokeWidth='2.01923'
			/>
			<path d='M23.2879 20.5063L24.1792 20.0321L24.1782 20.0302L23.2879 20.5063ZM23.0123 20.4188L22.6153 19.4905L22.6085 19.4935L23.0123 20.4188ZM23.1533 21.9102L23.9936 22.47L23.9938 22.4696L23.1533 21.9102ZM21.8476 22.6865L21.8053 23.6952L21.8442 23.6968L21.883 23.6955L21.8476 22.6865ZM3.58741 21.9219L3.62964 20.9132L3.62848 20.9131L3.58741 21.9219ZM3.23926 21.8419L3.19973 22.8507L3.1999 22.8507L3.23926 21.8419ZM3.67349 21.8588L3.63413 22.8677L3.9191 22.8788L4.16777 22.7392L3.67349 21.8588ZM8.29828 18.5059L8.90039 19.3163L10.0876 18.4342L8.83368 17.6499L8.29828 18.5059ZM4.39635 16.0652L4.93175 15.2093L4.07073 14.6707L3.53725 15.5349L4.39635 16.0652ZM1.71129 20.4148L0.85219 19.8844L0.846462 19.8937L0.840937 19.9031L1.71129 20.4148ZM1.75319 19.9046L0.880257 19.3974L0.874959 19.4065L0.869852 19.4157L1.75319 19.9046ZM4.59664 15.0113L3.72592 14.5003L3.72371 14.5041L4.59664 15.0113ZM6.93399 13.0977L6.8907 12.089L6.87059 12.0899L6.85052 12.0916L6.93399 13.0977ZM14.6299 12.7675L14.593 11.7585L14.5866 11.7588L14.6299 12.7675ZM14.6333 12.7674L14.6702 13.7763L14.6702 13.7763L14.6333 12.7674ZM17.9179 13.8829L18.6891 13.2313L18.6743 13.2138L18.6587 13.1969L17.9179 13.8829ZM20.5031 16.9429L21.2758 16.2932L21.2743 16.2913L20.5031 16.9429ZM20.4643 17.2049L19.8882 16.3758L19.8877 16.3762L20.4643 17.2049ZM20.3402 17.2399V16.2303H20.3134L20.2866 16.2317L20.3402 17.2399ZM20.33 17.2425L20.6756 18.1911L20.6759 18.191L20.33 17.2425ZM20.3163 17.2449L20.4667 16.2464L20.4553 16.2449L20.3163 17.2449ZM11.5088 16.0209L11.6478 15.0209L11.2183 14.9612L10.8794 15.2315L11.5088 16.0209ZM4.37811 21.58L3.8079 20.7468L1.3023 22.4616L4.33583 22.5887L4.37811 21.58ZM21.8496 22.3123L21.8073 23.321L21.8469 23.3227L21.8865 23.3212L21.8496 22.3123ZM22.7997 21.7169L23.6396 22.2771L23.6402 22.2763L22.7997 21.7169ZM22.9154 20.6679L23.8064 20.1929L23.8057 20.1917L22.9154 20.6679ZM1.69239 21.3227L2.52216 20.7476L2.52058 20.7453L1.69239 21.3227ZM1.74475 21.2004L2.59153 20.6506L2.59131 20.6503L1.74475 21.2004ZM24.1782 20.0302C23.8549 19.4256 23.1455 19.2638 22.6153 19.4906L23.4093 21.3471C23.0846 21.486 22.6216 21.4013 22.3976 20.9824L24.1782 20.0302ZM23.9938 22.4696C24.4645 21.7623 24.6089 20.8396 24.1792 20.0321L22.3966 20.9806C22.4119 21.0093 22.456 21.1357 22.3128 21.3509L23.9938 22.4696ZM21.883 23.6955C22.747 23.6651 23.53 23.1659 23.9936 22.47L22.3131 21.3505C22.1628 21.5762 21.9454 21.6728 21.8122 21.6775L21.883 23.6955ZM3.54517 22.9306L21.8053 23.6952L21.8898 21.6777L3.62964 20.9132L3.54517 22.9306ZM2.34793 22.7517C2.71549 22.8582 3.11967 22.9133 3.54633 22.9307L3.62848 20.9131C3.31708 20.9005 3.08155 20.862 2.90985 20.8123L2.34793 22.7517ZM3.2788 20.833C3.08707 20.8255 2.92846 20.809 2.79978 20.7869L2.458 22.777C2.69073 22.817 2.93925 22.8405 3.19973 22.8507L3.2788 20.833ZM3.71286 20.85L3.27863 20.833L3.1999 22.8507L3.63413 22.8677L3.71286 20.85ZM7.69617 17.6955C6.60147 18.5088 5.53444 19.2964 4.69921 19.904C4.28125 20.2081 3.9241 20.4651 3.65173 20.657C3.51533 20.7531 3.40329 20.8306 3.31713 20.8887C3.27407 20.9177 3.2399 20.9402 3.21396 20.9568C3.18576 20.9748 3.17607 20.9802 3.17921 20.9785L4.16777 22.7392C4.40656 22.6051 5.08083 22.1234 5.88712 21.5369C6.73031 20.9234 7.80351 20.1312 8.90039 19.3163L7.69617 17.6955ZM3.86096 16.9212L7.76288 19.3618L8.83368 17.6499L4.93175 15.2093L3.86096 16.9212ZM2.5704 20.9451L5.25546 16.5956L3.53725 15.5349L0.85219 19.8844L2.5704 20.9451ZM2.58432 20.9418C2.58469 20.9395 2.58583 20.9337 2.58841 20.9251C2.59094 20.9166 2.59396 20.9083 2.59684 20.9012C2.59967 20.8943 2.6015 20.8906 2.60099 20.8917C2.60069 20.8923 2.59966 20.8943 2.59768 20.898C2.59669 20.8999 2.59542 20.9022 2.59385 20.9051C2.59307 20.9065 2.59215 20.9081 2.5911 20.91C2.59059 20.9109 2.58994 20.9121 2.58918 20.9134C2.58882 20.914 2.58827 20.915 2.5876 20.9162C2.58728 20.9167 2.58674 20.9177 2.58608 20.9188C2.58577 20.9194 2.58506 20.9206 2.58466 20.9213C2.58407 20.9223 2.58256 20.9249 2.58165 20.9264L0.840937 19.9031C0.808363 19.9585 0.652107 20.2399 0.590774 20.6207L2.58432 20.9418ZM0.869852 19.4157C0.840349 19.469 0.471273 20.1283 0.588633 20.9279L2.58646 20.6346C2.58214 20.6052 2.58529 20.5485 2.60796 20.4731C2.62912 20.4027 2.65286 20.3641 2.63653 20.3936L0.869852 19.4157ZM3.72371 14.5041L0.880257 19.3974L2.62613 20.4119L5.46958 15.5186L3.72371 14.5041ZM6.85052 12.0916C6.15646 12.1491 5.53084 12.2824 4.9684 12.7719C4.49552 13.1834 4.13304 13.8067 3.72593 14.5003L5.46736 15.5224C5.93589 14.7241 6.12546 14.4417 6.29403 14.295C6.37304 14.2262 6.47827 14.1486 7.01745 14.1039L6.85052 12.0916ZM14.5866 11.7588L6.8907 12.089L6.97727 14.1064L14.6732 13.7762L14.5866 11.7588ZM14.5964 11.7584L14.593 11.7585L14.6669 13.7764L14.6702 13.7763L14.5964 11.7584ZM18.6587 13.1969C17.22 11.6433 15.5819 11.7223 14.5964 11.7584L14.6702 13.7763C15.6205 13.7415 16.4022 13.732 17.1771 14.5689L18.6587 13.1969ZM21.2743 16.2913L18.6891 13.2313L17.1467 14.5345L19.7319 17.5945L21.2743 16.2913ZM21.0405 18.034C21.5944 17.6491 21.7461 16.8525 21.2758 16.2932L19.7303 17.5927C19.3981 17.1975 19.5151 16.6351 19.8882 16.3758L21.0405 18.034ZM20.3402 18.2495C20.5216 18.2495 20.7864 18.2108 21.041 18.0337L19.8877 16.3762C20.0688 16.2502 20.2462 16.2303 20.3402 16.2303V18.2495ZM20.6759 18.191C20.6834 18.1883 20.649 18.2014 20.6074 18.213C20.5602 18.2262 20.4862 18.2432 20.3938 18.2481L20.2866 16.2317C20.1905 16.2368 20.1131 16.2545 20.0626 16.2687C20.0376 16.2757 20.0174 16.2823 20.0049 16.2866C19.9985 16.2888 19.9933 16.2907 19.99 16.2919C19.9869 16.293 19.9842 16.2939 19.9842 16.294L20.6759 18.191ZM20.166 18.2432C20.3163 18.2659 20.4454 18.2514 20.539 18.2309C20.5832 18.2212 20.6185 18.2105 20.6403 18.2033C20.6514 18.1997 20.6604 18.1966 20.666 18.1946C20.6689 18.1935 20.6713 18.1927 20.6728 18.1921C20.6743 18.1916 20.6755 18.1912 20.6756 18.1911L19.9844 16.2939C19.9547 16.3047 20.1828 16.2038 20.4667 16.2465L20.166 18.2432ZM11.3699 17.0209L20.1774 18.2449L20.4553 16.2449L11.6478 15.0209L11.3699 17.0209ZM4.94831 22.4132C5.62565 21.9496 7.3728 20.6106 12.1383 16.8102L10.8794 15.2315C6.08592 19.0542 4.40901 20.3355 3.8079 20.7468L4.94831 22.4132ZM21.8918 21.3035L4.42039 20.5713L4.33583 22.5887L21.8073 23.321L21.8918 21.3035ZM21.9598 21.1566C21.9195 21.217 21.8711 21.2607 21.8303 21.2861C21.7869 21.3132 21.7777 21.3046 21.8126 21.3033L21.8865 23.3212C22.6232 23.2942 23.2655 22.8381 23.6396 22.2771L21.9598 21.1566ZM22.0245 21.1428C22.0135 21.1222 22.0075 21.1026 22.0047 21.0869C22.002 21.0716 22.0029 21.0633 22.0029 21.0635C22.0027 21.065 21.9979 21.0994 21.9592 21.1575L23.6402 22.2763C24.0243 21.6991 24.1865 20.906 23.8064 20.1929L22.0245 21.1428ZM22.6085 19.4935C22.0356 19.7435 21.6628 20.4664 22.0251 21.144L23.8057 20.1917C24.0687 20.6835 23.7833 21.1839 23.4161 21.3442L22.6085 19.4935ZM2.52058 20.7453C2.55831 20.7994 2.57568 20.8549 2.58184 20.8948C2.58728 20.93 2.5834 20.9475 2.58432 20.9418L0.590774 20.6207C0.540111 20.9353 0.538369 21.4328 0.864204 21.9002L2.52058 20.7453ZM2.79978 20.7869C2.63007 20.7578 2.53399 20.7225 2.48881 20.7004C2.44585 20.6793 2.47901 20.6853 2.52216 20.7476L0.862623 21.8979C1.25382 22.4623 1.90671 22.6824 2.458 22.777L2.79978 20.7869ZM0.897973 21.7502C1.24445 22.2839 1.78458 22.5885 2.34793 22.7517L2.90985 20.8123C2.6436 20.7351 2.5918 20.651 2.59153 20.6506L0.897973 21.7502ZM0.588633 20.9279C0.627719 21.1941 0.721099 21.4781 0.898185 21.7506L2.59131 20.6503C2.58968 20.6478 2.58924 20.6466 2.58897 20.6459C2.58858 20.6448 2.58746 20.6414 2.58646 20.6346L0.588633 20.9279Z' />
			<path
				fillRule='evenodd'
				clipRule='evenodd'
				d='M7.53418 7.40128C7.53418 4.8729 9.5348 2.82275 12.003 2.82275C14.4712 2.82275 16.4719 4.8729 16.4728 7.40128C16.4728 7.48935 16.4699 7.57742 16.465 7.66446C16.5214 10.1294 12.3403 16.1958 11.9943 16.6945V16.7273C11.9943 16.7273 11.9894 16.7212 11.9826 16.7109C11.9748 16.7212 11.9709 16.7273 11.9709 16.7273V16.6935C11.6676 16.2511 8.42659 11.477 7.70722 8.66701C7.59445 8.26558 7.53418 7.8406 7.53418 7.40128ZM9.97199 7.32129C9.97199 8.45041 10.8813 9.36607 12.0035 9.36607C13.125 9.36607 14.035 8.45041 14.035 7.32129C14.035 6.19216 13.1257 5.2765 12.0035 5.2765C10.8813 5.2765 9.97199 6.19216 9.97199 7.32129Z'
			/>
		</svg>
	)
}
