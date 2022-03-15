import { useState } from "react";
import useViewGrid from "../hooks/useViewGrid";
import Element from "./elements/Element";
import ViewGrid from "./ViewGrid";
import Busy from "./Busy";
import ToolTarget from "./ToolTarget";

export default function View({view, tool, showGrid, onUpdate}) {
    const [domView, setDomView] = useState(null);
    const { grid, styles } = useViewGrid(view, domView);

    const handleElementChange = (element) => {
        const elements = view.elements.map(e => e.id === element.id ? element : e);
        onUpdate({...view, elements });
    }

    const handleElementRemove = (element) => {
        const elements = view.elements.filter(e => e.id !== element.id);
        onUpdate({...view, elements });
    }

    if (!view?.id) {
        return <Busy />
    }

    return <ToolTarget tool={tool} targetType="view" targetModel={view} grid={grid} onUpdate={onUpdate} className="view" style={styles} onRef={setDomView}>
        {showGrid && <ViewGrid grid={grid} />}
        {view.elements?.map((element) => <Element type={element.type} key={element.id} grid={grid} tool={tool} onChange={handleElementChange} onRemove={handleElementRemove} element={element} />)}
    </ToolTarget>
}