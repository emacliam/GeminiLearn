import Voice, {
  SpeechErrorEvent,
  SpeechEvents,
  SpeechResultsEvent,
} from "@react-native-voice/voice";
import { useCallback, useEffect, useState } from "react";

interface IState {
  recognized: string;
  pitch: string;
  error: string;
  end: string;
  started: string;
  results: string[];
  partialResults: string[];
  isRecording: boolean;
}

export const useVoiceRecognition = () => {
  const [state, setState] = useState<IState>({
    recognized: "",
    pitch: "",
    error: "",
    end: "",
    started: "",
    results: [],
    partialResults: [],
    isRecording: false,
  });

  const resetState = useCallback(() => {
    setState({
      recognized: "",
      pitch: "",
      error: "",
      end: "",
      started: "",
      results: [],
      partialResults: [],
      isRecording: false,
    });
  }, [setState]);

  const startRecognizing = useCallback(async () => {
    resetState();
    try {
      await Voice.start("en-US");
    } catch (error) {
      console.log(error);
    }
  }, [resetState]);

  const stopRecognizing = useCallback(async () => {
    try {
      await Voice.stop();
    } catch (error) {
      console.log(error);
    }
  }, []);

  const cancelRecognizing = useCallback(async () => {
    try {
      await Voice.cancel();
    } catch (error) {
      console.log(error);
    }
  }, []);

  const destroyRecognizing = useCallback(async () => {
    try {
      await Voice.destroy();
    } catch (error) {
      console.log(error);
    }
    resetState();
  }, [resetState]);

  useEffect(() => {
    Voice.onSpeechStart = (e: any) => {
      setState((prevState) => ({
        ...prevState,
        started: "true",
        isRecording: true,
      }));
    };

    Voice.onSpeechEnd = (e: any) => {
      setState((prevState) => ({
        ...prevState,
        end: "true",
        isRecording: true,
      }));
    };

    Voice.onSpeechError = (e: SpeechErrorEvent) => {
      setState((prevState) => ({
        ...prevState,
        error: JSON.stringify(e.error),
        isRecording: false,
      }));
    };

    Voice.onSpeechResults = (e: SpeechResultsEvent) => {
      if (e.value) {
        setState((prevState) => ({ ...prevState, results: e.value! }));
      }
    };

    Voice.onSpeechPartialResults = (e: SpeechResultsEvent) => {
      if (e.value) {
        setState((prevState) => ({ ...prevState, partialResults: e.value! }));
      }
    };

    Voice.onSpeechVolumeChanged = (e: any) => {
      setState((prevState) => ({ ...prevState, pitch: e.value }));
    };
    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  return {
    state,
    setState,
    resetState,
    startRecognizing,
    stopRecognizing,
    cancelRecognizing,
    destroyRecognizing,
  };
};
