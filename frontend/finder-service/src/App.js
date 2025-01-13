import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import BusinessDashboard from './pages/BusinessDashboard';
import ExpertDashboard from './pages/ExpertDashboard';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/Header';
import Search from './pages/Search';
import ExpertProfile from './pages/ExpertProfile';
import ExpertDetails from './pages/ExpertDetails';
import ManageAvailability from './components/availability/ManageAvailability';
import SearchLandingPage from './pages/SearchLandingPage';
import SearchResultsPage from './pages/SearchResultsPage';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<ProtectedRoute><SearchLandingPage /></ProtectedRoute>} />
        <Route
          path="/dashboard/business"
          element={
            <ProtectedRoute>
              <BusinessDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/expert"
          element={
            <ProtectedRoute>
              <ExpertDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/search"
          element={
            <ProtectedRoute>
              <Search />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ExpertProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/search-results"
          element={
            <ProtectedRoute>
              <SearchResultsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/expert-details/:expertId"
          element={
            <ProtectedRoute>
              <ExpertDetails />
            </ProtectedRoute>
          }
        />
        <Route path="/availability" element={<ManageAvailability />} />

      </Routes>
    </Router>
  );
}

export default App;
