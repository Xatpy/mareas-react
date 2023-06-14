import React from "react";

type Prop = {
  text: string;
  active: boolean;
};

export const Tide: React.FC<Prop> = ({ text, active }: Prop) => {
  return (
    <>
      <span>
        {text} - {active ? "true" : "false"}
      </span>
    </>
  );
};
