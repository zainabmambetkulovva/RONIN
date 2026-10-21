import React from "react";
import Image from "next/image";

export function RollingLoader() {
  return (
    <div className="rolling-loader-container">
      {/* RONIN Logo с пульсацией */}
      <div className="logo-pulse">
        <Image
          src="/logo-new.png"
          alt="RONIN"
          width={60}
          height={60}
          className="logo-image"
          priority
        />
      </div>
      
      {/* Вращающееся кольцо вокруг логотипа */}
      <div className="spinner-ring"></div>
      
      <style jsx>{`
        .rolling-loader-container {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 80px;
          width: 90px;
          height: 90px;
          margin: 0 auto;
        }

        .logo-pulse {
          position: absolute;
          z-index: 2;
          animation: pulse 2s ease-in-out infinite;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .logo-image {
          filter: drop-shadow(0 0 15px rgba(139, 92, 246, 0.8));
        }

        .spinner-ring {
          position: absolute;
          width: 75px;
          height: 75px;
          border: 3px solid transparent;
          border-top-color: #3b82f6;
          border-right-color: #8b5cf6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          box-shadow: 
            0 0 15px rgba(59, 130, 246, 0.4),
            inset 0 0 15px rgba(139, 92, 246, 0.2);
        }

        @media (min-width: 768px) {
          .rolling-loader-container {
            min-height: 100px;
            width: 120px;
            height: 120px;
          }
          
          .logo-pulse img {
            width: 80px !important;
            height: 80px !important;
          }
          
          .spinner-ring {
            width: 100px;
            height: 100px;
          }
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(0.95);
          }
        }
      `}</style>
    </div>
  );
}

// Компонент для полноэкранной загрузки
export function FullPageLoader({ text }: { text?: string }) {
  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center gap-6" 
      style={{ background: "#03030a" }}
    >
      <RollingLoader />
      {text && (
        <div className="text-center">
          <p className="text-gray-400 text-base sm:text-lg font-medium animate-pulse">
            {text}
          </p>
          <p className="text-gray-500 text-sm mt-2">
            RONIN Gaming Club
          </p>
        </div>
      )}
    </div>
  );
}

