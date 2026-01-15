import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login.tsx';
import Dashboard from './pages/Dashboard.tsx';
import Home from './pages/Home.tsx';
import Schedule from './pages/Schedule.tsx';
import Tafs from './pages/Tafs.tsx';
import Absences from './pages/Absences.tsx';
import Planning from './pages/Planning.tsx';
import Payments from './pages/Payments.tsx';
import Events from './pages/Events.tsx';
import PrivateRoute from './components/PrivateRoute.tsx';
import Layout from './components/Layout.tsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<PrivateRoute />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/home/:studentId" element={<Home />} />
            <Route path="/schedule/:studentId" element={<Schedule />} />
            <Route path="/tafs/:studentId" element={<Tafs />} />
            <Route path="/absences/:studentId" element={<Absences />} />
            <Route path="/planning/:studentId" element={<Planning />} />
            <Route path="/payments/:studentId" element={<Payments />} />
            <Route path="/events" element={<Events />} />
          </Route>
        </Route>
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
}

export default App;
