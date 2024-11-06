// Этот скрипт обрабатывает нажатие на кнопку Run Analysis, отправляет команду контентному скрипту для анализа видео на странице и отображает результаты.
document.getElementById('runAnalysis').addEventListener('click', () => {
  const className = document.getElementById('className').value;
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      func: analyzeVideos,
      args: [className]
    });
  });
});

function analyzeVideos(className) {
  const videos = document.querySelectorAll('video');
  const results = [];

  videos.forEach((video, index) => {
    let label = className ? video.closest(`.${className}`)?.textContent.trim() : `Video ${index + 1}`;
    results.push({ label, index });
    
    const wrapper = document.createElement('div');
    wrapper.style.border = '2px solid red';
    wrapper.style.position = 'relative';
    wrapper.style.display = 'inline-block';

    const labelElem = document.createElement('span');
    labelElem.textContent = label;
    labelElem.style.position = 'absolute';
    labelElem.style.top = '0';
    labelElem.style.left = '0';
    labelElem.style.backgroundColor = 'white';
    wrapper.appendChild(labelElem);

    video.parentNode.insertBefore(wrapper, video);
    wrapper.appendChild(video);
  });

  chrome.runtime.sendMessage({ type: 'displayResults', results });
}
