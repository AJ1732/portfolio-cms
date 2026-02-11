export function videoPlayerReducer(
  state: VideoPlayerState,
  action: VideoPlayerAction,
): VideoPlayerState {
  switch (action.type) {
    case "PLAY":
      return { ...state, playing: true };
    case "TOGGLE_PLAY":
      return { ...state, playing: !state.playing };
    case "TOGGLE_MUTE":
      return { ...state, muted: !state.muted };
    case "CHANGE_VOLUME":
      return {
        ...state,
        volume: Math.max(0, Math.min(1, state.volume + action.delta)),
      };
    case "SET_VOLUME":
      return { ...state, volume: action.volume };
    case "SET_CURRENT_TIME":
      return { ...state, currentTime: action.time };
    case "SET_DURATION":
      return { ...state, duration: action.duration };
    case "SEEK":
      return {
        ...state,
        currentTime: action.time,
        seekVersion: state.seekVersion + 1,
      };
    default:
      return state;
  }
}

export const initialVideoPlayerState: VideoPlayerState = {
  volume: 1,
  muted: true,
  playing: false,
  currentTime: 0,
  duration: 0,
  seekVersion: 0,
};
