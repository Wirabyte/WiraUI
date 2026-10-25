import type { CropDimensions, CropperPosition } from 'wiratheme/core';

export type { CropDimensions, CropperPosition } from 'wiratheme/core';

/** Image type of the result. Browsers encode png, jpeg and webp; the others come out as png. */
export type WtImageCropperFormat = 'png' | 'jpeg' | 'webp' | 'bmp' | 'ico';

/**
 * Zoom, turn and mirror: `scale` (1 = whole picture), `rotate` in degrees clockwise (quarter turns carry the crop box
 * along; other angles start it afresh), `flipH` / `flipV` mirror on screen. `translateH`, `translateV` and
 * `translateUnit` are accepted and ignored (drag outside the box to pan while zoomed in).
 */
export interface WtImageTransform {
  scale?: number;
  rotate?: number;
  flipH?: boolean;
  flipV?: boolean;
  translateH?: number;
  translateV?: number;
  translateUnit?: '%' | 'px';
}

/**
 * `(imageCropped)`: the cropped picture as a Blob plus an object URL (`output="blob"`, the default) or a data URL
 * (`output="base64"`), its size, where the box is on screen (`cropperPosition`, CSS pixels over the shown picture)
 * and in the picture (`imagePosition`, image pixels after turning).
 */
export interface WtImageCroppedEvent {
  base64?: string | null;
  blob?: Blob | null;
  objectUrl?: string | null;
  width: number;
  height: number;
  cropperPosition: CropperPosition;
  imagePosition: CropperPosition;
}

/**
 * `(imageLoaded)`: the picture's size as stored in the file (`original`) and upright (`transformed`, after the
 * camera's EXIF orientation), and what that orientation asked for.
 */
export interface WtLoadedImage {
  original: { size: CropDimensions };
  transformed: { size: CropDimensions };
  exifTransform: { rotate: number; flip: boolean };
}

// The names apps already use for these types, so moving over only changes the import path.
export type ImageCroppedEvent = WtImageCroppedEvent;
export type ImageTransform = WtImageTransform;
export type LoadedImage = WtLoadedImage;
export type Dimensions = CropDimensions;
export type OutputFormat = WtImageCropperFormat;
