import { useEffect, useRef, useCallback } from 'react';

interface Props {
  callback: () => void;
  isLoading: boolean;
  isNext: boolean;
}

const useInfiniteScroll = ({ callback, isLoading, isNext }: Props) => {
  const obsRef = useRef(null);

  const handleIntersect = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting && !isLoading && isNext) {
        callback();
      }
    },
    [callback, isLoading, isNext]
  );

  useEffect(() => {
    const intersectionObserver = new IntersectionObserver(handleIntersect, {
      threshold: 1,
    });

    if (obsRef.current) intersectionObserver.observe(obsRef.current);

    return () => {
      intersectionObserver.disconnect();
    };
  }, [handleIntersect]);

  return obsRef;
};

export default useInfiniteScroll;
