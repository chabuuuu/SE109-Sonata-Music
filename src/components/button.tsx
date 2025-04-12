import React from "react";

const Button = ({data}:{data:string}) => {
  return (
    <button className="bg-white text-gray-900 font-medium rounded-full px-4 py-1 hover:bg-stone-400">{data}</button>
  );
};

export default Button;
