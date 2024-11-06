// Этот скрипт обрабатывает сообщения от контентного скрипта и передает данные обратно в popup.js для отображения списка видео с кнопками записи.
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'displayResults') {
    chrome.storage.local.set({ videoResults: message.results });
  }
});
