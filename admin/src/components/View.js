import { useEffect, useState } from "react";
import useViewGrid from "../hooks/useViewGrid";
import Element from "./elements/Element";
import ViewGrid from "./ViewGrid";
import Busy from "./Busy";

export default function View({view, tool, showGrid, onUpdate}) {
    const [domView, setDomView] = useState(null);
    const [toolState, setToolState] = useState(null);
    const { grid, styles } = useViewGrid(view, domView);

    useEffect(() => {
        if (tool && domView && grid) {
            setToolState(tool.buildState(view, domView, grid, onUpdate));
        }       

    }, [tool, domView, view, grid, onUpdate])

    const handleElementChange = (element) => {
        const elements = view.elements.map(e => e.id === element.id ? element : e);
        onUpdate({...view, elements });
    }

    const handleElementRemove = (element) => {
        const elements = view.elements.filter(e => e.id !== element.id);
        onUpdate({...view, elements });
    }

    const handlePointerDown = event => {
        event.stopPropagation();

        tool.onPointerDown(toolState, event);
    }

    const handlePointerMove = event => {
        tool.onPointerMove(toolState, event);
    }

    const handlePointerUp = event => {
        tool.onPointerUp(toolState, event);
    }

    if (!view?.id) {
        return <Busy />
    }

    return <section className="view" style={styles} ref={setDomView} onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp}>
        {showGrid && <ViewGrid grid={grid} />}
        {view.elements?.map((element) => <Element type={element.type} key={element.id} grid={grid} tool={tool} onChange={handleElementChange} onRemove={handleElementRemove} element={element} />)}
    </section>
}