import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './components/home';
import Login from './components/login/login';
import AdminDashboard from './components/admin/dashboard';
import Buses from './components/admin/buses';
import BusRoutes from './components/admin/routes';
import Trips from './components/admin/trips';
import Bookings from './components/admin/bookings';
import AdminNotification from './components/admin/notification';

import UserDashboard from './components/user/dashboard';
import MyTickets from './components/user/mytickets';
import UserNotification from './components/user/notification';
import TripDetails from './components/tripdetails';
import UserSearchBus from './components/user/searchbus';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path='/' element={<Home />} />
        <Route path='/login/:id' element={<Login />} />
        <Route path='/trip/:id' element={<TripDetails />} />
        {/* admin routes */}
        <Route path='/admindashboard' element={<AdminDashboard />} />
        <Route path='/adminbus' element={<Buses />} />
        <Route path='/adminroutes' element={<BusRoutes />} />
        <Route path='/admintrips' element={<Trips />} />
        <Route path='/adminbookings' element={<Bookings />} />
        <Route path='/adminnotifications' element={<AdminNotification />} />
        {/* user routes */}
        <Route path='/userdashboard' element={<UserDashboard />} />
        <Route path='/usermytickets' element={<MyTickets />} />
        <Route path='/usernotification' element={<UserNotification />} />
        <Route path='/userbussearch' element={<UserSearchBus />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
