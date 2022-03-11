import { useEffect, useState } from "react";
import useViewGrid from "../hooks/useViewGrid";
import Element from "./elements/Element";
import ViewGrid from "./ViewGrid";
import Busy from "./Busy";

export default function View({view, toolFactory, showGrid, onUpdate}) {
    const [domView, setDomView] = useState(null);
    const [localTool, setLocalTool] = useState(null);
    const { grid, styles } = useViewGrid(view, domView);

    useEffect(() => {
        if (!!toolFactory && !!domView && !! grid) {
            setLocalTool(toolFactory.bindToView(view, domView, grid, onUpdate));
        }       

    }, [toolFactory, domView, view, grid, onUpdate])

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

        localTool?.onPointerDown(event);
    }

    const handlePointerMove = event => {
        localTool?.onPointerMove(event);
    }

    const handlePointerUp = event => {
        localTool?.onPointerUp(event);
    }

    if (!view?.id) {
        return <Busy />
    }

    return <section className="view" style={styles} ref={setDomView} onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp}>
        {showGrid && <ViewGrid grid={grid} />}
        {view.elements?.map((element) => <Element type={element.type} key={element.id} grid={grid} tool={toolFactory} onChange={handleElementChange} onRemove={handleElementRemove} element={element} />)}
    </section>
}