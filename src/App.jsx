// src/App.js

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css'; 

import Aboutus from './comps/components/aboutus';
import Navbar from './comps/Navbar/navbar';
import ItemDisplay from './comps/components/Productview';
import TransactionHistory from './comps/components/profilepage/Bookinghistory';
import TransactionList from './comps/components/cart';
import UserViewPage from './comps/components/products/Packageview';
import ProfileView from './comps/components/profilepage/Profileview';
import Popup from './comps/components/Productpopup';
import AdminPage from './comps/components/adminpage/Adminproduct';
import Testimonial from './comps/Testimonial/Testimonial';
import Footer from './comps/Footer/Footer';
import Package from './comps/components/adminpage/adminpackage';
import Swipe from './swipingheader';
import Ourteam from './comps/components/ourteam';
import Destinations from './comps/components/about';
import AuthComponent from './Auth';


const MainLayout = ({ children }) => (
  <>
    <Navbar />
    <div id='1'><Swipe /></div>
    <div id='2'><Aboutus /><Destinations /></div>
    <ItemDisplay />
    <UserViewPage />
    <div id='4'><Ourteam /></div>
    <div id='3'><Testimonial /></div>
    <div id='5'><Footer /></div>
  </>
);

function App() { 
  useEffect(() => {
    AOS.init({
      offset: 100,
      duration: 600,
      easing: "ease-in-sine",
      delay: 100,
    });
  }, []);

  return (
    <div className="App">
      <Router basename="/YoloTravelerAsia">
        <Routes>
          
        
          <Route path="/list" element={<TransactionList />} />
          <Route path="/profile" element={<ProfileView />} />
          <Route path="/home" element={<Swipe />} />
          <Route
            path="*"
            element={
              <MainLayout>
                <Routes>
                
                  <Route path="/auth" element={<AuthComponent />} />
                 <Route path="/package" element={<Package />} />
                 <Route path="/product" element={<AdminPage />} />
                 <Route path="/transactionhistory" element={<TransactionHistory />} />
                 <Route path="/popup" element={<Popup />} />
                 </Routes>
              </MainLayout>
              
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
