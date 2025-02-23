interface Props {
  text: string;
  type: 'red' | 'green';
}

export default function Button({ text, type }: Props) {
  const buttonColor =
    type === 'red'
      ? 'bg-red-500 hover:bg-red-500/50 active:bg-red-700'
      : 'bg-green-500 hover:bg-green-500/50 active:bg-green-700';
  return (
    <button
      type='button'
      className={`w-full rounded-md p-1 text-white font-bold ${buttonColor}`}
    >
      {text}
    </button>
  );
}
