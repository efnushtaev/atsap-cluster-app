import { createCn } from 'bem-react-classname';

import './styles.css'

type UnitsCardProps = {
    title: string;
    describe: string;
}

export const UnitsCard = ({ title, describe }: UnitsCardProps) => {
    const cn = createCn('units-card');

    return <div className={cn()}>
        <div className={cn('content')}>
            <div className={cn('title')}><div>{title}</div></div>
            <div className={cn('describe')}><div>{describe}</div></div>
        </div><div className={cn('picture')}>{title[0]}{describe[0]}</div>
    </div>
}