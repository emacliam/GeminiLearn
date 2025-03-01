import { NativeModules, NativeEventEmitter, Platform } from "react-native";
import invariant from "invariant";
import {
  VoiceModule,
  SpeechEvents,
  TranscriptionEvents,
  TranscriptionEndEvent,
  TranscriptionErrorEvent,
  TranscriptionStartEvent,
  SpeechRecognizedEvent,
  SpeechErrorEvent,
  SpeechResultsEvent,
  SpeechStartEvent,
  SpeechEndEvent,
  SpeechVolumeChangeEvent,
  TranscriptionResultsEvent,
} from "./VoiceModuleTypes";

const Voice = NativeModules.Voice as VoiceModule;

const voiceEmitter =
  Platform.OS !== "web" ? new NativeEventEmitter(Voice) : null;
type SpeechEvent = keyof SpeechEvents;
type TranscriptionEvent = keyof TranscriptionEvents;

class RCTVoice {
  _loaded: boolean;
  _listeners: any[] | null;
  _events: Required<SpeechEvents> & Required<TranscriptionEvents>;

  constructor() {
    this._loaded = false;
    this._listeners = null;
    this._events = {
      onSpeechStart: () => {},
      onSpeechRecognized: () => {},
      onSpeechEnd: () => {},
      onSpeechError: () => {},
      onSpeechResults: () => {},
      onSpeechPartialResults: () => {},
      onSpeechVolumeChanged: () => {},
      onTranscriptionStart: () => {},
      onTranscriptionEnd: () => {},
      onTranscriptionError: () => {},
      onTranscriptionResults: () => {},
    };
  }

  removeAllListeners() {
    Voice.onSpeechStart = undefined;
    Voice.onSpeechRecognized = undefined;
    Voice.onSpeechEnd = undefined;
    Voice.onSpeechError = undefined;
    Voice.onSpeechResults = undefined;
    Voice.onSpeechPartialResults = undefined;
    Voice.onSpeechVolumeChanged = undefined;
    Voice.onTranscriptionStart = undefined;
    Voice.onTranscriptionEnd = undefined;
    Voice.onTranscriptionError = undefined;
    Voice.onTranscriptionResults = undefined;
  }

  destroy() {
    if (!this._loaded && !this._listeners) {
      return Promise.resolve();
    }
    return new Promise((resolve, reject) => {
      Voice.destroySpeech((error: string) => {
        if (error) {
          reject(new Error(error));
        } else {
          if (this._listeners) {
            this._listeners.map((listener) => listener.remove());
            this._listeners = null;
          }
          resolve();
        }
      });
    });
  }
  destroyTranscription() {
    if (!this._loaded && !this._listeners) {
      return Promise.resolve();
    }
    return new Promise<void>((resolve, reject) => {
      Voice.destroyTranscription((error: string) => {
        if (error) {
          reject(new Error(error));
        } else {
          if (this._listeners) {
            this._listeners.map((listener) => listener.remove());
            this._listeners = null;
          }
          resolve();
        }
      });
    });
  }

