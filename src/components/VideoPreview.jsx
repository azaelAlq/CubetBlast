// VideoPreview.jsx
import React from "react";

const VideoPreview = ({ url }) => {
  if (!url) return null; // Si no hay URL, no renderiza nada

  // Verifica si es una URL válida para video (opcional)
  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch (error) {
      return false;
    }
  };

  return (
    <div className="mt-1">
      <h3 className="text-lg font-medium text-center">Previsualización</h3>
      {isValidUrl(url) ? (
        <div className="mt-2 aspect-w-16 aspect-h-7">
          <video
            src={url}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-auto rounded"
          ></video>
        </div>
      ) : (
        <p className="text-red-500">URL no válida</p>
      )}
    </div>
  );
};

export default VideoPreview;
