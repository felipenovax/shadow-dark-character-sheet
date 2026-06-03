// libs
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// components
import { Provider } from '@/components/ui/provider';

// app
import { App } from '@/App';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Elemento root não encontrado no HTML.');
}

createRoot(rootElement).render(
  <StrictMode>
    <Provider>
      <App />
    </Provider>
  </StrictMode>,
);
