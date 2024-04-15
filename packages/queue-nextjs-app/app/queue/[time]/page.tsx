'use client';
import { useEffect, useState } from 'react';

export default function Queue({ params }: { params: { time: string } }) {
  const waitTime = parseInt(params.time ?? '0');
  const [remainingTime, setRemainingTime] = useState(waitTime);

  useEffect(() => {
    let timeout;
    const retries = parseInt(sessionStorage.getItem('retries') ?? '1');

    if (retries > 5) {
      sessionStorage.setItem('retries', '1');
      throw new Error('Cannot enter event');
    } else if (remainingTime === 0) {
      sessionStorage.setItem('retries', (retries + 1).toString());
      timeout = setTimeout(() => window.location.reload(), retries * 1000);
    } else {
      timeout = setTimeout(() => window.location.reload(), waitTime * 1000);
    }
    return () => clearTimeout(timeout);
  }, [waitTime]);

  setInterval(() => {
    if (remainingTime > 0) setRemainingTime(remainingTime - 1)
  }, 1000)
  
  return (
    <div>
      <h1>{"You're in the queue"}</h1>
      {remainingTime < 2 && <p>Joining momentarily!</p>}
      {remainingTime >= 2 && <p>{remainingTime} seconds</p>}
    </div>
  )
}
