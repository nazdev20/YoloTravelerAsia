import React from 'react';

function Aboutus() {
  return (
    <section className="bg-white px-5 py-14 sm:px-8 sm:py-16 lg:px-10 lg:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto mb-10 max-w-3xl text-center sm:mb-14">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#ff6809]">Get to know us</p>
          <h1 className="text-3xl font-bold leading-tight text-[#008080] sm:text-4xl lg:text-5xl">
            About YOLO Traveler Asia
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-gray-600 sm:text-lg sm:leading-8">
            We create memorable travel experiences across Asia, bringing together local culture, beautiful destinations, and adventures tailored to you.
          </p>
        </div>

        <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
          <div className="space-y-4 text-base leading-7 text-gray-600">
            <p>
              Welcome to YOLO Traveler Asia, your travel partner for unique and memorable journeys. We help you explore at your own pace, whether you are looking for adventure, relaxation, or cultural discovery.
            </p>
            <p>
              From serene beaches to lively city streets, we aim to make every trip seamless, personal, and worth remembering.
            </p>
            <p>
              We also value responsible travel that respects local communities and the places that make every destination special.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
            <article className="rounded-2xl border border-gray-100 bg-gray-50 p-6 shadow-sm sm:p-7">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#008080]/10 text-[#008080]">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-6 w-6" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v3m0 12v3M3 12h3m12 0h3M5.64 5.64l2.12 2.12m8.48 8.48 2.12 2.12m0-12.72-2.12 2.12m-8.48 8.48-2.12 2.12" />
                  <circle cx="12" cy="12" r="5" />
                </svg>
              </div>
              <h2 className="mb-2 text-xl font-bold text-gray-900 sm:text-2xl">Our Mission</h2>
              <p className="text-sm leading-6 text-gray-600 sm:text-base sm:leading-7">
                To make every trip extraordinary through personalized travel options, thoughtful service, and experiences that connect people with the places they visit.
              </p>
            </article>

            <article className="rounded-2xl border border-gray-100 bg-gray-50 p-6 shadow-sm sm:p-7">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#ff6809]/10 text-[#ff6809]">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-6 w-6" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
                  <circle cx="12" cy="12" r="2.5" />
                </svg>
              </div>
              <h2 className="mb-2 text-xl font-bold text-gray-900 sm:text-2xl">Our Vision</h2>
              <p className="text-sm leading-6 text-gray-600 sm:text-base sm:leading-7">
                To make travel across Asia more accessible and responsible while inspiring cultural appreciation and lifelong memories.
              </p>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Aboutus;
