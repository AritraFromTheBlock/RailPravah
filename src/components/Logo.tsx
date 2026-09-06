import React from "react";

interface LogoProps {
  className?: string;
  size?: number;
}

export const Logo: React.FC<LogoProps> = ({
  className = "",
  size = 40,
}) => {
  return (
    <div className={`flex items-center inline-flex select-none ${className}`} style={{ display: "inline-flex", alignItems: "center" }}>
      <div style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center"
      }}>
        <img 
          src="/images/new_logo.png" 
          alt="RailPravah Logo" 
          style={{ height: size, width: 'auto', objectFit: 'contain', filter: 'drop-shadow(0px 0px 3px rgba(255, 255, 255, 0.8)) drop-shadow(0px 2px 10px rgba(255, 255, 255, 0.4))' }} 
        />
      </div>
    </div>
  );
};

export default Logo;
