import { useState } from "react";
import useSectionGrid from "../hooks/useSectionGrid";
import Image from "./elements/Image";

export default function Section({section, tool, onUpdateSection}) {
    const [sectionElement, setSectionElement] = useState(null);
    const { grid, styles } = useSectionGrid(section, sectionElement);

    const handleElementChange = (element) => {
        const elements = section.elements.map(e => e.id === element.id ? element : e);
        onUpdateSection({...section, elements });
    }

    const columnStyle = {
        borderLeft: 'silver solid 2px',
        width: '1px',
        position: 'absolute',
        height: '100%',
    }

    const rowStyle = {
        borderTop: 'silver solid 2px',
        height: '1px',
        position: 'absolute',
        width: '100%',
    }

    return <section className="section" style={styles} ref={setSectionElement}>
        {section.elements?.map((element, index) => <Image key={index} sectionGrid={grid} tool={tool} onChange={handleElementChange} element={element} />)}
        {grid?.columns.map(column => <div key={column} style={{...columnStyle, left: column}}></div>)}
        {grid?.rows.map(row => <div key={row} style={{...rowStyle, top: row}}></div>)}
    </section>
}
