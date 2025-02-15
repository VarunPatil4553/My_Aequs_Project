import { useState, useEffect } from 'react';

const DateTimeDisplay = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div>
      <div>
        <p>{currentTime.toLocaleDateString()}</p>
        {/* <p>{currentTime.toLocaleTimeString()}</p> */}
      </div>
    </div>
  );
};

export default DateTimeDisplay;
