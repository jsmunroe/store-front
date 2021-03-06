import { useState } from "react"
import ViewList from "./ViewList";

export default function Navigation() {
    const [active, setActive] = useState('views');   

    const activeIf = (value) => {
        return active === value ? 'active' : '';
    }

    return <>
        <div className="sidebar">
            <section className="menu">
                <button className={`menu__button ${activeIf('views')}`} value="views" onClick={() => setActive('views')}>
                    <i className="icon-view-list menu__icon"></i>
                    <span className="menu__text">Views</span>
                </button>
                <button className={`menu__button ${activeIf('templates')}`} value="templates" onClick={() => setActive('templates')}>
                    <i className="icon-template-list menu__icon"></i>
                    <span className="menu__text">Templates</span>
                </button>
            </section>
        </div>

        <div className="items-panel">
            <div className={`item-panel ${activeIf('views')}`} name="views">
                <ViewList/>
            </div>
            <div className={`item-panel ${activeIf('templates')}`} name="templates">
            </div>
        </div>
    </>
}