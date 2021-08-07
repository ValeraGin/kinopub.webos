import castArray from 'lodash/castArray';

export const KeyboardCodes = {
  Enter: 13,
  Play: [71, 415],
  Pause: [19, 74, 413],
  PlayPause: [32, 179],
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

export type KeyboardCodesKeys = keyof typeof KeyboardCodes;

export function isKey(e: KeyboardEvent, key: KeyboardCodesKeys | KeyboardCodesKeys[]) {
  const keys = castArray(key);
  const keyCode = e.keyCode || e.which;

  return keys.some((key) => e.key === key || castArray(KeyboardCodes[key]).some((code) => keyCode === code));
}

export function isBackButton(e: KeyboardEvent): boolean {
  return isKey(e, ['Back', 'Backspace', 'Escape']);
}

export type ButtonClickHandler = (e: KeyboardEvent) => void | boolean | Promise<void> | Promise<boolean>;

let BUTTON_HANDLERS: {
  key: KeyboardCodesKeys | KeyboardCodesKeys[];
  handler: ButtonClickHandler;
}[];

function listenButton() {
  window.addEventListener('keydown', async (e: KeyboardEvent) => {
    let isBack = false;
    if (isBackButton(e)) {
      isBack = true;
      e.preventDefault();
      e.stopPropagation();
    }

    for (let { key, handler } of BUTTON_HANDLERS) {
      if ((key === 'Back' && isBack) || isKey(e, key)) {
        const result = await handler(e);

        if (result === false) {
          break;
        }
      }
    }
  });
}

export function registerButtonHandler(key: KeyboardCodesKeys | KeyboardCodesKeys[], handler: ButtonClickHandler) {
  if (!BUTTON_HANDLERS) {
    BUTTON_HANDLERS = [];

    listenButton();
  }

  BUTTON_HANDLERS = [{ key, handler }, ...BUTTON_HANDLERS];

  return () => {
    BUTTON_HANDLERS = BUTTON_HANDLERS.filter((h) => h.handler !== handler);
  };
}
