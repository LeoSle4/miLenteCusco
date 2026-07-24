export const RATIOS = {
  vertical: 9 / 16,
  cuadrado: 1,
  horizontal: 16 / 9,
};

// Extrae el área seleccionada por el usuario en el cropper interactivo (react-easy-crop)
// y la exporta como Blob JPEG lista para guardar.
export function extraerRecorte(imageSrc, pixelCrop) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(pixelCrop.width);
      canvas.height = Math.round(pixelCrop.height);
      const ctx = canvas.getContext('2d');
      ctx.drawImage(
        img,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
      );
      canvas.toBlob(
        (result) => {
          if (!result) return reject(new Error('No se pudo recortar la imagen'));
          resolve(result);
        },
        'image/jpeg',
        0.92
      );
    };
    img.onerror = () => reject(new Error('No se pudo cargar la imagen para recortarla'));
    img.src = imageSrc;
  });
}
