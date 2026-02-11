"use client";

import { createContext, use, useCallback, useEffect, useReducer } from "react";

import { useMotionInView } from "@/hooks/use-motion-in-view";
import {
  initialVideoPlayerState,
  videoPlayerReducer,
} from "@/reducers/video-player.reducer";

interface VideoPlayerContextValue {
  state: VideoPlayerState;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  inView: boolean;
  togglePlay: () => void;
  handleSeek: (time: number) => void;
  toggleMute: () => void;
  handleVolumeChange: (delta: number) => void;
  handleVolumeSet: (volume: number) => void;
}

const VideoPlayerContext = createContext<VideoPlayerContextValue | null>(null);

export function useVideoPlayer() {
  const context = use(VideoPlayerContext);
  if (!context) {
    throw new Error("useVideoPlayer must be used within a VideoPlayer.Root");
  }
  return context;
}

interface VideoPlayerProviderProps {
  children: React.ReactNode;
}

export function VideoPlayerProvider({ children }: VideoPlayerProviderProps) {
  const [state, dispatch] = useReducer(
    videoPlayerReducer,
    initialVideoPlayerState,
  );

  const [videoRef, inView] = useMotionInView<HTMLVideoElement>({
    once: true,
    amount: 1,
  });

  // Sync play, volume, and mute state to video element in a single effect
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (state.playing) {
      video.play();
    } else {
      video.pause();
    }

    video.volume = state.volume;
    video.muted = state.muted;
  }, [state.playing, state.volume, state.muted]);

  // Sync user seek to video element — only fires when seekVersion increments
  useEffect(() => {
    const video = videoRef.current;
    if (!video || state.seekVersion === 0) return;

    video.currentTime = state.currentTime;
  }, [state.seekVersion]);

  // Listen to video events and sync back to state (with throttled timeupdate)
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let lastDisplayedSecond = -1;

    const handleTimeUpdate = () => {
      const currentSecond = Math.floor(video.currentTime);

      if (currentSecond !== lastDisplayedSecond) {
        lastDisplayedSecond = currentSecond;
        dispatch({ type: "SET_CURRENT_TIME", time: video.currentTime });
      }
    };

    const handleLoadedMetadata = () => {
      dispatch({ type: "SET_DURATION", duration: video.duration });
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("loadedmetadata", handleLoadedMetadata);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, []);

  // Auto-play when video enters viewport
  useEffect(() => {
    if (inView && videoRef.current) dispatch({ type: "PLAY" });
  }, [inView]);

  const togglePlay = useCallback(() => dispatch({ type: "TOGGLE_PLAY" }), []);

  const handleSeek = useCallback(
    (time: number) => dispatch({ type: "SEEK", time }),
    [],
  );

  const toggleMute = useCallback(() => dispatch({ type: "TOGGLE_MUTE" }), []);

  const handleVolumeChange = useCallback(
    (delta: number) => dispatch({ type: "CHANGE_VOLUME", delta }),
    [],
  );

  const handleVolumeSet = useCallback(
    (volume: number) => dispatch({ type: "SET_VOLUME", volume }),
    [],
  );

  return (
    <VideoPlayerContext
      value={{
        state,
        videoRef,
        inView,
        togglePlay,
        handleSeek,
        toggleMute,
        handleVolumeChange,
        handleVolumeSet,
      }}
    >
      {children}
    </VideoPlayerContext>
  );
}
