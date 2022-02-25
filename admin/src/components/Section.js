import { useEffect, useState } from "react";
import useSectionGrid from "../hooks/useSectionGrid";
import Element from "./elements/Element";

export default function Section({section, toolFactory, showGrid, onUpdateSection}) {
    const [sectionElement, setSectionElement] = useState(null);
    const [localTool, setLocalTool] = useState(null);
    const { grid, styles } = useSectionGrid(section, sectionElement);

    useEffect(() => {
        if (!!toolFactory && !!sectionElement && !! grid) {
            setLocalTool(toolFactory.bindToSection(section, sectionElement, grid, onUpdateSection));
        }       

    }, [toolFactory, sectionElement, section, grid, onUpdateSection])

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

    return <section className="section" style={styles} ref={setSectionElement} onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp}>
        {showGrid && <SectionGrid grid={grid} />}
        {section.elements?.map((element) => <Element type={element.type} key={element.id} sectionGrid={grid} tool={toolFactory} onChange={handleElementChange} onRemove={handleElementRemove} element={element} />)}
    </section>
}

function SectionGrid({grid}) {
    return <>
        {grid?.columns.map(column => <div key={column} className="section__grid-column" style={{left: column}}></div>)}
        {grid?.rows.map(row => <div key={row} className="section__grid-row" style={{top: row}}></div>)}
    </>
}