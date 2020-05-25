const strip = document.querySelector('.strip');
const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const takePhotoBtn = document.querySelector('#take-photo');
const funkyMeBtn = document.querySelector('#funky-me');

const ctx = canvas.getContext('2d');
let isFunky = false;

function getVideo() {
  navigator.mediaDevices
    .getUserMedia({ video: true, audio: false })
    .then((localMediaStream) => {
      video.srcObject = localMediaStream;
      video.play();
    })
    .catch((err) => console.error(err));
}

function funkyFilter(pixels) {
  for (let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i - 200] = pixels.data[i + 0];
    pixels.data[i + 150] = pixels.data[i + 1];
    pixels.data[i - 100] = pixels.data[i + 2];
  }
  return pixels;
}

function drawVideo() {
  const { videoHeight, videoWidth } = this;
  canvas.width = videoWidth;
  canvas.height = videoHeight;

  return setInterval(() => {
    ctx.drawImage(video, 0, 0, videoWidth, videoHeight);
    if (isFunky) {
      let pixels = funkyFilter(ctx.getImageData(0, 0, videoWidth, videoHeight));

      ctx.putImageData(pixels, 0, 0);
    }
  }, 10);
}

function takePhoto() {
  const imgData = canvas.toDataURL('image/jpeg');
  const link = document.createElement('a');

  link.href = imgData;
  link.setAttribute('download', 'funky-cam');
  link.innerHTML = `<img src=${imgData} alt="Photo"></img>`;

  if (strip.childElementCount === 5) {
    strip.removeChild(strip.lastChild);
  }

  strip.insertBefore(link, strip.firstChild);
}

function funkyMe() {
  isFunky = !isFunky;

  if (isFunky) {
    this.innerHTML = '🙅🏽‍♀️ Enough';
  } else {
    this.innerHTML = '🎊 Party Hard';
  }
}

getVideo();

funkyMeBtn.addEventListener('click', funkyMe);
takePhotoBtn.addEventListener('click', takePhoto);
video.addEventListener('canplay', drawVideo);
