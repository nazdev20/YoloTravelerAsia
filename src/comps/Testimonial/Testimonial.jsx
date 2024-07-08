import React, { useState } from 'react';
import Slider from 'react-slick';
import BgImage from '../../assets/testimonial.png';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import naz from "../../assets/naz.jpg";
import th from "../../assets/th.jpg";
import pagudpud from "../../assets/pagudpud.jpeg";
import drone from "../../assets/drone.jpeg";
import outoftown from "../../assets/outoftown.jpeg";
import swimming from "../../assets/swimming.jpeg";
import Spline from '@splinetool/react-spline';
import Modal from 'react-modal';


const bgStyle = {
  backgroundImage: `url(${BgImage.src})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
};

const TestimonialData = [
  {
    id: 1,
    name: 'Nazarene Eroa',
    text: 'The Smooth ang transaction dito tapos ang ganda ng experience. Highly recommended!',
    img: naz,
    commentImg: pagudpud,
  },
  {
    id: 2,
    name: 'James',
    text: 'YoloTravelerAsia made planning my trip to Asia effortless with its stunning visuals and seamless booking process. Highly recommended!',
    img: th,
    commentImg: drone
  },
  {
    id: 3,
    name: 'Jessica',
    text: 'The personalized service and diverse travel packages on YoloTravelerAsia ensured my vacation was unforgettable. Fantastic experience!',
    img: 'https://picsum.photos/103/103',
    commentImg: outoftown,
  },
  {
    id: 4,
    name: 'Chazzy',
    text: 'Exploring Asia with YoloTravelerAsia was a breeze. The site’s user-friendly design and beautiful destinations made my trip planning enjoyable and easy.',
    img: 'https://picsum.photos/104/104',
    commentImg: swimming,
  },
];

const Testimonial = () => {
  const [modalIsOpen, setIsOpen] = useState(false);
  const [selectedImg, setSelectedImg] = useState(null);

  const openModal = (img) => {
    setSelectedImg(img);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const settings = {
    dots: true,
    arrows: false,
    infinite: true,
    speed: 500,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    cssEase: 'linear',
    pauseOnHover: true,
    pauseOnFocus: true,
    responsive: [
      {
        breakpoint: 10000,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div style={{ ...bgStyle, height: '420px', overflow: 'hidden' }} >
      <div className="bg-[#e4e3e3] text-[#008080] h-full p-7">
        <div className="container h-full flex flex-col justify-center" data-aos='fade-up'>
          <div className="text-center mb-4">
            <h1 className="text-2xl font-bold">Testimonials</h1>
          </div>
          <div>
            <Slider {...settings}>
              {TestimonialData.map(({ id, name, text, img, commentImg }) => (
                <div key={id} className="my-2">
                  <div className="flex flex-col gap-4 shadow-lg py-6 px-5 mx-2 rounded-3xl bg-gray-300 text-dark relative">
                    <div className="flex flex-col items-center gap-2">
                      {commentImg && (
                        <img
                          src={commentImg}
                          alt="comment"
                          className="w-52 h-28 object-cover rounded-md cursor-pointer"
                          onClick={() => openModal(commentImg)}
                        />
                      )}
                      <p className="text-sm text-center">{text}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <img src={img} alt={name} className="rounded-full w-16 h-16 object-cover" />
                      <div className="space-y-1">
                        <h1 className="text-sm font-bold dark:text-primary font-cursive">
                          {name}
                        </h1>
                        <p className="text-xs font-bold text-white">Developer</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </div>


      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Image Modal"
        className="modal"
        overlayClassName="overlay"
      >
        <button onClick={closeModal} className="absolute top-4 right-4 text-white text-2xl">×</button>
        <img src={selectedImg} alt="Selected" className="w-full h-auto" />
      </Modal>

      <style jsx>{`
        .modal {
          position: relative;
          width: 80%;
          max-width: 600px;
          margin: 100px auto;
          background: #fff;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          
        }

        .overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.75);
          
        }

        .modal img {
          max-width: 100%;
          border-radius: 10px;
         
    
        }

        .modal button {
          background: none;
          border: none;
          font-size: 2rem;
          color: #333;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default Testimonial;
