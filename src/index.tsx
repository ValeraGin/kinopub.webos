import './polyfills';
import './plugins';

import { render } from 'react-dom';

import App from './App';
import reportWebVitals from './reportWebVitals';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

import { sendWebVitalsToGoogleAnalytics } from 'utils/analytics';

const app = <App />;

// In a browser environment, render instead of exporting
if (typeof window !== 'undefined') {
  render(app, document.getElementById('root'));
}

export default app;

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(sendWebVitalsToGoogleAnalytics);
