type VideoMimeType =
  | "video/mp4"
  | "video/webm"
  | "video/ogg"
  | "video/quicktime";

interface VideoPlayerState {
  volume: number;
  muted: boolean;
  playing: boolean;
  currentTime: number; // in seconds
  duration: number; // in seconds
  seekVersion: number; // increments on user seek to distinguish from playback updates
}

type VideoPlayerAction =
  | { type: "PLAY" }
  | { type: "TOGGLE_PLAY" }
  | { type: "TOGGLE_MUTE" }
  | { type: "CHANGE_VOLUME"; delta: number }
  | { type: "SET_VOLUME"; volume: number }
  | { type: "SET_CURRENT_TIME"; time: number }
  | { type: "SET_DURATION"; duration: number }
  | { type: "SEEK"; time: number };

interface VolumeRangeProps {
  muted: boolean;
  volume: number;
  onToggleMute: () => void;
  onVolumeChange: (delta: number) => void;
  onVolumeSet: (volume: number) => void;
}

interface ControlButtonProps {
  onClick: () => void;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  className?: string;
  containerClassName?: string;
}
