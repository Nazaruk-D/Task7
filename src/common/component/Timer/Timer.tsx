import React, { useState, useEffect } from 'react';
import s from './Timer.module.scss';

interface TimerProps {
    time: number;
    onTimerEnd: () => void;
    myMove: boolean;
}

const Timer: React.FC<TimerProps> = ({ time, onTimerEnd, myMove }) => {
    const [secondsLeft, setSecondsLeft] = useState(time);
    let intervalId: NodeJS.Timeout;

    useEffect(() => {
        if (myMove) {
            setSecondsLeft(time);
        } else {
            intervalId = setInterval(() => {
                setSecondsLeft(prevSecondsLeft => {
                    if (prevSecondsLeft === 0) {
                        clearInterval(intervalId);
                        onTimerEnd();
                        return 0;
                    } else {
                        return prevSecondsLeft - 1;
                    }
                });
            }, 1000);
        }

        return () => clearInterval(intervalId);
    }, [myMove, onTimerEnd, time]);

    const formattedTime = new Date(secondsLeft * 1000).toISOString().substr(14, 5);

    return (
        <div className={s.timer}>
            <div className={s.time}>{formattedTime}</div>
        </div>
    );
};

export default Timer;
