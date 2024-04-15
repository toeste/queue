'use client';
import { useEffect, useState } from 'react';

export default function Queue({ params }: { params: { time: string } }) {
  const waitTime = parseInt(params.time ?? '0');
  const [remainingTime, setRemainingTime] = useState(waitTime);

  useEffect(() => {
    const retries = parseInt(localStorage.getItem('retries') ?? '1');

    if (retries > 5) {
      throw new Error('Cannot enter event');
    } else if (waitTime === 0) {
      setTimeout(() => window.location.reload(), retries * 1000);
      localStorage.setItem('retries', (retries + 1).toString());
    } else {
      setTimeout(() => window.location.reload(), waitTime * 1000);
    }
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
