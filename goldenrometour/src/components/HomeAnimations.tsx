'use client';

export default function HomeAnimations() {
  return (
    <style jsx global>{`
      @keyframes kenburns {
        0% { transform: scale(1); }
        100% { transform: scale(1.05); }
      }
      @keyframes fadeUp {
        0% { opacity: 0; transform: translateY(30px); }
        100% { opacity: 1; transform: translateY(0); }
      }
      @keyframes slideUp {
        0% { opacity: 0; transform: translateY(60px); }
        100% { opacity: 1; transform: translateY(0); }
      }
      @keyframes drift {
        0% { background-position: 0 0; }
        100% { background-position: 1000px 1000px; }
      }
      @keyframes shimmer {
        0% { background-position: -200% center; }
        100% { background-position: 200% center; }
      }
    `}</style>
  );
}
