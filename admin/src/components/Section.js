import { useState } from "react";
import useSectionGrid from "../hooks/useSectionGrid";
import Image from "./elements/Image";

export default function Section({section}) {
    const [sectionElement, setSectionElement] = useState(null);
    const { grid, styles } = useSectionGrid(section, sectionElement);

    const handleElementResize = () => {

    }

    return <section className="section" style={styles} ref={setSectionElement}>
        {section.elements?.map((element, index) => <Image key={index} sectionGrid={grid} onResize={handleElementResize} {...element} />)}
    </section>
}
