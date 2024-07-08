import React from 'react';
import Spline from '@splinetool/react-spline';

function Aboutus() {
  return (
    <div className="bg-white py-20 px-11 " >
      <div className="container mx-auto px-11 md:px-12 flex flex-col   justify-start">
        <h1 className="text-4xl font-bold text-center text-[#008080] mb-6">About YOLO Traveler Asia</h1>
        <p className="text-gray-600 text-lg md:text-xl mb-12 max-w-full" data-aos="fade-up">
  Welcome to YOLO Traveler Asia, your premier travel agency dedicated to offering unique and memorable travel experiences. Our team is committed to providing personalized services to ensure your journey is seamless and enjoyable. Whether you're looking for adventure, relaxation, or cultural exploration, we are here to craft an unforgettable journey tailored to your desires.
  
  At YOLO Traveler Asia, we believe that travel is more than just visiting new places; it is about experiencing different cultures, making lifelong memories, and creating stories to share. Our expert team of travel enthusiasts is passionate about curating bespoke itineraries that cater to your interests, preferences, and comfort.
  <br /><br />
  From the serene beaches of Thailand to the bustling streets of Tokyo, our diverse range of destinations and activities ensures there’s something for everyone. We prioritize sustainability and ethical travel, ensuring that our adventures not only enrich your life but also support the local communities and environments we visit.

  Let us take you on a journey beyond the ordinary, where each moment is designed to amaze and inspire. Join us at YOLO Traveler Asia, and let’s embark on an adventure of a lifetime together.
</p>

        <div className="flex flex-col md:flex-row items-center justify-center md:justify-center w-full"data-aos="fade-up">
          <div className="w-full md:w-1/2 lg:w-1/3 px-4 mb-8">
            <div className="p-6 shadow-lg rounded-lg">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Our Mission</h2>
              <p className="text-gray-600">
                At YOLO Traveler Asia, our mission is to make every trip an extraordinary experience. Whether you're seeking adventure, relaxation, or cultural exploration, we tailor each journey to your preferences. Our goal is to ensure that your travel experience is seamless, enriching, and truly unforgettable.
              </p>
            </div>
          </div>
          <div className="w-full md:w-1/2 lg:w-1/3 px-4 mb-8">
            <div className="p-6 shadow-lg rounded-lg">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Our Vision</h2>
              <p className="text-gray-600">
                We envision a world where travel is accessible, affordable, and sustainable. Our goal is to connect people with the wonders of Asia and create lifelong memories. We strive to be a bridge to the diverse cultures and landscapes that Asia has to offer, fostering understanding and appreciation through travel.
              </p>
            </div>
          </div>
         
        </div>
      </div>
    </div>
  );
}

export default Aboutus;
