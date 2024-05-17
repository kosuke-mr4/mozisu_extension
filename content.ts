async function loadGraphemeSplitter() {
  const { default: GraphemeSplitter } = await import('grapheme-splitter');
  return GraphemeSplitter;
}

async function countSelectedText() {
  const selectionObject = window.getSelection();
  if (!selectionObject || selectionObject.rangeCount === 0) {
    const existingCountElement = document.getElementById("selection-count");
    if (existingCountElement) {
      existingCountElement.remove();
    }
    return;
  }

  const selection = selectionObject.toString().replace(/\s/g, '');
  if (selection === "") {
    const existingCountElement = document.getElementById("selection-count");
    if (existingCountElement) {
      existingCountElement.remove();
    }
    return;
  }

  const GraphemeSplitter = await loadGraphemeSplitter();
  const splitter = new GraphemeSplitter();
  const count = [...splitter.iterateGraphemes(selection)].length;

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
}

document.addEventListener("selectionchange", () => {
  countSelectedText();
});