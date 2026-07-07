import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Home from './pages/Home';
import Lesson from './pages/Lesson';
import Exam from './pages/Exam';
import MouseGlow from './components/MouseGlow';
import Branding from './components/Branding';

/**
 * App shell: ambient glow + persistent branding, with animated route
 * transitions. Routes mirror the app flow:
 *   Home → Lesson → Exam (question list) → Question dossier (modal)
 */
export default function App() {
  const location = useLocation();

  return (
    <>
      <MouseGlow />

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname.split('/').slice(0, 4).join('/')}>
          <Route path="/" element={<Home />} />
          <Route path="/lesson/:lessonId" element={<Lesson />} />
          {/* Both routes render the exam list; the /q/ variant also opens the modal. */}
          <Route path="/lesson/:lessonId/:examId" element={<Exam />} />
          <Route path="/lesson/:lessonId/:examId/q/:questionId" element={<Exam />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>

      <Branding />
    </>
  );
}
