# Hebrew Layout Fixer

A Chrome extension for text typed with the keyboard in the wrong layout. Select the text, right-click,
and choose **Convert to Hebrew keyboard (a → ש)**. Each English key is swapped for the Hebrew letter
on the same key (standard Israeli layout), so `akuo` becomes `שלום`.

- **In a text box, textarea or rich editor:** the selection is replaced where it is. Ctrl/Cmd+Z undoes it.
- **On normal page text:** the result is copied to the clipboard and shown in a small popup.

## Install (unpacked)

1. [Download the ZIP](https://github.com/issacfriedman/hebrew-layout-fixer/archive/refs/heads/main.zip) and unzip it.
2. Open `chrome://extensions` and turn on **Developer mode**.
3. Click **Load unpacked** and pick the unzipped `hebrew-layout-fixer-main` folder.

## Test

```bash
npm test
```
