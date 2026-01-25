import { createCn } from 'bem-react-classname';
import { MenuOutlined, UserOutlined } from '@ant-design/icons';

import './styles.css'

export const TopBar = () => {
    const cn = createCn('top-bar');

    return <div className={cn()}>
        <MenuOutlined className={cn('icon')} />
        <div className={cn('title')} >
            Личный кабинет
        </div>
        <UserOutlined className={cn('icon')} />
    </div>
}