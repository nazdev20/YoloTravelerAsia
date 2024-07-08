import { FaFacebook, FaGoogle, FaInstagram, FaTwitter, FaMapMarker, FaMousePointer } from "react-icons/fa";
import { MdEmail, MdCall } from 'react-icons/md';

const Footer = () => {
  return (
    <div className="bg-black text-white">

      <div className="bg-[#dad9d9] text-[#008080]">
        <div data-aos="fade-up" className="container mx-auto text-center py-6 lg:py-10 text-lg lg:text-2xl font-bold space-y-2">
          <p className="uppercase">We are ready to take your booking 24/7</p>
          <h1 className="text-2xl md:text-3xl font-bold">(042)731-1638</h1>
        </div>
      </div>

      <div data-aos="fade-up" className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-12 py-6 md:py-12">
        <div className="space-y-4">
          <h1 className="text-xl lg:text-2xl py-3 font-bold uppercase border-b-4 border-[#ff6809]">About</h1>
          <p className="text-sm lg:text-base">
           
            Our team is committed to providing personalized services to ensure your journey is seamless and enjoyable. 
            Whether you are looking for adventure, relaxation, or cultural exploration, we have the perfect trip for you.
          </p>
         
        </div>

        <div className="space-y-4">
          <h1 className="text-xl lg:text-2xl py-3 font-bold uppercase border-b-4 border-[#ff6809]">Contact</h1>
          <div className="flex items-start gap-4 text-sm lg:text-base">
            <FaMapMarker className="text-xl lg:text-2xl" /> 
            <p>San Diego Poblacion, Gumaca, Philippines, 4307</p>
          </div>
          <div className="flex items-start gap-4 text-sm lg:text-base">
            <MdCall className="text-xl lg:text-2xl" /> 
            <p>(042)731-1638</p>
          </div>
          <div className="flex items-start gap-4 text-sm lg:text-base">
            <MdEmail className="text-xl lg:text-2xl" /> 
            <p>yolotravelerasia@gmail.com</p>
          </div>
          <div className="flex items-start gap-4 text-lg lg:text-base">
          <FaFacebook  /><a href="https://www.facebook.com/people/Yolotravelerasia/100065144013518/">  Yolotravelerasia</a>
          </div>
        </div>
      </div>

      <p className="text-center py-4 text-xs lg:text-sm">© 2024 Yolo Traveler. All rights reserved.</p>
    </div>
  );
};

export default Footer;
