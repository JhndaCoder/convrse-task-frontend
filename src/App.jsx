import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
// import Register from './pages/Register';
import PropertyListing from './pages/PropertyListing';
import AdminDashboard from './components/AdminDashboard';
import PropertyDetails from './pages/PropertyDetails';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PropertyListing />} />
        <Route path='/:id' element={<PropertyDetails />} />
        <Route path="/login" element={<Login />} />
        {/* <Route path="/register" element={<Register />} /> */}
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
