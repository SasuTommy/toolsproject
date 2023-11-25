import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AppRoutes } from './routes/appRoutes';
import { Main } from './pages/Main';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={AppRoutes.MAIN} element={<Main />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
