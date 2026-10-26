import { InjectionToken, Provider } from '@angular/core';
import type { CropDimensions, CropperPosition, CropperTool, CropperToolbar } from 'wiratheme/core';

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

/** A built-in toolbar button, or `'zoom'` / `'rotate'` / `'flip'` for its whole group. */
export type WtImageCropperTool = CropperTool;
/**
 * The toolbar's built-in buttons: `'full'` (default), `'none'`, or a list such as `['zoom', '|', 'rotateLeft', 'reset']`
 * where `'|'` starts a new group. Without `'|'` the zoom tools make one group and the rest another.
 */
export type WtImageCropperToolbar = CropperToolbar;

/**
 * App-wide defaults for every wt-imagecropper: `provideImageCropperOptions({ output: 'base64', format: 'jpeg' })`.
 * An input set on the component wins.
 */
export interface WtImageCropperOptions {
  /** `'blob'` (default) or `'base64'`. */
  output?: 'blob' | 'base64';
  /** Default `'png'`. */
  format?: WtImageCropperFormat;
  /** 0–100, for jpeg and webp. Default 92. */
  imageQuality?: number;
  /** Default `'full'`. */
  toolbar?: WtImageCropperToolbar;
  /** Default 10. */
  maxZoom?: number;
}

export const WT_IMAGE_CROPPER_OPTIONS = new InjectionToken<WtImageCropperOptions>('WT_IMAGE_CROPPER_OPTIONS');

export function provideImageCropperOptions(options: WtImageCropperOptions): Provider {
  return { provide: WT_IMAGE_CROPPER_OPTIONS, useValue: options };
}

// The names apps already use for these types, so moving over only changes the import path.
export type ImageCroppedEvent = WtImageCroppedEvent;
export type ImageTransform = WtImageTransform;
export type LoadedImage = WtLoadedImage;
export type Dimensions = CropDimensions;
export type OutputFormat = WtImageCropperFormat;
