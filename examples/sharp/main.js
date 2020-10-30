const path = require('path');
const fetch = require('node-fetch');
const fs = require('fs-jetpack');
const {
  Piscina,
  move,
  transferableSymbol,
  valueSymbol
} = require('piscina');

const piscina = new Piscina({
  filename: path.resolve(__dirname, 'worker.js')
});

const resize = async function(imageBuf, dimensions) {
  try {
    const msg = {
      dimensions,
      imageBuf: imageBuf,
      get [transferableSymbol]() {
        return [this.imageBuf.buffer];
      },
      get [valueSymbol]() {
        return {
          dimensions: this.dimensions,
          imageBuf: this.imageBuf
        };
      }
    };

    const result = await piscina.runTask(move(msg));

    await fs.writeAsync(
      path.resolve(__dirname, `out/${dimensions[0]}x${dimensions[1]}.png`),
      Buffer.from(result.imageBuf)
    );
  } catch (err) {
    console.error(err);
    await piscina.destroy();
    process.exit(1);
  }
};

(async function () {
  const inputImageUrl = 'https://bnetcmsus-a.akamaihd.net/cms/blog_header/k7/K7STT7XHX6Y71602545553273.jpg';
  const imageBuf = await fetch(inputImageUrl)
    .then(res => res.buffer());
  await Promise.all([
    resize(Buffer.from(imageBuf), [256, 144]),
    resize(Buffer.from(imageBuf), [426, 240]),
    resize(Buffer.from(imageBuf), [640, 360]),
    resize(Buffer.from(imageBuf), [768, 432]),
    resize(Buffer.from(imageBuf), [800, 450]),
    resize(Buffer.from(imageBuf), [848, 480]),
    resize(Buffer.from(imageBuf), [854, 480]),
    resize(Buffer.from(imageBuf), [960, 540]),
    resize(Buffer.from(imageBuf), [1024, 576]),
    resize(Buffer.from(imageBuf), [1280, 720]),
    resize(Buffer.from(imageBuf), [1366, 768]),
    resize(Buffer.from(imageBuf), [1600, 900]),
    resize(Buffer.from(imageBuf), [1920, 1080]),
    resize(Buffer.from(imageBuf), [2048, 1152]),
    resize(Buffer.from(imageBuf), [2560, 1440]),
    resize(Buffer.from(imageBuf), [2880, 1620]),
    resize(Buffer.from(imageBuf), [3200, 1800]),
    resize(Buffer.from(imageBuf), [3840, 2160]),
  ]);
  console.log('done processing...');
  console.log('cleaning up...');
  await piscina.destroy();
  console.log('exiting');
  process.exit(0);
})();