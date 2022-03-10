import { useEffect, useState } from "react";
import useSectionGrid from "../hooks/useSectionGrid";
import Element from "./elements/Element";

export default function Section({section, toolFactory, showGrid, onUpdateSection, onSelectedElementChange}) {
    const [domSection, setDomSection] = useState(null);
    const [localTool, setLocalTool] = useState(null);
    const { grid, styles } = useSectionGrid(section, domSection);

    useEffect(() => {
        if (!!toolFactory && !!domSection && !! grid) {
            setLocalTool(toolFactory.bindToSection(section, domSection, grid, onUpdateSection));
        }       

    }, [toolFactory, domSection, section, grid, onUpdateSection])

    const handleElementChange = (element) => {
        const elements = section.elements.map(e => e.id === element.id ? element : e);
        onUpdateSection({...section, elements });
    }

    const handleElementRemove = (element) => {
        const elements = section.elements.filter(e => e.id !== element.id);
        onUpdateSection({...section, elements });
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

    return <section className="section" style={styles} ref={setDomSection} onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp}>
        {showGrid && <SectionGrid grid={grid} />}
        {section.elements?.map((element) => <Element type={element.type} key={element.id} sectionGrid={grid} tool={toolFactory} onFocus={handleElementFocus} onBlur={handleElementBlur} onChange={handleElementChange} onRemove={handleElementRemove} element={element} />)}
    </section>
}

function SectionGrid({grid}) {
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
        {grid?.columns.map(column => <div key={column} className="section__grid-column" style={getColumnStyle(column)}></div>)}
        {grid?.rows.map(row => <div key={row} className="section__grid-row" style={getRowStyle(row)}></div>)}
    </>
}