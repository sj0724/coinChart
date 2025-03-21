import KakaoButton from '@/components/kakaoButton';

export default function Home() {
  return (
    <div className='flex flex-col items-center justify-center h-screen'>
      <div className='max-w-[400px] flex flex-col items-center justify-between w-full rounded-lg bg-white p-6 shadow-md'>
        <div className='flex flex-col items-center'>
          <h1 className='font-bold text-2xl mb-4 text-gray-800'>
            가상 화폐 모의 투자
          </h1>
          <p className='text-sm text-gray-600 text-center mb-6'>
            내 돈으로 하기 무서운 예비 투자자들을 위한 모의투자! <br />
            원하는 자산으로 가상 투자를 시작해보세요.
          </p>
        </div>
        <KakaoButton />
      </div>
    </div>
  );
}
