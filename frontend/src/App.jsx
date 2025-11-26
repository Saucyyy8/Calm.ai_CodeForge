import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import RainyHomePage from './pages/RainyHomePage';
import QuizPage from './pages/QuizPage';
import DashboardPage from './pages/DashboardPage';
import MusicPage from './pages/MusicPage';
import BookPage from './pages/BookPage';
import TodoList from './pages/TodoList';
import TypingTest from './pages/TypingTest';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RainyHomePage />} />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/music" element={<MusicPage />} />
        <Route path="/book" element={<BookPage />} />
        <Route path="/todo" element={<TodoList />} />
        <Route path="/typing-test" element={<TypingTest />} />
      </Routes>
    </Router>
  );
}

export default App;
