// Recorta una imagen (Blob/File) al centro, ajustándola a un ratio de aspecto exacto.
// Se usa para que el formato elegido en el paso 1 del modal de subida (vertical/cuadrado/horizontal)
// se refleje de verdad en la imagen guardada, no solo en la vista previa.
export function cropToAspect(blob, ratio) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(blob);

    img.onload = () => {
      const srcW = img.naturalWidth;
      const srcH = img.naturalHeight;
      const srcRatio = srcW / srcH;

      let cropW = srcW;
      let cropH = srcH;

      if (srcRatio > ratio) {
        // La imagen es más ancha que el objetivo: recortamos los lados.
        cropW = Math.round(srcH * ratio);
      } else {
        // La imagen es más alta que el objetivo: recortamos arriba/abajo.
        cropH = Math.round(srcW / ratio);
      }

      const offsetX = Math.round((srcW - cropW) / 2);
      const offsetY = Math.round((srcH - cropH) / 2);

      const canvas = document.createElement('canvas');
      canvas.width = cropW;
      canvas.height = cropH;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, offsetX, offsetY, cropW, cropH, 0, 0, cropW, cropH);

      canvas.toBlob(
        (result) => {
          URL.revokeObjectURL(url);
          if (!result) return reject(new Error('No se pudo recortar la imagen'));
          resolve(result);
        },
        'image/jpeg',
        0.92
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('No se pudo cargar la imagen para recortarla'));
    };

    img.src = url;
  });
}

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
