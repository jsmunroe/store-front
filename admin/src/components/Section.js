import { useState } from "react";
import useSectionGrid from "../hooks/useSectionGrid";
import Image from "./elements/Image";

export default function Section({section, onUpdateSection}) {
    const [sectionElement, setSectionElement] = useState(null);
    const { grid, styles } = useSectionGrid(section, sectionElement);

    const handleElementResize = (element) => {
        const elements = section.elements.map(e => e.id === element.id ? element : e);
        onUpdateSection({...section, elements });
    }

    return <section className="section" style={styles} ref={setSectionElement}>
        {section.elements?.map((element, index) => <Image key={index} sectionGrid={grid} onResize={handleElementResize} element={element} />)}
    </section>
}
