import { useEffect, useState } from "react";
import useSectionGrid from "../hooks/useSectionGrid";
import Element from "./elements/Element";

export default function Section({section, tool, onUpdateSection}) {
    const [displayGrid] = useState(true);
    const [sectionElement, setSectionElement] = useState(null);
    const [localTool, setLocalTool] = useState(null);
    const { grid, styles } = useSectionGrid(section, sectionElement);

    useEffect(() => {
        if (!!tool && !!sectionElement && !! grid) {
            setLocalTool(tool.bindSection(section, sectionElement, grid, onUpdateSection));
        }       

    }, [tool, sectionElement, section, grid, onUpdateSection])

    const handleElementChange = (element) => {
        const elements = section.elements.map(e => e.id === element.id ? element : e);
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
        {displayGrid && <SectionGrid grid={grid} />}
        {section.elements?.map((element, index) => <Element type={element.type} key={index} sectionGrid={grid} tool={tool} onChange={handleElementChange} element={element} />)}
    </section>
}

function SectionGrid({grid}) {
    return <>
        {grid?.columns.map(column => <div key={column} className="section__grid-column" style={{left: column}}></div>)}
        {grid?.rows.map(row => <div key={row} className="section__grid-row" style={{top: row}}></div>)}
    </>
}