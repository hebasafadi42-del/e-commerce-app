import React, { useState, useEffect } from "react";

const CountdownTimer = () => {
  const targetDate = new Date().getTime() + 6 * 24 * 60 * 60 * 1000;

  const [timeLeft, setTimeLeft] = useState({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        const d = Math.floor(difference / (1000 * 60 * 60 * 24));
        const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({
          days: d < 10 ? `0${d}` : d,
          hours: h < 10 ? `0${h}` : h,
          minutes: m < 10 ? `0${m}` : m,
          seconds: s < 10 ? `0${s}` : s,
        });
      } else {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const timeBlocks = [
    { label: "Days", value: timeLeft.days },
    { label: "Hour", value: timeLeft.hours },
    { label: "Min", value: timeLeft.minutes },
    { label: "Sec", value: timeLeft.seconds },
  ];

  return (
    <div className="p-1  ">
      <h5 className="fw-bold mb-0">Deals and offers</h5>
      <p className="text-muted small mb-3">Hygiene equipments</p>

      <div className="d-flex gap-2 flex-wrap">
        {timeBlocks.map((block, index) => (
          <div
            key={index}
            className="bg-dark text-white rounded-2 text-center p-1"
            style={{ width: "26%" }}
          >
            <div className="fw-bold fs-6 leading-none">{block.value}</div>
            <div className="text-white-50" style={{ fontSize: "10px" }}>
              {block.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CountdownTimer;