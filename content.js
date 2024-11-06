// Контентный скрипт отвечает за выполнение записи и сохранение файлов на основе списка видео.
let recordingElements = {};

chrome.storage.local.get('videoResults', (data) => {
  const videoList = data.videoResults || [];
  const container = document.getElementById('videoList');

  videoList.forEach(video => {
    const item = document.createElement('div');
    item.className = 'video-item';
    item.textContent = video.label;

    const recordButton = document.createElement('button');
    recordButton.className = 'record-button';
    recordButton.textContent = 'Start Recording';
    recordButton.onclick = () => toggleRecording(video.index, video.label);

    item.appendChild(recordButton);
    container.appendChild(item);
  });
});

function toggleRecording(index, baseFileName) {
  const videoElement = document.querySelectorAll('video')[index];
  if (!videoElement) return alert('Видео не найдено');

  if (!recordingElements[index]) {
    const stream = videoElement.captureStream();
    const mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
    let recordedChunks = [];

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) recordedChunks.push(event.data);
    };

    mediaRecorder.onstop = () => saveRecording(recordedChunks, baseFileName);

    mediaRecorder.start();
    recordingElements[index] = { mediaRecorder, recordedChunks };
    alert('Запись начата');
  } else {
    const { mediaRecorder } = recordingElements[index];
    mediaRecorder.stop();
    delete recordingElements[index];
    alert('Запись остановлена');
  }
}

function saveRecording(chunks, baseFileName) {
  const blob = new Blob(chunks, { type: 'video/webm' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${baseFileName}.webm`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
