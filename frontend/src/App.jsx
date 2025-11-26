import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import QuizPage from './pages/QuizPage';
import DashboardPage from './pages/DashboardPage';
import TodoList from './pages/TodoList';
import TypingTest from './pages/TypingTest';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/todo" element={<TodoList />} />
        <Route path="/typing-test" element={<TypingTest />} />
      </Routes>
    </Router>
  );
}

export default App;
