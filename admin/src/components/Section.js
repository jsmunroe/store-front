import { useState } from "react";
import useSectionGrid from "../hooks/useSectionGrid";
import Element from "./elements/Element";

export default function Section({section, tool, onUpdateSection}) {
    const [displayGrid] = useState(true);
    const [sectionElement, setSectionElement] = useState(null);
    const { grid, styles } = useSectionGrid(section, sectionElement);

    const handleElementChange = (element) => {
        const elements = section.elements.map(e => e.id === element.id ? element : e);
        onUpdateSection({...section, elements });
    }

    return <section className="section" style={styles} ref={setSectionElement}>
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