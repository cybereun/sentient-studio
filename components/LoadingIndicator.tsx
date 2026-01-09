import React, { useState, useEffect } from 'react';

const loadingMessages = [
    "AI가 당신의 장면을 구상하고 있어요...",
    "마법을 조금 더하는 중...",
    "잊혀진 기억에 색을 입히는 중...",
    "픽셀을 섬세하게 다듬고 있어요...",
    "당신의 걸작을 만들고 있어요...",
    "조금만 기다려주세요, 멋진 예술에는 인내가 필요하답니다.",
];

const LoadingIndicator: React.FC = () => {
    const [message, setMessage] = useState(loadingMessages[0]);

    useEffect(() => {
        const interval = setInterval(() => {
            setMessage(loadingMessages[Math.floor(Math.random() * loadingMessages.length)]);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center p-8 bg-white/50 rounded-lg">
            <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-rose-500"></div>
            <p className="mt-4 text-lg text-stone-700 font-medium tracking-wide">{message}</p>
        </div>
    );
};

export default LoadingIndicator;