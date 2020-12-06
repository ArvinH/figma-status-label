// This plugin will open a window to prompt the user to enter a number, and
// it will then create that many rectangles on the screen.
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// This file holds the main code for the plugins. It has access to the *document*.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (see documentation).
// This shows the HTML page in "ui.html".
figma.showUI(__html__);
// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
figma.ui.onmessage = (msg) => __awaiter(this, void 0, void 0, function* () {
    // One way of distinguishing between different types of messages sent from
    // your HTML page is to use an object with a "type" property like this.
    if (msg.type === 'create-label') {
        const nodes = [];
        yield figma.loadFontAsync({ family: "Roboto", style: "Bold" });
        let group;
        for (const node of figma.currentPage.selection) {
            const frame = createLabel(msg);
            frame.x = node.x;
            frame.y = node.y - 50;
            group = figma.group([node, frame], figma.currentPage);
            group.layoutGrow = 1;
        }
        nodes.push(group);
        figma.currentPage.selection = nodes;
        figma.viewport.scrollAndZoomIntoView(nodes);
    }
    // Make sure to close the plugin when you're done. Otherwise the plugin will
    // keep running, which shows the cancel button at the bottom of the screen.
    figma.closePlugin();
});
const colorMap = {
    'LGTM': { r: 0, g: 0.8, b: 0 },
    'Working in progress': { r: 0.8, g: 0.3, b: 0.1 },
    'In Review': { r: 0.2, g: 0.2, b: 0.6 },
    'Please Review': { r: 0.8, g: 0, b: 0 },
};
const createLabel = (msg) => {
    const frame = figma.createFrame();
    frame.name = 'Status Label';
    frame.paddingLeft = 10;
    frame.paddingRight = 10;
    frame.paddingTop = 5;
    frame.paddingBottom = 5;
    frame.fills = [{ type: 'SOLID', color: colorMap[msg.text] }];
    frame.cornerRadius = 4;
    frame.resize(120, 30);
    const text = figma.createText();
    text.fontName = { family: "Roboto", style: "Bold" };
    text.fontSize = 12;
    text.strokeWeight = 18;
    text.textAlignHorizontal = 'CENTER';
    text.textAlignVertical = 'CENTER';
    text.x = 60;
    text.y = 8;
    text.constraints = { horizontal: 'STRETCH', vertical: 'STRETCH' };
    text.textAlignHorizontal = 'CENTER';
    text.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
    text.characters = msg.text;
    frame.constrainProportions = true;
    frame.appendChild(text);
    return frame;
};
