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

interface InfoProp {
	txt?: string
}

const Info: React.FC<{ txt: string }> = ({ txt }) => {
	return <div className=''>test</div>
}

export default Info
