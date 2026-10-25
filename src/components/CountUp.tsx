import React, { useEffect, useState } from 'react';

interface CountUpProps {
  end: number;
  duration?: number; // ms, default 800ms
  formatter?: (val: number) => string;
  prefix?: string;
  suffix?: string;
}

export const CountUp: React.FC<CountUpProps> = ({
  end,
  duration = 800,
  formatter,
  prefix = '',
  suffix = ''
}) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const startVal = 0;
    const endVal = end;

    if (endVal === 0) {
      setCurrent(0);
      return;
    }

    let animationFrameId: number;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // Ease-out cubic curve for smooth deceleration
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const val = startVal + (endVal - startVal) * easeOut;
      
      setCurrent(val);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      } else {
        setCurrent(endVal);
      }
    };

    animationFrameId = requestAnimationFrame(step);

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [end, duration]);

  const displayVal = formatter ? formatter(current) : Math.round(current).toLocaleString('vi-VN');

  return (
    <span>
      {prefix}
      {displayVal}
      {suffix}
    </span>
  );
};