  start(locale: any, options = {}) {
    if (!this._loaded && !this._listeners && voiceEmitter !== null) {
      this._listeners = (Object.keys(this._events) as SpeechEvent[]).map(
        (key: SpeechEvent) => voiceEmitter.addListener(key, this._events[key])
      );
    }

    return new Promise((resolve, reject) => {
      const callback = (error: string) => {
        if (error) {
          reject(new Error(error));
        } else {
          resolve();
        }
      };
      if (Platform.OS === "android") {
        Voice.startSpeech(
          locale,
          Object.assign(
            {
              EXTRA_LANGUAGE_MODEL: "LANGUAGE_MODEL_FREE_FORM",
              EXTRA_MAX_RESULTS: 5,
              EXTRA_PARTIAL_RESULTS: true,
              REQUEST_PERMISSIONS_AUTO: true,
            },
            options
          ),
          callback
        );
      } else {
        Voice.startSpeech(locale, callback);
      }
    });
  }
  startTranscription(url: any, locale: any, options = {}) {
    if (!this._loaded && !this._listeners && voiceEmitter !== null) {
      this._listeners = (Object.keys(this._events) as TranscriptionEvent[]).map(
        (key: TranscriptionEvent) =>
          voiceEmitter.addListener(key, this._events[key])
      );
    }

    return new Promise<void>((resolve, reject) => {
      const callback = (error: string) => {
        if (error) {
          reject(new Error(error));
        } else {
          resolve();
        }
      };
      if (Platform.OS === "android") {
        Voice.startTranscription(
          url,
          locale,
          Object.assign(
            {
              EXTRA_LANGUAGE_MODEL: "LANGUAGE_MODEL_FREE_FORM",
              EXTRA_MAX_RESULTS: 5,
              EXTRA_PARTIAL_RESULTS: true,
              REQUEST_PERMISSIONS_AUTO: true,
            },
            options
          ),
          callback
        );
      } else {
        Voice.startTranscription(url, locale, callback);
      }
    });
  }
  stop() {
    if (!this._loaded && !this._listeners) {
      return Promise.resolve();
    }
    return new Promise((resolve, reject) => {
      Voice.stopSpeech((error) => {
        if (error) {
          reject(new Error(error));
        } else {
          resolve();
        }
      });
    });
  }
  stopTranscription() {
    if (!this._loaded && !this._listeners) {
      return Promise.resolve();
    }
    return new Promise<void>((resolve, reject) => {
      Voice.stopTranscription((error) => {
        if (error) {
          reject(new Error(error));
        } else {
          resolve();
        }
      });
    });
  }
  cancel() {
    if (!this._loaded && !this._listeners) {
      return Promise.resolve();
    }
    return new Promise((resolve, reject) => {
      Voice.cancelSpeech((error) => {
        if (error) {
          reject(new Error(error));
        } else {
          resolve();
        }
      });
    });
  }
  cancelTranscription() {
    if (!this._loaded && !this._listeners) {
      return Promise.resolve();
    }
    return new Promise<void>((resolve, reject) => {
      Voice.cancelSpeech((error) => {
        if (error) {
          reject(new Error(error));
        } else {
          resolve();
        }
      });
    });
  }
  isAvailable(): Promise<0 | 1> {
    return new Promise((resolve, reject) => {
      Voice.isSpeechAvailable((isAvailable: 0 | 1, error: string) => {
        if (error) {
          reject(new Error(error));
        } else {
          resolve(isAvailable);
        }
      });
    });
  }

  /**
   * (Android) Get a list of the speech recognition engines available on the device
   * */
  getSpeechRecognitionServices() {
    if (Platform.OS !== "android") {
      invariant(
        Voice,
        "Speech recognition services can be queried for only on Android"
      );
      return;
    }

    return Voice.getSpeechRecognitionServices();
  }

  isRecognizing(): Promise<0 | 1> {
    return new Promise((resolve) => {
      Voice.isRecognizing((isRecognizing: 0 | 1) => resolve(isRecognizing));
    });
  }

  set onSpeechStart(fn: (e: SpeechStartEvent) => void) {
    this._events.onSpeechStart = fn;
  }

  set onTranscriptionStart(fn: (e: TranscriptionStartEvent) => void) {
    this._events.onTranscriptionStart = fn;
  }

  set onSpeechRecognized(fn: (e: SpeechRecognizedEvent) => void) {
    this._events.onSpeechRecognized = fn;
  }

  set onSpeechEnd(fn: (e: SpeechEndEvent) => void) {
    this._events.onSpeechEnd = fn;
  }

  set onTranscriptionEnd(fn: (e: SpeechEndEvent) => void) {
    this._events.onTranscriptionEnd = fn;
  }
  set onSpeechError(fn: (e: SpeechErrorEvent) => void) {
    this._events.onSpeechError = fn;
  }

  set onTranscriptionError(fn: (e: TranscriptionErrorEvent) => void) {
    this._events.onTranscriptionError = fn;
  }

  set onSpeechResults(fn: (e: SpeechResultsEvent) => void) {
    this._events.onSpeechResults = fn;
  }

  set onTranscriptionResults(fn: (e: TranscriptionResultsEvent) => void) {
    this._events.onTranscriptionResults = fn;
  }

  set onSpeechPartialResults(fn: (e: SpeechResultsEvent) => void) {
    this._events.onSpeechPartialResults = fn;
  }
  set onSpeechVolumeChanged(fn: (e: SpeechVolumeChangeEvent) => void) {
    this._events.onSpeechVolumeChanged = fn;
  }
}

export {
  SpeechEndEvent,
  SpeechErrorEvent,
  SpeechEvents,
  SpeechStartEvent,
  SpeechRecognizedEvent,
  SpeechResultsEvent,
  SpeechVolumeChangeEvent,
  TranscriptionEndEvent,
  TranscriptionErrorEvent,
  TranscriptionEvents,
  TranscriptionStartEvent,
  TranscriptionResultsEvent,
};
export default RCTVoice;
