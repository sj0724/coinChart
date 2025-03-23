'use client';

interface Props {
  onChange: (value: string) => void;
}

export default function SymbolSearchBar({ onChange }: Props) {
  return (
    <div>
      <input
        placeholder='Search'
        className='px-3 py-1 border w-full rounded-md'
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
