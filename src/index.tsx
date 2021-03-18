import { render } from 'react-dom';

import App from './App';

const app = <App />;

// In a browser environment, render instead of exporting
if (typeof window !== 'undefined') {
  render(app, document.getElementById('root'));
}

export default app;
