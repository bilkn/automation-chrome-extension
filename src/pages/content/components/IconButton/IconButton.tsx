import React from "react";

interface IIconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: JSX.Element[] | JSX.Element | string;
}

function IconButton(props: IIconButtonProps) {
  const { children, className = "", ...rest } = props;
  return (
    <button
      {...rest}
      className={`${className} flex items-center text-[#80858E] justify-center bg-gray-300 h-[36px] w-[36px] rounded-full`}
    >
      {children}
    </button>
  );
}

export default IconButton;
