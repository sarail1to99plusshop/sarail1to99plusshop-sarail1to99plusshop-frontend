import { BrowserRouter } from 'react-router-dom';
import { ShopProvider } from './context/ShopContext';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <BrowserRouter>
      <ShopProvider>
        <AppRoutes />
      </ShopProvider>
    </BrowserRouter>
  );
}

export default App;
