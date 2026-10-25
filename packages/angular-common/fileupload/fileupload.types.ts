/** `(onSelect)`: the files just added (`files`, only the ones that passed the checks) and all files now chosen. */
export interface WtFileSelectEvent {
  originalEvent: Event;
  files: File[];
  currentFiles: File[];
}

/** `(uploadHandler)` with `[customUpload]="true"`: the app sends the files itself. */
export interface WtFileUploadHandlerEvent {
  files: File[];
}

export interface WtFileRemoveEvent {
  originalEvent: Event;
  file: File;
}

/** `(onUpload)`: the request finished with a 2xx status. */
export interface WtFileUploadEvent {
  originalEvent: Event | XMLHttpRequest;
  files: File[];
}

export interface WtFileUploadErrorEvent {
  xhr: XMLHttpRequest;
  files: File[];
}

export interface WtFileBeforeUploadEvent {
  formData: FormData;
}

export interface WtFileSendEvent {
  xhr: XMLHttpRequest;
  formData: FormData;
}

export interface WtFileProgressEvent {
  originalEvent: ProgressEvent;
  progress: number;
}

/** `(onValidationFail)`: a file the component turned away, why, and the message it showed. */
export interface WtFileValidationFailEvent {
  file: File | null;
  reason: 'type' | 'size' | 'limit';
  message: string;
}

/** Context of the `content` template: the chosen files and callbacks to act on them. */
export interface WtFileUploadContentContext {
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

export type WtFileUploadMode = 'advanced' | 'basic';
