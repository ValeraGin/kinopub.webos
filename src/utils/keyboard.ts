export enum KeyboardCodes {
  Enter = 13,
  Play = 415,
  Playpause = 179,
  Back = 461,
  Backspace = 8,
  Escape = 27,
  ArrowUp = 38,
}

export function isEnter(e: KeyboardEvent): boolean {
  return e.keyCode === KeyboardCodes.Enter || e.key === 'Enter';
}

export function isBackButton(e: KeyboardEvent): boolean {
  return e.keyCode === KeyboardCodes.Back || e.keyCode === KeyboardCodes.Backspace || e.key === 'Backspace';
}

export function isPlayButton(e: KeyboardEvent): boolean {
  return e.keyCode === KeyboardCodes.Play || e.keyCode === KeyboardCodes.Playpause;
}

export function isArrowUpButton(e: KeyboardEvent): boolean {
  return e.keyCode === KeyboardCodes.ArrowUp || e.code === 'ArrowUp';
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
