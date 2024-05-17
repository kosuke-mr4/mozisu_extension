var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function loadGraphemeSplitter() {
    return __awaiter(this, void 0, void 0, function* () {
        const { default: GraphemeSplitter } = yield import("grapheme-splitter");
        return GraphemeSplitter;
    });
}
function countSelectedText() {
    return __awaiter(this, void 0, void 0, function* () {
        const selectionObject = window.getSelection();
        if (!selectionObject || selectionObject.rangeCount === 0) {
            const existingCountElement = document.getElementById("selection-count");
            if (existingCountElement) {
                existingCountElement.remove();
            }
            return;
        }
        const selection = selectionObject.toString();
        const GraphemeSplitter = yield loadGraphemeSplitter();
        const splitter = new GraphemeSplitter();
        const count = [...splitter.iterateGraphemes(selection)].length;
        // すでに文字数表示要素が存在する場合は削除
        const existingCountElement = document.getElementById("selection-count");
        if (existingCountElement) {
            existingCountElement.remove();
        }
        // 選択文字列の上部に文字数を表示するための要素を作成
        const countElement = document.createElement("div");
        countElement.id = "selection-count";
        countElement.style.position = "absolute";
        countElement.style.padding = "4px";
        countElement.style.fontSize = "14px";
        countElement.style.zIndex = "9999";
        countElement.textContent = count.toString();
        // 選択範囲の座標を取得し、文字数表示要素の位置を設定
        const rect = selectionObject.getRangeAt(0).getBoundingClientRect();
        countElement.style.left = `${rect.left}px`;
        countElement.style.top = `${rect.top - 20}px`;
        // 背景色を取得し、適切な文字色を設定
        const element = document.elementFromPoint(rect.left, rect.top);
        if (element) {
            const backgroundColor = window.getComputedStyle(element).backgroundColor;
            const fontColor = getContrastColor(backgroundColor);
            countElement.style.color = fontColor;
            countElement.style.backgroundColor = backgroundColor;
        }
        document.body.appendChild(countElement);
    });
}
// 背景色に応じて適切な文字色を返す関数
function getContrastColor(backgroundColor) {
    const rgb = backgroundColor.match(/\d+/g);
    if (!rgb || rgb.length !== 3) {
        return "black";
    }
    const brightness = (parseInt(rgb[0]) * 299 + parseInt(rgb[1]) * 587 + parseInt(rgb[2]) * 114) /
        1000;
    return brightness > 128 ? "black" : "white";
}
document.addEventListener("selectionchange", () => {
    countSelectedText();
});
