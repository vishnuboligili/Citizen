import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { NavBar } from './Components/NavBar/NavBar';
import { Footer } from './Components/Footer/Footer';
import Home from './Components/Home/Home';
import { Login } from './Components/Login/Login';
import { Register } from './Components/Register/Register';
import { OTP } from './Components/OTP/OTP';
import { Profile } from './Components/Profile/Profile';
import { Edit } from './Components/Edit/Edit';
import { ForgotPassword } from './Components/ForgotPassword/ForgotPassword';
import { ForgotOtp } from './Components/ForgotOtp/ForgotOtp';
import Password from './Components/Password/Password';
import { UserIssue } from './Components/UserIssue/UserIssue';
import MyIssue from './Components/userMyIssue/MyIssue';
import UserList from './Components/UsersList/UserList';
import WorkerList from './Components/WorkerList/WorkerList';
import AdminIssues from './Components/AdminIssues/AdminIssues';
import WorkerDashboard from './Components/WorkerIssues/WorkerDashboard';
import UserHome from './Components/userHome/userHome';
import AdminHome from './Components/adminHome/adminHome';
import WorkerHome from './Components/workerHome/workerHome';

import { useState, useEffect } from 'react';
import SplashScreen from './Components/flash/SplashScreen';

function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3500); // splash + fade out time (match CSS and SplashScreen.js)
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    <div className="App">
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/otp' element={<OTP />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/edit' element={<Edit />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path='/forgot-otp' element={<ForgotOtp />} />
          <Route path='/password' element={<Password />} />
          <Route path='/user-issue' element={<UserIssue />} />
          <Route path='/my-issues' element={<MyIssue />} />
          <Route path='/users-list' element={<UserList />} />
          <Route path='/workers-list' element={<WorkerList />} />
          <Route path='/admin-issue' element={<AdminIssues />} />
          <Route path='/worker-issue' element={<WorkerDashboard />} />
          <Route path='/userHome' element={<UserHome />} />
          <Route path='/adminHome' element={<AdminHome />} />
          <Route path='/workerHome' element={<WorkerHome />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
