const { move, transferableSymbol, valueSymbol } = require('piscina');
const sharp = require('sharp');

module.exports = async (msg) => {

  const [width, height] = msg.dimensions;

  const pipeline = sharp(
    Buffer.from(msg.imageBuf)
  )
  .rotate()
  .resize(width, height)
  .jpeg({
    quality: 50,
    progressive: true,
    force: true,
  });

  const outputBuffer = await pipeline.toBuffer();

  const obj = {
    imageBuf: outputBuffer,
    get [transferableSymbol]() {
      return [this.imageBuf.buffer];
    },
    get [valueSymbol]() {
      return { imageBuf: this.imageBuf };
    }
  };

  return move(obj);
};
