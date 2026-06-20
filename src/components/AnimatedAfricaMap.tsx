const AnimatedAfricaMap = () => {
  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '2rem'
    }}>
      
      {/* Wrapper for bouncing animation containing both map and SVG lines */}
      <div style={{ 
        position: 'relative', 
        maxWidth: '650px', 
        width: '100%', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        animation: 'bounceMap 5s ease-in-out infinite'
      }}>
        
        {/* User-provided Africa Map */}
        <img 
          src="/images/africa-map.png" 
          alt="Map of Africa" 
          style={{ 
            width: '100%', 
            height: 'auto', 
            filter: 'drop-shadow(0 0 30px rgba(30,136,229,0.4))'
          }} 
        />
        
        {/* SVG Overlay for dynamic lines and labels */}
        <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', overflow: 'visible', pointerEvents: 'none' }}>
           
           {/* Secondary Inter-country Connections */}
           {/* South Africa to Rwanda */}
           <path d="M 60% 85% L 64% 53%" stroke="rgba(30,136,229,0.4)" strokeWidth="1.5" strokeDasharray="5,5" strokeDashoffset="100" style={{ animation: 'drawLine 3s linear infinite' }} />
           {/* Rwanda to Egypt */}
           <path d="M 64% 53% L 65% 20%" stroke="rgba(30,136,229,0.4)" strokeWidth="1.5" strokeDasharray="5,5" strokeDashoffset="100" style={{ animation: 'drawLine 3s linear infinite reverse' }} />
           {/* Senegal to Rwanda */}
           <path d="M 18% 38% Q 40% 60% 64% 53%" stroke="rgba(30,136,229,0.4)" strokeWidth="1.5" strokeDasharray="5,5" fill="none" strokeDashoffset="100" style={{ animation: 'drawLine 4s linear infinite' }} />
           {/* Senegal to South Africa */}
           <path d="M 18% 38% Q 30% 70% 60% 85%" stroke="rgba(30,136,229,0.4)" strokeWidth="1.5" strokeDasharray="5,5" fill="none" strokeDashoffset="100" style={{ animation: 'drawLine 4s linear infinite reverse' }} />

           {/* Center Origin Point */}
           <circle cx="50%" cy="50%" r="5" fill="#1e88e5">
             <animate attributeName="r" values="5;8;5" dur="2s" repeatCount="indefinite" />
             <animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite" />
           </circle>
           
           {/* Primary Hub-and-Spoke Lines */}
           {/* South Africa */}
           <path d="M 50% 50% L 60% 85%" stroke="#1e88e5" strokeWidth="2" strokeDasharray="1000" strokeDashoffset="1000" style={{ animation: 'drawLine 2s ease-out forwards 0.5s' }} />
           <circle cx="60%" cy="85%" r="4" fill="#1e88e5" style={{ opacity: 0, animation: 'fadeInScale 0.5s ease-out forwards 2s' }}>
             <animate attributeName="r" values="4;6;4" dur="2s" repeatCount="indefinite" begin="2s" />
           </circle>
           <g style={{ opacity: 0, animation: 'fadeInScale 0.5s ease-out forwards 2s' }}>
             <rect x="62%" y="82%" width="90" height="24" rx="4" fill="rgba(255,255,255,0.95)" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.15))" />
             <text x="62%" y="82%" dx="8" dy="16" fontSize="12" fontWeight="600" fill="#1e88e5">South Africa</text>
           </g>

           {/* Senegal */}
           <path d="M 50% 50% L 18% 38%" stroke="#1e88e5" strokeWidth="2" strokeDasharray="1000" strokeDashoffset="1000" style={{ animation: 'drawLine 2s ease-out forwards 0.8s' }} />
           <circle cx="18%" cy="38%" r="4" fill="#1e88e5" style={{ opacity: 0, animation: 'fadeInScale 0.5s ease-out forwards 2.3s' }}>
             <animate attributeName="r" values="4;6;4" dur="2s" repeatCount="indefinite" begin="2.3s" />
           </circle>
           <g style={{ opacity: 0, animation: 'fadeInScale 0.5s ease-out forwards 2.3s' }}>
             <rect x="1%" y="36%" width="65" height="24" rx="4" fill="rgba(255,255,255,0.95)" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.15))" />
             <text x="1%" y="36%" dx="8" dy="16" fontSize="12" fontWeight="600" fill="#1e88e5">Senegal</text>
           </g>

           {/* Rwanda */}
           <path d="M 50% 50% L 64% 53%" stroke="#1e88e5" strokeWidth="2" strokeDasharray="1000" strokeDashoffset="1000" style={{ animation: 'drawLine 2s ease-out forwards 1.1s' }} />
           <circle cx="64%" cy="53%" r="4" fill="#1e88e5" style={{ opacity: 0, animation: 'fadeInScale 0.5s ease-out forwards 2.6s' }}>
             <animate attributeName="r" values="4;6;4" dur="2s" repeatCount="indefinite" begin="2.6s" />
           </circle>
           <g style={{ opacity: 0, animation: 'fadeInScale 0.5s ease-out forwards 2.6s' }}>
             <rect x="66%" y="51%" width="65" height="24" rx="4" fill="rgba(255,255,255,0.95)" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.15))" />
             <text x="66%" y="51%" dx="8" dy="16" fontSize="12" fontWeight="600" fill="#1e88e5">Rwanda</text>
           </g>

           {/* Egypt */}
           <path d="M 50% 50% L 65% 20%" stroke="#1e88e5" strokeWidth="2" strokeDasharray="1000" strokeDashoffset="1000" style={{ animation: 'drawLine 2s ease-out forwards 1.4s' }} />
           <circle cx="65%" cy="20%" r="4" fill="#1e88e5" style={{ opacity: 0, animation: 'fadeInScale 0.5s ease-out forwards 2.9s' }}>
             <animate attributeName="r" values="4;6;4" dur="2s" repeatCount="indefinite" begin="2.9s" />
           </circle>
           <g style={{ opacity: 0, animation: 'fadeInScale 0.5s ease-out forwards 2.9s' }}>
             <rect x="67%" y="18%" width="50" height="24" rx="4" fill="rgba(255,255,255,0.95)" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.15))" />
             <text x="67%" y="18%" dx="8" dy="16" fontSize="12" fontWeight="600" fill="#1e88e5">Egypt</text>
           </g>
        </svg>

      </div>

    </div>
  );
};

export default AnimatedAfricaMap;
