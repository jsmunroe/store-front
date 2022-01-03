import { useState } from "react";
import useSectionGrid from "../hooks/useSectionGrid";
import Image from "./elements/Image";

export default function Section({section, tool, onUpdateSection}) {
    const [displayGrid, setDisplayGrid] = useState(true);
    const [sectionElement, setSectionElement] = useState(null);
    const { grid, styles } = useSectionGrid(section, sectionElement);

    const handleElementChange = (element) => {
        const elements = section.elements.map(e => e.id === element.id ? element : e);
        onUpdateSection({...section, elements });
    }

    return <section className="section" style={styles} ref={setSectionElement}>
        {displayGrid && <SectionGrid grid={grid} />}
        {section.elements?.map((element, index) => <Image key={index} sectionGrid={grid} tool={tool} onChange={handleElementChange} element={element} />)}
    </section>
}

function SectionGrid({grid}) {
    const columnStyle = {
        pointerEvents: 'pointer-events: none',
        borderLeft: 'silver solid 2px',
        width: '1px',
        position: 'absolute',
        height: '100%',
    }

    const rowStyle = {
        pointerEvents: 'pointer-events: none',
        borderTop: 'silver solid 2px',
        height: '1px',
        position: 'absolute',
        width: '100%',
    }

    return <>
        {grid?.columns.map(column => <div key={column} className="section__grid-column" style={{left: column}}></div>)}
        {grid?.rows.map(row => <div key={row} className="section__grid-row" style={{top: row}}></div>)}
    </>
}