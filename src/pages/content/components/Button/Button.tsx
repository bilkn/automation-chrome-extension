import React from "react";

interface IButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  children: JSX.Element[] | JSX.Element | string;
}

function Button(props: IButtonProps) {
  const { variant = "primary", children, ...rest } = props;
  const getStyleByVariant = {
    primary:
      "flex-shrink-0 justify-center items-center gap-2.5 pt-[0.4375rem] pb-[0.4375rem] pl-[2.125rem] pr-[2.125rem] h-14 rounded-lg bg-[#4361ee] save text-white text-center text-xl font-semibold leading-[140%]",
    secondary:
      "flex flex-shrink-0 justify-center items-center gap-2.5 pt-[0.4375rem] pb-[0.4375rem] pl-[2.125rem] pr-[2.125rem] h-14 rounded-lg border border-[#4361ee] bg-white reset text-[#4361ee] text-center text-xl font-semibold leading-[140%]",
  };

  return (
    <button className={`${getStyleByVariant[variant]}`} {...rest}>
      {children}
    </button>
  );
}

export default Button;
