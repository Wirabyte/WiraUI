/** `(onSelect)`: the files just added (`files`, only the ones that passed the checks) and all files now chosen. */
export interface WuFileSelectEvent {
  originalEvent: Event;
  files: File[];
  currentFiles: File[];
}

/** `(uploadHandler)` with `[customUpload]="true"`: the app sends the files itself. */
export interface WuFileUploadHandlerEvent {
  files: File[];
}

export interface WuFileRemoveEvent {
  originalEvent: Event;
  file: File;
}

/** `(onUpload)`: the request finished with a 2xx status. */
export interface WuFileUploadEvent {
  originalEvent: Event | XMLHttpRequest;
  files: File[];
}

export interface WuFileUploadErrorEvent {
  xhr: XMLHttpRequest;
  files: File[];
}

export interface WuFileBeforeUploadEvent {
  formData: FormData;
}

export interface WuFileSendEvent {
  xhr: XMLHttpRequest;
  formData: FormData;
}

export interface WuFileProgressEvent {
  originalEvent: ProgressEvent;
  progress: number;
}

/** `(onValidationFail)`: a file the component turned away, why, and the message it showed. */
export interface WuFileValidationFailEvent {
  file: File | null;
  reason: 'type' | 'size' | 'limit';
  message: string;
}

/** Context of the `content` template: the chosen files and callbacks to act on them. */
export interface WuFileUploadContentContext {
  $implicit: File[];
  files: File[];
  uploadedFiles: File[];
  chooseCallback: () => void;
  clearCallback: () => void;
  uploadCallback: () => void;
  removeFileCallback: (event: Event, index: number) => void;
  removeUploadedFileCallback: (index: number) => void;
  progress: number;
  messages: string[];
}

export type WuFileUploadMode = 'advanced' | 'basic';
