export function gtag(...args: any[]) {
  // @ts-expect-error
  dataLayer?.push(args);
}
