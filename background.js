import { EN_TO_HE } from './layout.js';

const MENU_ID = 'convert-to-hebrew';

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: MENU_ID,
    title: 'Convert to Hebrew keyboard (a → ש)',
    contexts: ['selection'],
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId !== MENU_ID || tab?.id == null) return;
  try {
    await chrome.scripting.executeScript({
      target: { tabId: tab.id, frameIds: [info.frameId ?? 0] },
      func: convertSelectionInPage,
      args: [EN_TO_HE],
    });
  } catch (err) {
    // Chrome blocks scripts on pages like chrome:// and the Web Store.
    console.warn('Could not convert selection on this page:', err);
  }
});

// Runs in the page, so Chrome serialises it and it can't use anything from
// outside the function. The map is passed in as an argument for that reason.
async function convertSelectionInPage(map) {
  const convert = (s) => Array.from(s, (ch) => map[ch.toLowerCase()] ?? ch).join('');

  const el = document.activeElement;
  const isTextField =
    el?.tagName === 'TEXTAREA' ||
    (el?.tagName === 'INPUT' && /^(text|search|url|tel|password)$/i.test(el.type));

  // 1. Selection inside an <input> or <textarea>: replace it where it is.
  if (isTextField && el.selectionStart !== el.selectionEnd) {
    const { selectionStart: start, selectionEnd: end } = el;
    const converted = convert(el.value.slice(start, end));
    // execCommand keeps native undo (Ctrl/Cmd+Z) and notifies frameworks like React.
    if (!document.execCommand('insertText', false, converted)) {
      el.setRangeText(converted, start, end, 'end');
      el.dispatchEvent(new Event('input', { bubbles: true }));
    }
    return;
  }

  const sel = window.getSelection();
  const text = sel?.toString() ?? '';
  if (!text) return;
  const converted = convert(text);

  // 2. Selection inside a contenteditable element (Gmail, Docs-like editors): replace it there.
  const anchor = sel.anchorNode?.nodeType === Node.ELEMENT_NODE ? sel.anchorNode : sel.anchorNode?.parentElement;
  if (anchor?.isContentEditable && document.execCommand('insertText', false, converted)) return;

  // 3. Read-only page text: copy the result and show it in a toast.
  let copied = false;
  try {
    await navigator.clipboard.writeText(converted);
    copied = true;
  } catch {
    // The page may not have focus or may block clipboard access. The toast still shows the text.
  }

  document.getElementById('__hebrew-layout-toast')?.remove();
  const host = document.createElement('div');
  host.id = '__hebrew-layout-toast';
  const root = host.attachShadow({ mode: 'closed' });
  root.innerHTML = `
    <style>
      .t { position: fixed; z-index: 2147483647; bottom: 24px; right: 24px; max-width: min(480px, 90vw);
           background: #1f2937; color: #f9fafb; border-radius: 10px; padding: 12px 16px;
           font: 15px/1.5 system-ui, sans-serif; box-shadow: 0 8px 24px rgba(0,0,0,.3); cursor: pointer; }
      .s { font-size: 12px; opacity: .7; margin-bottom: 4px; }
      .x { direction: rtl; text-align: right; white-space: pre-wrap; word-break: break-word;
           user-select: text; max-height: 40vh; overflow: auto; }
    </style>
    <div class="t" title="Click to dismiss">
      <div class="s"></div>
      <div class="x"></div>
    </div>`;
  root.querySelector('.s').textContent = copied ? 'Copied to clipboard ✓' : 'Converted (copy it manually):';
  root.querySelector('.x').textContent = converted;
  root.querySelector('.t').addEventListener('click', () => host.remove());
  document.documentElement.appendChild(host);
  setTimeout(() => host.remove(), copied ? 5000 : 15000);
}
