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

export type BackButtonHandler = () => void | boolean | Promise<void> | Promise<boolean>;

let BACK_BUTTON_HANDLERS: BackButtonHandler[];

function listenBackButton() {
  window.addEventListener('keydown', async (e: KeyboardEvent) => {
    if (isBackButton(e)) {
      for (let handler of BACK_BUTTON_HANDLERS) {
        const result = await handler();

        if (result === false) {
          break;
        }
      }
    }
  });
}

export function registerBackButtonHandler(handler: BackButtonHandler) {
  if (!BACK_BUTTON_HANDLERS) {
    BACK_BUTTON_HANDLERS = [];

    listenBackButton();
  }

  BACK_BUTTON_HANDLERS = [handler, ...BACK_BUTTON_HANDLERS];

  return () => {
    BACK_BUTTON_HANDLERS = BACK_BUTTON_HANDLERS.filter((h) => h !== handler);
  };
}
