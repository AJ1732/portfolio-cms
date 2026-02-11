import { PlayLine } from "./play-line";

interface PlayMinutesProps {
  currentTime: number; // in seconds
  duration: number; // in seconds
  onSeek?: (time: number) => void;
}

function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs.toString().padStart(2, "0")}`;
}

export function PlayMinutes({
  currentTime,
  duration,
  onSeek,
}: PlayMinutesProps) {
  const progress = duration > 0 ? currentTime / duration : 0;

  const handleProgressChange = (newProgress: number) => {
    if (onSeek && duration > 0) {
      const newTime = newProgress * duration;
      onSeek(newTime);
    }
  };

  return (
    <div className="text-sm-expand flex h-10 items-center gap-1 rounded-full bg-neutral-50 px-4 max-md:justify-center md:pr-2">
      <span>{formatTime(currentTime)}</span>
      <span className="-mt-0.5">|</span>
      <span>{formatTime(duration)}</span>

      <PlayLine
        progress={progress}
        onChange={handleProgressChange}
        className="ml-2 w-full flex-1 rounded-full bg-white"
      />
    </div>
  );
}
