import InsertElementTool from "./InsertElementTool";
import ResizeTool from "./ResizeTool";

const toolMap = {
    resize: new ResizeTool(),
    'insert-image': new InsertElementTool('Image'),
    'insert-text': new InsertElementTool('Text'),
}

export default function getTool(name) {
    return toolMap[name] ?? toolMap.resize;
}