export enum KeyboardCodes {
  Play = 415,
  Back = 461,
}

export function isBackButton(e: KeyboardEvent): boolean {
  return e.keyCode === KeyboardCodes.Back || e.key === 'Backspace';
}

export function isPlayButton(e: KeyboardEvent): boolean {
  return e.keyCode === KeyboardCodes.Play;
}

export function isArrowUpButton(e: KeyboardEvent): boolean {
  return e.code === 'ArrowUp';
}
