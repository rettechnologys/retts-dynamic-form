import type { StyleValue } from 'vue';

export interface SignaturePadProps {
  options?: SignaturePadOptions;
  style?: StyleValue;
  class?: string | string[];
  disabled?: boolean;
  hideSaveButton?: boolean;
}
export interface SignaturePadOptions {
  dotSize?: number;
  minWidth?: number;
  maxWidth?: number;
  throttle?: number;
  backgroundColor?: string;
  minDistance?: number;
  velocityFilterWeight?: number;
  canvasContextOptions?: CanvasRenderingContext2DSettings;
  toBlob?: boolean;
  saveAs?: 'base64' | 'file' | 'blob';
}
