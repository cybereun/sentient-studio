
import React, { useState, useEffect } from 'react';
import { getApiKey, saveApiKey, testConnection } from '../services/geminiService';

interface ApiKeyModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose }) => {
    const [apiKey, setApiKey] = useState('');
    const [status, setStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (isOpen) {
            const storedKey = getApiKey();
            if (storedKey) setApiKey(storedKey);
            setStatus('idle');
            setMessage('');
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleTest = async () => {
        if (!apiKey.trim()) {
            setStatus('error');
            setMessage('API Key를 입력해주세요.');
            return;
        }

        setStatus('testing');
        setMessage('연결 테스트 중...');

        const isSuccess = await testConnection(apiKey);

        if (isSuccess) {
            setStatus('success');
            setMessage('연결 성공! 사용 가능한 API Key입니다.');
        } else {
            setStatus('error');
            setMessage('연결 실패. 유효하지 않은 API Key이거나 네트워크 문제입니다.');
        }
    };

    const handleSave = () => {
        if (!apiKey.trim()) {
            setStatus('error');
            setMessage('저장할 API Key를 입력해주세요.');
            return;
        }
        saveApiKey(apiKey);
        onClose();
        alert('API Key가 안전하게 저장되었습니다.');
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-stone-900/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl transform transition-all scale-100">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold font-serif text-stone-900">API Key 설정</h2>
                    <button onClick={onClose} className="text-stone-400 hover:text-stone-600 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="mb-6">
                    <p className="text-sm text-stone-500 mb-4 leading-relaxed">
                        Google Gemini API Key를 입력해주세요. 입력된 키는 브라우저의 로컬 스토리지에 암호화되어 안전하게 저장됩니다.
                    </p>
                    <div className="relative">
                        <input
                            type="password"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            placeholder="AIzaSy..."
                            className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-stone-700 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none transition-all font-mono text-sm"
                        />
                    </div>
                </div>

                {message && (
                    <div className={`mb-6 p-3 rounded-lg text-sm font-medium flex items-center gap-2
                        ${status === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : ''}
                        ${status === 'error' ? 'bg-rose-50 text-rose-700 border border-rose-100' : ''}
                        ${status === 'testing' ? 'bg-blue-50 text-blue-700 border border-blue-100' : ''}
                    `}>
                        {status === 'testing' && (
                             <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                             </svg>
                        )}
                        {status === 'success' && <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>}
                        {status === 'error' && <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                        {message}
                    </div>
                )}

                <div className="flex gap-3">
                    <button
                        onClick={handleTest}
                        disabled={status === 'testing' || !apiKey}
                        className="flex-1 px-4 py-3 bg-stone-100 text-stone-700 font-bold rounded-xl hover:bg-stone-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                    >
                        연결 테스트
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={status === 'testing' || !apiKey}
                        className="flex-1 px-4 py-3 bg-stone-900 text-white font-bold rounded-xl hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg hover:shadow-xl text-sm"
                    >
                        저장하기
                    </button>
                </div>
                
                <p className="mt-6 text-center text-xs text-stone-400">
                    <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="underline hover:text-stone-600">Get API Key here</a>
                </p>
            </div>
        </div>
    );
};

export default ApiKeyModal;
