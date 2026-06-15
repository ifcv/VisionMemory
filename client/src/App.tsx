import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import UploadPage from './pages/UploadPage';
import HistoryPage from './pages/HistoryPage';
import MemoryPage from './pages/MemoryPage';
import { AppProvider } from './context/AppContext';

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="flex min-h-screen">
          <Sidebar />
          <div className="flex-1 flex flex-col h-screen overflow-y-auto">
            <main className="flex-1 px-10 py-10">
              <Routes>
                <Route path="/" element={<UploadPage />} />
                <Route path="/history" element={<HistoryPage />} />
                <Route path="/memory" element={<MemoryPage />} />
              </Routes>
            </main>
          </div>
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
