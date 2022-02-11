import InsertElementTool from "./InsertElementTool";
import ResizeTool from "./ResizeTool";

const toolFactoryMap = {
    resize: () => new ResizeTool(),
    'insert-image': () => new InsertElementTool('Image'),
    'insert-text': () => new InsertElementTool('Text'),
}

const defaultToolFactory = toolFactoryMap.resize;

export default function createTool(name) {
    var factory = toolFactoryMap[name];

    if (!factory) {
        console.error(`"${name}" is not a recognized tool key.`);
        factory = defaultToolFactory;
    }

    return factory();
}