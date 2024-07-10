import RCTVoice, {
  SpeechErrorEvent,
  SpeechEvents,
  SpeechRecognizedEvent,
  SpeechResultsEvent,
} from "@/scripts/Voice";
import { useCallback, useEffect, useState } from "react";
const Voice = new RCTVoice();

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

  const startContinuousListening = async () => {
    try {
      await Voice.start("en-US");
    } catch (e) {
      console.error(e);
    }
  };

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
    console.log("speech canceled");
    try {
      await Voice.cancel();
    } catch (error) {
      console.log(error);
    }
  }, []);

  const destroyRecognizing = useCallback(async () => {
    console.log("speech destroyed");
    try {
      await Voice.destroy();
    } catch (error) {
      console.log(error);
    }
    resetState();
  }, [resetState]);

  useEffect(() => {
    Voice.onSpeechStart = (e: any) => {
      console.log("speech start");
      setState((prevState) => ({
        ...prevState,
        started: "true",
        isRecording: true,
      }));
    };

    Voice.onSpeechEnd = (e: any) => {
      setState((prevState) => ({
        ...prevState,
        end: "√",
        isRecording: false,
      }));
    };

    Voice.onSpeechError = (e: SpeechErrorEvent) => {
      console.log("speech error", e.error);
      setState((prevState) => ({
        ...prevState,
        error: JSON.stringify(e.error),
        isRecording: false,
      }));
    };

    Voice.onSpeechRecognized = (e: SpeechRecognizedEvent) => {
      setState((prevState) => ({ ...prevState, recognized: "√" }));
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
