import { createCn } from 'bem-react-classname';
import './styles.css'
import { ApiOutlined, InfoCircleOutlined, LineChartOutlined } from '@ant-design/icons';

export const TabBar = () => {
    const cn = createCn('tab-bar');

    return <div className={cn()}>
        <div className={cn('tab', { state: 'active' })}><div className={cn('icon', { state: 'active' })}><LineChartOutlined /></div><div className={cn('label', { state: 'active' })}>Мониторинг</div></div>
        <div className={cn('tab')}><div title="Автоматика" className={cn('icon')}><ApiOutlined /></div><div className={cn('label')}>Автоматика</div></div>
        <div className={cn('tab')}><div title="Информация" className={cn('icon')}><InfoCircleOutlined /></div><div className={cn('label')}>Информация</div></div>
    </div>
}