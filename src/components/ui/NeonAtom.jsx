export default function NeonAtom({ size = 180, className = "", text = "", fill = false }) {
  const s = size;
  const orbitSize = s * 0.89;
  const coreSize = s * 0.2;
  const particleSize = s * 0.089;

  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${fill ? "min-h-[50vh] w-full" : ""} ${className}`}>
      <style>{`
        @keyframes atom-float {
          0% { transform: translateY(-${s*0.083}px) rotateX(5deg) rotateY(5deg); }
          100% { transform: translateY(${s*0.083}px) rotateX(-5deg) rotateY(-5deg); }
        }
        @keyframes pulse-core {
          0% { transform: scale(0.9); box-shadow: 0 0 ${s*0.083}px #ff00ff, 0 0 ${s*0.167}px #8a2be2, 0 0 ${s*0.25}px #0040ff; }
          100% { transform: scale(1.1); box-shadow: 0 0 ${s*0.139}px #ff00ff, 0 0 ${s*0.278}px #8a2be2, 0 0 ${s*0.444}px #00ffff; }
        }
        @keyframes orbit1 { 0% { transform: rotateY(70deg) rotateZ(20deg); } 100% { transform: rotateY(70deg) rotateZ(380deg); } }
        @keyframes particle1 { 0% { transform: rotateZ(-20deg) rotateY(-70deg); } 100% { transform: rotateZ(-380deg) rotateY(-70deg); } }
        @keyframes orbit2 { 0% { transform: rotateY(60deg) rotateX(60deg) rotateZ(-30deg); } 100% { transform: rotateY(60deg) rotateX(60deg) rotateZ(330deg); } }
        @keyframes particle2 { 0% { transform: rotateZ(30deg) rotateX(-60deg) rotateY(-60deg); } 100% { transform: rotateZ(-330deg) rotateX(-60deg) rotateY(-60deg); } }
        @keyframes orbit3 { 0% { transform: rotateY(-60deg) rotateX(60deg) rotateZ(100deg); } 100% { transform: rotateY(-60deg) rotateX(60deg) rotateZ(460deg); } }
        @keyframes particle3 { 0% { transform: rotateZ(-100deg) rotateX(-60deg) rotateY(60deg); } 100% { transform: rotateZ(-460deg) rotateX(-60deg) rotateY(60deg); } }
      `}</style>
      <div
        className="relative"
        style={{
          width: s,
          height: s,
          perspective: 800,
          transformStyle: "preserve-3d",
          animation: `atom-float 3s ease-in-out infinite alternate`,
        }}
      >
        <div
          className="absolute inset-0 m-auto rounded-full z-10"
          style={{
            width: coreSize,
            height: coreSize,
            background: "radial-gradient(circle at 30% 30%, #ff00ff, #8a2be2)",
            animation: "pulse-core 1.5s ease-in-out infinite alternate",
          }}
        />

        {[
          {
            color: "#00ffff",
            shadow: "#00bfff",
            orbitTransform: "rotateY(70deg) rotateZ(20deg)",
            orbitAnim: "orbit1 3s linear infinite",
            particleTransform: "rotateZ(-20deg) rotateY(-70deg)",
            particleAnim: "particle1 3s linear infinite",
          },
          {
            color: "#ff00ff",
            shadow: "#8a2be2",
            orbitTransform: "rotateY(60deg) rotateX(60deg) rotateZ(-30deg)",
            orbitAnim: "orbit2 3s linear infinite",
            particleTransform: "rotateZ(30deg) rotateX(-60deg) rotateY(-60deg)",
            particleAnim: "particle2 3s linear infinite",
          },
          {
            color: "#00bfff",
            shadow: "#0040ff",
            orbitTransform: "rotateY(-60deg) rotateX(60deg) rotateZ(100deg)",
            orbitAnim: "orbit3 3s linear infinite",
            particleTransform: "rotateZ(-100deg) rotateX(-60deg) rotateY(60deg)",
            particleAnim: "particle3 3s linear infinite",
          },
        ].map((ring, i) => (
          <div
            key={i}
            className="absolute inset-0 m-auto rounded-full border border-white/5"
            style={{
              width: orbitSize,
              height: orbitSize,
              borderColor: `${ring.color}4D`,
              boxShadow: `inset 0 0 ${s*0.083}px ${ring.color}33, 0 0 ${s*0.083}px ${ring.color}33`,
              transformStyle: "preserve-3d",
              transform: ring.orbitTransform,
              animation: ring.orbitAnim,
            }}
          >
            <div
              className="absolute rounded-full z-20"
              style={{
                top: -particleSize / 2,
                left: 0,
                right: 0,
                margin: "0 auto",
                width: particleSize,
                height: particleSize,
                transformOrigin: "50% 50% 0",
                background: ring.color,
                boxShadow: `0 0 ${s*0.083}px ${ring.color}, 0 0 ${s*0.139}px ${ring.shadow}, 0 0 ${s*0.194}px #fff`,
                transform: ring.particleTransform,
                animation: ring.particleAnim,
              }}
            />
          </div>
        ))}
      </div>
      {text && (
        <span className="text-sm text-gray-400 animate-pulse">{text}</span>
      )}
    </div>
  );
}
