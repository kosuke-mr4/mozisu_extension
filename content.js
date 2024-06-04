var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
        const selection = selectionObject.toString().replace(/\s/g, "");
        if (selection === "") {
            const existingCountElement = document.getElementById("selection-count");
            if (existingCountElement) {
                existingCountElement.remove();
            }
            return;
        }
        function textCharaSplit(text) {
            const ZWJ = 0x200d; // Zero Width Joiner
            const VS_START1 = 0xfe00; // Variation Selector Start Range 1
            const VS_END1 = 0xfe0f; // Variation Selector End Range 1
            const VS_START2 = 0xe0100; // Variation Selector Start Range 2
            const VS_END2 = 0xe01ef; // Variation Selector End Range 2
            const EMOJI_MODIFIER_START = 0x1f3fb; // Emoji Modifier Start
            const EMOJI_MODIFIER_END = 0x1f3ff; // Emoji Modifier End
            const REGIONAL_INDICATOR_START = 0x1f1e6; // Regional Indicator Symbol Letter A
            const REGIONAL_INDICATOR_END = 0x1f1ff; // Regional Indicator Symbol Letter Z
            const TAG_BASE = 0x1f3f4; // Tag base
            const TAG_START = 0xe0020; // Tag Start
            const TAG_END = 0xe007f; // Tag End
            const CANCEL_TAG = 0xe007f; // Cancel Tag
            const KEYCAP_END = 0x20e3; // Combining Enclosing Keycap
            const charArr = [];
            let chara = [];
            let needCode = 0;
            let regionalIndicatorCount = 0;
            let inTagSequence = false;
            let inKeycapSequence = false;
            for (const c of text) {
                const cp = c.codePointAt(0);
                if (cp === ZWJ) {
                    // ZWJ
                    needCode += 1;
                }
                else if ((VS_START1 <= cp && cp <= VS_END1) ||
                    (VS_START2 <= cp && cp <= VS_END2)) {
                    // Variation Selector
                    // Do nothing, continue to next character
                }
                else if (EMOJI_MODIFIER_START <= cp && cp <= EMOJI_MODIFIER_END) {
                    // Emoji Modifier
                    // Do nothing, continue to next character
                }
                else if (REGIONAL_INDICATOR_START <= cp &&
                    cp <= REGIONAL_INDICATOR_END) {
                    // Emoji Flag Sequence
                    regionalIndicatorCount += 1;
                    if (regionalIndicatorCount === 2) {
                        charArr.push(chara.join("") + c);
                        chara = [];
                        regionalIndicatorCount = 0;
                        continue;
                    }
                }
                else if (cp === TAG_BASE) {
                    // Emoji Tag Sequence
                    inTagSequence = true;
                    chara.push(c);
                    continue;
                }
                else if (inTagSequence &&
                    ((TAG_START <= cp && cp <= TAG_END) || cp === CANCEL_TAG)) {
                    chara.push(c);
                    if (cp === CANCEL_TAG) {
                        charArr.push(chara.join(""));
                        chara = [];
                        inTagSequence = false;
                    }
                    continue;
                }
                else if (/^[0-9#*]$/.test(c) && !inKeycapSequence) {
                    // Keycap Sequence Start
                    inKeycapSequence = true;
                }
                else if (inKeycapSequence && cp === KEYCAP_END) {
                    // Keycap Sequence End
                    chara.push(c);
                    charArr.push(chara.join(""));
                    chara = [];
                    inKeycapSequence = false;
                    continue;
                }
                else if (needCode > 0) {
                    needCode -= 1;
                }
                else if (chara.length > 0) {
                    charArr.push(chara.join(""));
                    chara = [];
                }
                chara.push(c);
            }
            if (chara.length > 0) {
                charArr.push(chara.join(""));
            }
            return charArr;
        }
        const count = textCharaSplit(selection).length;
        // すでに文字数表示要素が存在する場合は削除
        const existingCountElement = document.getElementById("selection-count");
        if (existingCountElement) {
            existingCountElement.remove();
        }
        // 選択文字列の最後の文字の位置を取得
        const range = selectionObject.getRangeAt(selectionObject.rangeCount - 1);
        const rect = range.getBoundingClientRect();
        // 選択文字列の右下に文字数を表示するための要素を作成
        const countElement = document.createElement("div");
        countElement.id = "selection-count";
        countElement.style.position = "absolute";
        countElement.style.background = "rgba(0, 0, 0, 0.7)";
        countElement.style.color = "white";
        countElement.style.padding = "2px 4px";
        countElement.style.fontSize = "12px";
        countElement.style.borderRadius = "3px";
        countElement.style.zIndex = "9999";
        countElement.textContent = `${count} characters`;
        // 文字数表示要素の位置を設定
        const viewportHeight = window.innerHeight;
        const elementHeight = countElement.offsetHeight;
        let top = rect.bottom + window.pageYOffset;
        // 文字数表示要素がビューポートからはみ出る場合は、選択文字列の上に表示
        if (top + elementHeight > viewportHeight + window.pageYOffset) {
            top = rect.top + window.pageYOffset - elementHeight;
        }
        countElement.style.left = `${rect.right + window.pageXOffset}px`;
        countElement.style.top = `${top}px`;
        document.body.appendChild(countElement);
    });
}
document.addEventListener("selectionchange", () => {
    countSelectedText();
});
