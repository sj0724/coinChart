import { ReactNode } from 'react';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  color: 'red' | 'green';
  children: ReactNode;
}

export default function Button({ color, children, ...props }: Props) {
  const buttonColor =
    color === 'red'
      ? 'bg-red-500 hover:bg-red-500/50 active:bg-red-700'
      : 'bg-green-500 hover:bg-green-500/50 active:bg-green-700';
  return (
    <button
      type='button'
      className={`w-full rounded-md p-1 text-white font-bold ${buttonColor}`}
      {...props}
    >
      {children}
    </button>
  );
}
