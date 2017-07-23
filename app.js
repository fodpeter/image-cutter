const pageCount = 3;
const blockCount = 20;

$(document).ready(function () {
  $('#printBtn').prop('disabled', true);
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
          $('#printBtn').prop('disabled', false);
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
      .attr("height", canvasSize[1])
      .addClass('max-size-100perc');
    const div = $('<div/>')
      .addClass('pagebreak')
      .addClass('borderaround')
      .addClass('fit-screen')
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
  const canvasSize = [img.naturalWidth, img.naturalHeight];
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
