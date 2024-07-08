import React from 'react';
import './Background.css'; // Import your CSS file

const Background = () => {
    // Define an array of floating picture data
    const floatingPictures = [
        { url: '1.png', top: '10%', left: '10%', floatDuration: '10s', rotateDegrees: '150deg'},
        { url: '1.png', top: '20%', left: '95%', floatDuration: '10s', rotateDegrees: '50deg' },
        { url: '1.png', top: '99%', left: '80%', floatDuration: '10s', rotateDegrees: '150deg'},
        { url: '1.png', top: '70%', left: '1%', floatDuration: '10s', rotateDegrees: '30deg'}
    ];
  
    return (
      <div>
        {floatingPictures.map((picture, index) => (
          <div
            key={index}
            className={`floating-picture-wrapper picture-${index + 1}`}
            style={{
              top: picture.top,
              left: picture.left,
              transform: `rotate(${picture.rotateDegrees})`, // Apply rotation to the wrapper
            }}
          >
            <div
              className={`floating-picture`}
              style={{
                backgroundImage: `url(${picture.url})`,
                animation: `float${index + 1} ${picture.floatDuration} infinite`, // Add floating animation
              }}
            ></div>
          </div>
        ))}
      </div>
    );
}

export default Background;