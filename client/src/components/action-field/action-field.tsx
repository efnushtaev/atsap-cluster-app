import { createCn } from "bem-react-classname";
import { SearchBar } from "../search-bar"
import './styles.css'
import { ActionButton } from "../action-button/action-button";

export const ActionField = () => {
    const cn = createCn('action-field');

    return <div className={cn()}>
        <ActionButton type="" />
        <SearchBar />
        {/* <ActionButton type="add" /> */}
    </div>
}