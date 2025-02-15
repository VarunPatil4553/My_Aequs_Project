import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import store from './store.ts';
import { Provider } from 'react-redux';
import AuthContextProvider from './AuthContext/AuthContextProvider.tsx';

createRoot(document.getElementById('root')!).render(
  <AuthContextProvider>
    <Provider store={store}>
      <App />
    </Provider>
  </AuthContextProvider>
);
