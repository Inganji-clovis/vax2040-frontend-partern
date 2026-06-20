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
      {/* User-provided Africa Map */}
      <img 
        src="/images/africa-map.png" 
        alt="Map of Africa" 
        style={{ 
          maxWidth: '450px', 
          width: '100%', 
          height: 'auto', 
          animation: 'float 6s ease-in-out infinite',
          filter: 'drop-shadow(0 0 30px rgba(30,136,229,0.4))'
        }} 
      />

      {/* Floating Cards */}
      <div style={{ position: 'absolute', top: '10%', right: '5%', background: 'rgba(255,255,255,0.95)', borderRadius: '12px', padding: '12px 16px', boxShadow: '0 4px 16px rgba(30,136,229,0.15)', display: 'flex', alignItems: 'center', gap: '8px', animation: 'float 4s ease-in-out 0.2s infinite' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#1e88e5' }}>54+ Countries</span>
      </div>
      <div style={{ position: 'absolute', bottom: '15%', left: '5%', background: 'rgba(255,255,255,0.95)', borderRadius: '12px', padding: '12px 16px', boxShadow: '0 4px 16px rgba(30,136,229,0.15)', display: 'flex', alignItems: 'center', gap: '8px', animation: 'float 4s ease-in-out 0.8s infinite' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#1e88e5' }}>60% 2040 Target</span>
      </div>
      <div style={{ position: 'absolute', top: '45%', right: '10%', background: 'rgba(255,255,255,0.95)', borderRadius: '12px', padding: '12px 16px', boxShadow: '0 4px 16px rgba(30,136,229,0.15)', display: 'flex', alignItems: 'center', gap: '8px', animation: 'float 4s ease-in-out 1.2s infinite' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#1e88e5' }}>3 Data Pathways</span>
      </div>
    </div>
  );
};

export default AnimatedAfricaMap;
