import { LeftOutlined } from "@ant-design/icons"

import './styles.css'
import { createCn } from "bem-react-classname";

export const ActionButton = ({ type }: { type: string }) => {
    const cn = createCn('action-button');

    return <div className={cn()}>
        <div className={cn('icon-wrapper')}>
            {type === 'add' ? <div className={cn('icon')} >+</div> : <LeftOutlined className={cn('icon')} />}

        </div >
    </div>
}