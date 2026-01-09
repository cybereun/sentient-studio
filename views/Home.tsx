
import React from 'react';
import { AppView } from '../types';

interface HomeProps {
  setView: (view: AppView) => void;
}

const FeatureCard: React.FC<{ 
    title: string; 
    description: string; 
    onClick: () => void; 
    imageSrc: string;
    buttonText: string;
}> = ({ title, description, onClick, imageSrc, buttonText }) => (
    <div 
        onClick={onClick}
        className="group relative overflow-hidden rounded-3xl bg-white shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer h-96 flex flex-col justify-end"
    >
        <div className="absolute inset-0 bg-stone-200 transition-transform duration-700 group-hover:scale-105">
            {/* Placeholder for feature image pattern */}
            <div className={`w-full h-full bg-cover bg-center opacity-60 mix-blend-multiply transition-opacity duration-500 group-hover:opacity-40`} style={{backgroundImage: `url(${imageSrc})`}}></div>
            <div className="absolute inset-0 bg-gradient-to-t from-stone-900/90 via-stone-900/40 to-transparent"></div>
        </div>
        
        <div className="relative p-8 z-10 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
            <h3 className="text-3xl font-bold text-white mb-3 font-serif">{title}</h3>
            <p className="text-stone-300 mb-6 font-light leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">{description}</p>
            <div className="flex items-center text-white font-medium tracking-wide">
                <span className="border-b border-white pb-1">{buttonText}</span>
                <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
            </div>
        </div>
    </div>
);


const Home: React.FC<HomeProps> = ({ setView }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <div className="text-center max-w-4xl mx-auto mb-20 animate-fade-in-up">
        <span className="inline-block py-1 px-3 rounded-full bg-rose-50 text-rose-500 text-xs font-bold tracking-widest uppercase mb-6 border border-rose-100">Next Generation AI Studio</span>
        <h1 className="text-6xl md:text-8xl font-black text-stone-900 mb-8 font-serif leading-tight tracking-tight">
          Redefine <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-stone-800 to-stone-500">Reality.</span>
        </h1>
        <p className="text-xl md:text-2xl text-stone-500 font-light leading-relaxed max-w-2xl mx-auto">
          당신의 상상을 현실로 만드는 가장 우아한 방법. <br className="hidden md:block"/>
          감성적인 AI 기술로 이미지를 합성하고, 추억을 복원하세요.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
        <FeatureCard 
            title="Scene Composition"
            description="서로 다른 사물과 배경을 완벽하게 조화시켜 새로운 이야기를 만들어냅니다. 조명과 그림자까지 계산된 완벽한 합성을 경험하세요."
            onClick={() => setView(AppView.COMPOSE)}
            imageSrc="https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070&auto=format&fit=crop"
            buttonText="합성 시작하기"
        />
        <FeatureCard 
            title="Memory Restoration"
            description="시간이 흘러 희미해진 소중한 순간들을 되살립니다. 손상을 복구하고, 생생한 컬러를 입혀 그때의 감동을 다시 느껴보세요."
            onClick={() => setView(AppView.RESTORE)}
            imageSrc="https://images.unsplash.com/photo-1531303435785-3853fb435c40?q=80&w=2070&auto=format&fit=crop"
            buttonText="복원 시작하기"
        />
      </div>
    </div>
  );
};

export default Home;
