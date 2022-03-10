import { useEffect, useState } from "react";
import useViewGrid from "../hooks/useViewGrid";
import Element from "./elements/Element";

export default function View({view, toolFactory, showGrid, onUpdate, onSelectedElementChange}) {
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

    const handleElementFocus = (element, domElement) => {
        onSelectedElementChange({isSelected: true, element, domElement});
    }

    const handleElementBlur = (element, domElement) => {
        onSelectedElementChange({isSelected: false});
    }

    if (!view?.id) {
        return <></>
    }

    return <section className="view" style={styles} ref={setDomView} onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp}>
        {showGrid && <Grid grid={grid} />}
        {view.elements?.map((element) => <Element type={element.type} key={element.id} grid={grid} tool={toolFactory} onFocus={handleElementFocus} onBlur={handleElementBlur} onChange={handleElementChange} onRemove={handleElementRemove} element={element} />)}
    </section>
}

function Grid({grid}) {
    const getColumnStyle = column => {
        return {
            left: column - grid.columnGap * 0.5,
            width: grid.columnGap,
        }
    }

    const getRowStyle = row => {
        return {
            top: row - grid.rowGap * 0.5,
            height: grid.rowGap,
        }
    }

    return <>
        {grid?.columns.map(column => <div key={column} className="view__grid-column" style={getColumnStyle(column)}></div>)}
        {grid?.rows.map(row => <div key={row} className="view__grid-row" style={getRowStyle(row)}></div>)}
    </>
}