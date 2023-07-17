import React, {useState, useEffect} from 'react';
import './App.css';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import ProfilePg from './pages/ProfilePg';
import Navigation from './components/NavBar/Navigation';
import SignOutAccount from './components/GoogleAuth/SignOutAccount';
import SignIn from './components/GoogleAuth/SignIn';
import SignUp from './components/GoogleAuth/SignUp';
import ConfigureGesture from './components/ConfigureCato/ConfigureGesture';
import Dashboard from './components/Dashboard/Dashboard';
import CatoSettings from './components/CatoSettings/CatoSettings';
import DeviceAccess from './components/Dashboard/device-connection/DeviceAccess';
import RegisterCatoDevice from './components/CatoSettings/RegisterCatoDevice';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const listen = onAuthStateChanged(auth, (user) => {
      if(user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
    // return removes listener
    return () => {
      listen();
    }
  }, []);

  function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }

  return (
    <div className="h-screen">
    <BrowserRouter>
      {user === null ? 
      <>
        <Routes>
          <Route path="/sign-in" element={<SignIn/>}/>
          <Route path="/sign-up" element={<SignUp/>}/>
        </Routes>
        <SignIn/>
      </>
        
      :
        <Navigation user={user} classNames={classNames}/>
      } 
        <main className="py-10 lg:pl-72">
          <div className="px-4 sm:px-6 lg:px-8">
            <Routes>
              <Route exact path="/" element={<Dashboard classNames={classNames} user={user}/>}/>
              <Route path="profile" element={<ProfilePg user={user}/>}/>
              <Route path="configure-cato" element={<ConfigureGesture classNames={classNames} user={user}/>}/>
              <Route path="cato-device-access" element={<DeviceAccess classNames={classNames}/>}/>
              <Route path="cato-settings" element={<CatoSettings classNames={classNames} user={user}/>}/>
              <Route path="register-cato-device" element={<RegisterCatoDevice user={user}/>}/>
              <Route path="/sign-out" element={<SignOutAccount/>}/>
              <Route path="/sign-in" element={<SignIn/>}/>
              <Route path="/sign-up" element={<SignUp/>}/>
            </Routes>
          </div>
        </main>
      </BrowserRouter>
    </div>
  )
}

export default App;
