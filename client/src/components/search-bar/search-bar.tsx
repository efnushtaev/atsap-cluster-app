import { createCn } from 'bem-react-classname';
import './styles.css'
import { SearchOutlined } from '@ant-design/icons';

export const SearchBar = () => {
    const cn = createCn('search-bar');

    return <div className={cn()}>
        <div className={cn('content')}>
            Поиск тут
        </div>
        <SearchOutlined />
    </div>
}