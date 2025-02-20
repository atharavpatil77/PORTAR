import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import PrivateRoute from './components/auth/PrivateRoute';
import RoleGuard from './components/guards/RoleGuard';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import OrderForm from './pages/OrderForm';
import TrackOrder from './pages/TrackOrder';
import OrderHistory from './pages/OrderHistory';
import Profile from './pages/Profile';
import AddressBook from './pages/AddressBook';
import AdminDashboard from './pages/AdminDashboard';
import AdminOrders from './pages/AdminOrders';
import Levels from './pages/Levels';
import NotFound from './pages/NotFound';
import DriverProfile from './pages/DriverProfile';
import Drivers from './pages/Drivers';
import { ApolloProvider } from '@apollo/client';
import client from './apollo.js';
import './index.css';

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <div className="flex flex-col min-h-screen space-background">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Protected Routes for All Authenticated Users */}
              <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
              <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
              <Route path="/orders" element={<PrivateRoute><OrderHistory /></PrivateRoute>} />
              <Route path="/orders/:orderId" element={<PrivateRoute><TrackOrder /></PrivateRoute>} />
              <Route path="/levels" element={<PrivateRoute><Levels /></PrivateRoute>} />
              
              {/* Admin Only Routes */}
              <Route 
                path="/admin" 
                element={
                  <PrivateRoute>
                    <RoleGuard allowedRoles={['ADMIN']}>
                      <AdminDashboard />
                    </RoleGuard>
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/admin/orders" 
                element={
                  <PrivateRoute>
                    <RoleGuard allowedRoles={['ADMIN']}>
                      <AdminOrders />
                    </RoleGuard>
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/drivers" 
                element={
                  <PrivateRoute>
                    <RoleGuard allowedRoles={['ADMIN']}>
                      <Drivers />
                    </RoleGuard>
                  </PrivateRoute>
                } 
              />
              
              {/* Driver Only Routes */}
              <Route 
                path="/driver/:id" 
                element={
                  <PrivateRoute>
                    <RoleGuard allowedRoles={['ADMIN', 'DRIVER']}>
                      <DriverProfile />
                    </RoleGuard>
                  </PrivateRoute>
                } 
              />
              
              {/* User Only Routes */}
              <Route 
                path="/order/new" 
                element={
                  <PrivateRoute>
                    <RoleGuard allowedRoles={['USER']}>
                      <OrderForm />
                    </RoleGuard>
                  </PrivateRoute>
                } 
              />
              
              {/* Driver and User Routes */}
              <Route 
                path="/addresses" 
                element={
                  <PrivateRoute>
                    <RoleGuard allowedRoles={['USER', 'DRIVER']}>
                      <AddressBook />
                    </RoleGuard>
                  </PrivateRoute>
                } 
              />

              {/* Catch-all route for 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </ApolloProvider>
  );
}

export default App;