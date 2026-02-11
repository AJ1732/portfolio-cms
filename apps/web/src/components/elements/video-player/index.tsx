"use client";

import { PlayPauseIcon } from "@/assets/svgs";
import { getIconFillClasses } from "@/constants/video-player.constants";
import { cn } from "@/lib/utils";

import { ControlButton } from "./control-button";
import { PlayMinutes } from "./play-minutes";
import { useVideoPlayer, VideoPlayerProvider } from "./video-player-context";
import { VolumeRange } from "./volume-range";

// --- Compound sub-components ---

function Root({ children }: { children: React.ReactNode }) {
  return (
    <VideoPlayerProvider>
      <div className="space-y-3 md:space-y-4">{children}</div>
    </VideoPlayerProvider>
  );
}

interface DisplayProps {
  src: string;
  type?: VideoMimeType;
}

function Display({ src, type = "video/mp4" }: DisplayProps) {
  const { videoRef, inView, togglePlay } = useVideoPlayer();

  return (
    <figure
      onClick={togglePlay}
      className="aspect-video cursor-pointer overflow-hidden border bg-neutral-50"
    >
      <video
        ref={videoRef}
        loop
        playsInline
        preload={inView ? "auto" : "none"}
        className="h-auto w-full object-cover transition-all duration-300 ease-in-out"
      >
        {inView && <source src={src} type={type} />}
        Your browser does not support the video tag, <br /> But View the Project
        by clicking the title
      </video>
    </figure>
  );
}

function PlayButton() {
  const { state, togglePlay } = useVideoPlayer();

  return (
    <ControlButton
      icon={PlayPauseIcon}
      label={`${state.playing ? "Pause" : "Play"} video`}
      onClick={togglePlay}
      className={cn(getIconFillClasses("play"))}
      containerClassName="max-md:hidden"
    />
  );
}

function TimeDisplay() {
  const { state, handleSeek } = useVideoPlayer();

  return (
    <PlayMinutes
      currentTime={state.currentTime}
      duration={state.duration}
      onSeek={handleSeek}
    />
  );
}

function VolumeControl() {
  const { state, toggleMute, handleVolumeChange, handleVolumeSet } =
    useVideoPlayer();

  return (
    <VolumeRange
      muted={state.muted}
      volume={state.volume}
      onToggleMute={toggleMute}
      onVolumeChange={handleVolumeChange}
      onVolumeSet={handleVolumeSet}
    />
  );
}

function Controls({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex grid-cols-3 gap-3 overflow-hidden md:grid">
      {children}
    </div>
  );
}

// --- Convenience wrapper (preserves existing API) ---

interface VideoPlayerProps {
  src: string;
  type?: VideoMimeType;
  controls?: boolean;
}

export function VideoPlayer({ src, type, controls = true }: VideoPlayerProps) {
  return (
    <VideoPlayer.Root>
      <VideoPlayer.Display src={src} type={type} />
      {controls && (
        <VideoPlayer.Controls>
          <VideoPlayer.PlayButton />
          <VideoPlayer.TimeDisplay />
          <VideoPlayer.VolumeControl />
        </VideoPlayer.Controls>
      )}
    </VideoPlayer.Root>
  );
}

// Attach compound sub-components
VideoPlayer.Root = Root;
VideoPlayer.Display = Display;
VideoPlayer.PlayButton = PlayButton;
VideoPlayer.TimeDisplay = TimeDisplay;
VideoPlayer.VolumeControl = VolumeControl;
VideoPlayer.Controls = Controls;
