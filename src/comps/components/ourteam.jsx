import React from 'react';
import Mam from "../../assets/mamrosie.jpeg";
import chazz from "../../assets/chazz.jpg";
import jess from "../../assets/jess.jpeg";

const Ourteam = () => {
  return (
    <div className="flex items-center justify-center text-center bg-[#F5F5F5] py-8" data-aos="fade-up" data-aos-delay="100">
      <div className="flex flex-col p-6 m-4 max-w-full md:max-w-4xl">
        <div className="text-3xl text-[#008080]  font-bold mb-4">Meet the Tour Guide</div>
        <div className="text-sm md:text-xl mb-6 text-[#202830]">Our dedicated CEO who ensures your journey is seamless and enjoyable.</div>
        <div className="flex items-center justify-center mb-6" data-aos="fade-up" data-aos-delay="100">
          <div className="h-64 w-64  rounded-full overflow-hidden border-2 border-gray-300">
            <img src={Mam} alt="Rosie Glenda" className="object-cover h-full w-full" />
          </div>
          <div className="flex flex-col text-center md:text-left mt-4 md:mt-0">
              <div className="text-lg font-medium text-[#202830] cursor-pointer hover:text-stone-400">Rosie Glenda</div>
              <div className="italic text-[#202830]">Business Owner</div>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 md:p-6 w-full">
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-x-4 md:space-y-0" data-aos="fade-up" data-aos-delay="100">
            <div className="h-64 w-64 rounded-full overflow-hidden border-2 border-gray-300">
              <img src={chazz} alt="Chazz" className="object-cover h-full w-full" />
            </div>
            <div className="flex flex-col items-center md:items-start mt-4 md:mt-0">
              <div className="text-lg font-medium text-[#202830] cursor-pointer hover:text-stone-400">Daniel</div>
              <div className="italic text-[#202830]">Tour Guide</div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-x-4 md:space-y-0" data-aos="fade-up" data-aos-delay="100">
            <div className="h-64 w-64 rounded-full overflow-hidden border-2 border-gray-300">
              <img src={jess} alt="Jess" className="object-cover h-full w-full" />
            </div>
            <div className="flex flex-col items-center md:items-start mt-4 md:mt-0">
              <div className="text-lg font-medium text-[#202830] cursor-pointer hover:text-stone-400">Jessica</div>
              <div className="italic text-[#202830]">Tour Guide</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Ourteam;
