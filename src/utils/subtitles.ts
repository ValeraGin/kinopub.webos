class WebVTTConverter {
  resource: Blob;

  private objectURL?: string;

  constructor(resource: Blob) {
    this.resource = resource;
  }

  blobToBuffer() {
    return new Promise<ArrayBuffer>((resolve, reject) => {
      const reader = new FileReader();
      reader.addEventListener('loadend', (event) => {
        const buf = event.target.result;
        resolve(new Uint8Array(buf as ArrayBuffer));
      });
      reader.addEventListener('error', () => reject('Error while reading the Blob object'));
      reader.readAsArrayBuffer(this.resource);
    });
  }

  static blobToString(blob: Blob, success: (text: string) => void, fail: () => void) {
    const reader = new FileReader();
    reader.addEventListener('loadend', (event) => {
      const text = event.target.result;
      success(text as string);
    });
    reader.addEventListener('error', () => fail());
    reader.readAsText(blob);
  }

  /**
   * @param {*} utf8str
   */
  static toVTT(utf8str: string) {
    return utf8str
      .replace(/\{\\([ibu])\}/g, '</$1>')
      .replace(/\{\\([ibu])1\}/g, '<$1>')
      .replace(/\{([ibu])\}/g, '<$1>')
      .replace(/\{\/([ibu])\}/g, '</$1>')
      .replace(/(\d\d:\d\d:\d\d),(\d\d\d)/g, '$1.$2')
      .concat('\r\n\r\n');
  }

  static toTypedArray(str: string) {
    const result = [];
    str.split('').forEach((each) => {
      result.push(parseInt(`${each.charCodeAt(0)}`, 16));
    });
    return Uint8Array.from(result);
  }

  getURL() {
    return new Promise<string>((resolve, reject) => {
      if (!(this.resource instanceof Blob)) return reject('Expecting resource to be a Blob but something else found.');
      if (!FileReader) return reject('No FileReader constructor found');
      if (!TextDecoder) return reject('No TextDecoder constructor found');
      return WebVTTConverter.blobToString(
        this.resource,
        (decoded) => {
          const vttString = 'WEBVTT FILE\r\n\r\n';
          const text = vttString.concat(WebVTTConverter.toVTT(decoded));
          const blob = new Blob([text], { type: 'text/vtt' });
          this.objectURL = URL.createObjectURL(blob);

          return resolve(this.objectURL);
        },
        () => {
          this.blobToBuffer().then((buffer) => {
            const utf8str = new TextDecoder('utf-8').decode(buffer);
            const vttString = 'WEBVTT FILE\r\n\r\n';
            const text = vttString.concat(WebVTTConverter.toVTT(utf8str));
            const blob = new Blob([text], { type: 'text/vtt' });
            this.objectURL = URL.createObjectURL(blob);

            return resolve(this.objectURL);
          });
        },
      );
    });
  }

  release() {
    URL.createObjectURL(this.objectURL);
  }
}

export async function convertToVTT(src: string) {
  const file = await (await fetch(src)).blob();
  const converter = new WebVTTConverter(file);

  return converter.getURL();
}
