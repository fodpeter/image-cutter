const pageCount = 3;
const size = [800, 600]
const blockSize = 20;

$(document).ready(function () {
  console.log('loaded');
});

function readURL(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();

    reader.onload = function (e) {
        const img = $('#imgId');
        img.attr('src', e.target.result)
          .width(150)
          .height(200);
        img[0].onload = function () {
          URL.revokeObjectURL(img.src)
          drawImageToCanvases(img);
        };
    };

    reader.readAsDataURL(input.files[0]);
  }
}

function createCanvasList(baseSelector, pageCount) {
  let canvasList = [];
  const pages = $(baseSelector).empty();
  for (let i=0;i<pageCount;i++) {
    const canvas = $('<canvas></canvas>')
      .attr("id", "canvas"+i)
      .attr("width", size[0])
      .attr("height",size[1]);
    const div = $('<div/>')
      .addClass('pagebreak')
      .addClass('borderaround')
      .append(canvas)
    pages.append(div);
    canvasList.push(canvas);
  }
  return canvasList;
}

function copyToCanvas(image, canvas) {
  const context = canvas[0].getContext('2d');
  context.drawImage(image[0], 0, 0, size[0], size[1]);
}

function drawImageToCanvases(img) {
  const canvases = createCanvasList('#pages', pageCount);
  for (let i=0;i<pageCount;i++) {
    copyToCanvas(img, canvases[i]);
  }
  drawMaskBoxes(canvases);
}

// The maximum is exclusive and the minimum is inclusive
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function drawMaskBoxes(canvases) {
  const contexts = canvases.map((canvas) => canvas[0].getContext('2d'));
  for (let xi=0;xi<size[0]/blockSize;xi++) {
    for (let yi=0;yi<size[1]/blockSize;yi++) {
      const visibleOnPage = getRandomInt(0, pageCount);
      for (let pi=0;pi<pageCount;pi++) {
        if (pi !== visibleOnPage) {
          const context = contexts[pi];
          context.fillStyle = 'white';
          context.fillRect(xi*blockSize, yi*blockSize, blockSize, blockSize);
        }
      }
    }
  }
}
