import React from 'react';
import { AppView } from '../types';

interface HomeProps {
  setView: (view: AppView) => void;
}

const FeatureCard: React.FC<{ title: string; description: string; onClick: () => void; icon: React.ReactNode }> = ({ title, description, onClick, icon }) => (
    <div 
        onClick={onClick}
        className="group bg-white p-8 rounded-xl shadow-lg border border-stone-200 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 transform"
    >
        <div className="flex items-center justify-center h-16 w-16 mb-6 rounded-full bg-rose-100 text-rose-500 group-hover:bg-rose-500 group-hover:text-white transition-colors duration-300">
            {icon}
        </div>
        <h3 className="text-2xl font-bold text-stone-800 mb-2">{title}</h3>
        <p className="text-stone-600">{description}</p>
    </div>
);


const Home: React.FC<HomeProps> = ({ setView }) => {
  return (
    <div className="text-center py-16">
      <h1 className="text-5xl md:text-6xl font-extrabold text-stone-800 mb-4">되찾고, 창조하세요</h1>
      <p className="max-w-3xl mx-auto text-lg text-stone-600 mb-12">
        상상에 생명을 불어넣는 감성 AI 포토 스튜디오. 이미지를 새로운 현실로 완벽하게 합성하거나, 소중한 추억에 생생한 색을 불어넣으세요.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <FeatureCard 
            title="이미지 합성"
            description="기본 사진과 다른 사물 사진을 결합하여 상상 속의 새롭고 완벽한 장면을 만들어보세요."
            onClick={() => setView(AppView.COMPOSE)}
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
        />
        <FeatureCard 
            title="사진 복원"
            description="오래되거나 빛바랜 사진을 되살려 선명도를 높이고 자연스러운 색상을 입혀보세요."
            onClick={() => setView(AppView.RESTORE)}
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
      </div>
    </div>
  );
};

export default Home;