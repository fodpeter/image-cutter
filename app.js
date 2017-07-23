const pageCount = 3;
const blockCount = 20;
const maxCanvasSize = [800,600];

$(document).ready(function () {
  console.log('loaded');
});

function readURL(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();

    reader.onload = function (e) {
        const img = $('#imgId');
        img.attr('src', e.target.result);
        img[0].onload = function () {
          URL.revokeObjectURL(img.src)
          drawImageToCanvases(img[0]);
        };
    };

    reader.readAsDataURL(input.files[0]);
  }
}

function createCanvasList(baseSelector, canvasSize, pageCount) {
  let canvasList = [];
  const pages = $(baseSelector).empty();
  pages.append($('<h3>Print preview</h3>').addClass('no-print'))
  for (let i=0;i<pageCount;i++) {
    const canvas = $('<canvas></canvas>')
      .attr("id", "canvas"+i)
      .attr("width", canvasSize[0])
      .attr("height",canvasSize[1]);
    const div = $('<div/>')
      .addClass('pagebreak')
      .addClass('borderaround')
      .append(canvas)
    pages.append($('<div>')
      .addClass('no-print')
      .html('Page ' + (i+1) + ' of ' + pageCount)
    );
    pages.append(div);
    canvasList.push(canvas[0]);
  }
  return canvasList;
}

function drawImageToCanvases(img) {
  const scale = Math.min(1, maxCanvasSize[0]/img.naturalWidth, maxCanvasSize[1]/img.naturalHeight);
  const canvasSize = [img.naturalWidth*scale, img.naturalHeight*scale];
  const canvases = createCanvasList('#pages', canvasSize, pageCount);

  const contexts = canvases.map((canvas) => canvas.getContext('2d'));
  for (let xi=0;xi<blockCount;xi++) {
    for (let yi=0;yi<blockCount;yi++) {
      const visibleOnPage = getRandomInt(0, pageCount);
      const context = contexts[visibleOnPage];
      const sw = img.naturalWidth/blockCount;
      const sh = img.naturalHeight/blockCount;
      const dw = canvasSize[0]/blockCount;
      const dh = canvasSize[1]/blockCount;
      context.drawImage(img, xi*sw, yi*sh, sw, sh, xi*dw, yi*dh, dw, dh);
    }
  }
}

// The maximum is exclusive and the minimum is inclusive
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}
