import { useEffect, useState } from "react";
import { cn } from "../../lib/utils";

export const Meteors = ({ number = 20, ...props }) => {
  const [meteorStyles, setMeteorStyles] = useState([]);

  useEffect(() => {
    const styles = [...new Array(number)].map(() => ({
      top: -5,
      left: Math.floor(Math.random() * window.innerWidth) + "px",
      animationDelay: Math.random() * 1 + 0.2 + "s",
      animationDuration: Math.floor(Math.random() * 40 + 2) + "s",
    }));
    setMeteorStyles(styles);
  }, [number]);

  return (
    <>
      {[...meteorStyles].map((style, idx) => (
        // Meteor Head
        <span
          key={idx}
          className={cn(
            "pointer-events-none absolute left-1/2 top-1/2 size-[1.2px] rotate-[215deg] animate-meteor rounded-full bg-slate-500 shadow-[0_0_0_1px_#ffffff10]"
          )}
          style={{
            ...style,
            // top: 0, // Start from the very top
            // height: "100vh", // Cover full screen height
          }}
          {...props}
        >
          {/* Meteor Tail */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[1.4px] w-[70px] -translate-y-1/2 bg-gradient-to-r from-slate-500 to-transparent" />
        </span>
      ))}
    </>
  );
};
