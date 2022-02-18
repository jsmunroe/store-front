import InsertElementTool from "./InsertElementTool";
import ResizeToolFactory from "./ResizeTool";

const toolFactoryMap = {
    resize: () => new ResizeToolFactory(),
    'insert-image': () => new InsertElementTool('Image'),
    'insert-text': () => new InsertElementTool('Text'),
}

const defaultToolFactory = toolFactoryMap.resize;

export default function createToolFactory(name) {
    var factory = toolFactoryMap[name] ?? defaultToolFactory;

    if (!factory) {
        factory = defaultToolFactory;
    }

    return factory();
}