import { useState, useEffect } from 'react';

const useAlternate = (interval, offset = 0) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Initial offset
    const offsetTimeout = setTimeout(() => {
      setShow(true);
      // Start the regular interval after the offset
      const intervalId = setInterval(() => {
        setShow((prev) => !prev);
      }, interval);

      return () => clearInterval(intervalId);
    }, offset);

    return () => clearTimeout(offsetTimeout);
  }, [interval, offset]);

  return show;
};

export default useAlternate;
