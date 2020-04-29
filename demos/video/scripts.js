const video = document.querySelector('video');
const progress = document.querySelector('.progress');
const playButton = document.querySelector('button.toggle');
const volumeButton = document.querySelector('button.volume');
const volumeSlider = document.querySelector('.player__slider');
const progressBar = document.querySelector('.progress__filled');
const speedButtons = document.querySelectorAll('button[data-speed]');
const skipButtons = document.querySelectorAll('button[data-skip]');

function togglePlay() {
  if (video.paused) {
    return video.play();
  }
  return video.pause();
}

function toggleButton() {
  const icon = video.paused ? '▶️' : '⏸';
  playButton.innerHTML = icon;
}

function updateProgress() {
  const currentTime = video.currentTime;
  const totalTime = video.duration;
  const percentage = (currentTime * 100) / totalTime;

  progressBar.style.flexBasis = `${percentage}%`;
}

function updateVolumeSlider() {
  video.volume = this.value;
  const icon = !parseFloat(this.value) ? '🔇' : '🔊';
  volumeButton.innerHTML = icon;
}

function updateSpeed() {
  const currentActive = document.querySelector('button[data-speed].active');
  currentActive.classList.remove('active');

  this.classList.add('active');
  const value = parseFloat(this.dataset.speed);
  video.playbackRate = value;
}

function updateSkip() {
  const value = parseInt(this.dataset.skip);
  video.currentTime += value;
}

function updateVideoTime(evt) {
  const currentValue = evt.offsetX;
  const totalValue = progress.clientWidth;
  const percentageValue = currentValue / totalValue;
  video.currentTime = percentageValue * video.duration;
  updateProgress();
}

video.addEventListener('click', togglePlay);
video.addEventListener('play', toggleButton);
video.addEventListener('pause', toggleButton);
video.addEventListener('timeupdate', updateProgress);

playButton.addEventListener('click', togglePlay);
volumeButton.addEventListener('click', () => {
  const value = volumeSlider.value === '0' ? '1' : '0';
  volumeSlider.value = value;
  updateVolumeSlider.call({ value });
});

volumeSlider.addEventListener('change', updateVolumeSlider);
volumeSlider.addEventListener('mousemove', updateVolumeSlider);

speedButtons.forEach((button) => button.addEventListener('click', updateSpeed));
skipButtons.forEach((button) => button.addEventListener('click', updateSkip));

let isMoving = false;
progress.addEventListener('mousedown', () => {
  progress.style.cursor = 'grabbing';
  isMoving = true;
});

progress.addEventListener('mouseup', () => {
  progress.style.cursor = 'grab';
  isMoving = false;
});

progress.addEventListener(
  'mousemove',
  (evt) => isMoving && updateVideoTime(evt),
);
progress.addEventListener('click', updateVideoTime);
