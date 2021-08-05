import castArray from 'lodash/castArray';

export const KeyboardCodes = {
  Enter: 13,
  Play: 415,
  Pause: 413,
  PlayPause: 179,
  Back: [461, 10009],
  Backspace: 8,
  Escape: 27,
  ArrowLeft: 37,
  ArrowUp: 38,
  ArrowRight: 39,
  ArrowDown: 40,
  Red: 403,
  Green: 404,
  Yellow: 405,
  Blue: 406,
  Settings: 10133,
} as const;

type KeyboardCodesKeys = keyof typeof KeyboardCodes;

export function isKey(e: KeyboardEvent, key: KeyboardCodesKeys) {
  const keyCode = e.keyCode || e.which;

  return e.key === key || castArray(KeyboardCodes[key]).some((code) => keyCode === code);
}

export function isBackButton(e: KeyboardEvent): boolean {
  return isKey(e, 'Back') || isKey(e, 'Escape') || isKey(e, 'Backspace');
}

export function isPlayButton(e: KeyboardEvent): boolean {
  return isKey(e, 'Play') || isKey(e, 'PlayPause');
}

export type ButtonClickHandler = (e: KeyboardEvent) => void | boolean | Promise<void> | Promise<boolean>;

let BACK_BUTTON_HANDLERS: ButtonClickHandler[];

function listenBackButton() {
  window.addEventListener('keydown', async (e: KeyboardEvent) => {
    if (isBackButton(e)) {
      e.preventDefault();
      e.stopPropagation();

      for (let handler of BACK_BUTTON_HANDLERS) {
        const result = await handler(e);

        if (result === false) {
          break;
        }
      }
    }
  });
}

export function registerBackButtonHandler(handler: ButtonClickHandler) {
  if (!BACK_BUTTON_HANDLERS) {
    BACK_BUTTON_HANDLERS = [];

    listenBackButton();
  }

  BACK_BUTTON_HANDLERS = [handler, ...BACK_BUTTON_HANDLERS];

  return () => {
    BACK_BUTTON_HANDLERS = BACK_BUTTON_HANDLERS.filter((h) => h !== handler);
  };
}
