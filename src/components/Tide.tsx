import React from "react";

type Prop = {
  text: string;
  active: boolean;
  height: number;
};

export const Tide: React.FC<Prop> = ({ text, active, height }: Prop) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: `${height}vh`,
      }}
    >
      <span>
        {text} - {active ? "true" : "false"}
      </span>
    </div>
  );
};
