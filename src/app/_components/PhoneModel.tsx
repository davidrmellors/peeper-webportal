import React, { useState, useRef } from 'react';

interface PhoneDisplayProps {
  videoPath: string;
  alt: string;
  className?: string;
  onHover?: (isHovered: boolean) => void;
  hoverAnimation?: boolean;
  rotationAngle?: number;
  scale?: number;
}

const PhoneDisplay: React.FC<PhoneDisplayProps> = ({ 
  videoPath, 
  alt, 
  className = '', 
  onHover = () => {console.log('wow! spinny phone!')}, 
  hoverAnimation = true, 
  rotationAngle = 0,
  scale = 1 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleMouseEnter = () => {
    setIsHovered(true);
    onHover(true);
    if (videoRef.current) {
      videoRef.current.play().catch(error => console.error('Error playing video:', error));
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    onHover(false);
    // Do not pause or reset the video
  };

  const handleVideoEnd = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0; // Reset to start
    }
  };

  return (
    <div 
      className={`relative z-20 transform transition-transform duration-500 ${
        isHovered ? 'scale-105' : ''
      } ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ transform: `rotate(${rotationAngle}deg) scale(${scale})` }}
    >
      <video
        ref={videoRef}
        src={videoPath}
        width={400}
        height={800}
        className={`object-contain transition-all duration-300 ${
          isHovered ? 'filter-none' : ''
        } ${hoverAnimation ? 'hover-animation' : ''}`}
        loop={false}
        muted
        onEnded={handleVideoEnd}
      />
    </div>
  );
};

export default PhoneDisplay;