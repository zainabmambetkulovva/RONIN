import React from "react";

export function RollingLoader() {
  return (
    <div className="rolling-loader-container">
      <div className="rolling-loader"></div>
      <style jsx>{`
        .rolling-loader-container {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100px;
        }

        .rolling-loader {
          position: relative;
          font-size: 16px;
          width: 5.5em;
          height: 5.5em;
        }

        .rolling-loader:before {
          content: '';
          position: absolute;
          transform: translate(-50%, -50%) rotate(45deg);
          height: 100%;
          width: 4px;
          background: linear-gradient(180deg, #3b82f6, #8b5cf6);
          left: 50%;
          top: 50%;
          box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
        }

        .rolling-loader:after {
          content: '';
          position: absolute;
          left: 0.2em;
          bottom: 0.18em;
          width: 1em;
          height: 1em;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          border-radius: 15%;
          box-shadow: 0 0 20px rgba(59, 130, 246, 0.6);
          animation: rollingRock 2.5s cubic-bezier(.79, 0, .47, .97) infinite;
        }

        @keyframes rollingRock {
          0% {
            transform: translate(0, -1em) rotate(-45deg);
          }
          5% {
            transform: translate(0, -1em) rotate(-50deg);
          }
          20% {
            transform: translate(1em, -2em) rotate(47deg);
          }
          25% {
            transform: translate(1em, -2em) rotate(45deg);
          }
          30% {
            transform: translate(1em, -2em) rotate(40deg);
          }
          45% {
            transform: translate(2em, -3em) rotate(137deg);
          }
          50% {
            transform: translate(2em, -3em) rotate(135deg);
          }
          55% {
            transform: translate(2em, -3em) rotate(130deg);
          }
          70% {
            transform: translate(3em, -4em) rotate(217deg);
          }
          75% {
            transform: translate(3em, -4em) rotate(220deg);
          }
          100% {
            transform: translate(0, -1em) rotate(-225deg);
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
      className="min-h-screen flex flex-col items-center justify-center" 
      style={{ background: "#03030a" }}
    >
      <RollingLoader />
      {text && (
        <p className="text-gray-400 mt-6 text-sm sm:text-base animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
}
