import { Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Analysis from './pages/Analysis';
import JudgeDemo from './pages/JudgeDemo';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/analyze" element={<Analysis />} />
      <Route path="/analyze/:scenarioId" element={<Analysis />} />
      <Route path="/judge-demo" element={<JudgeDemo />} />
    </Routes>
  );
}
