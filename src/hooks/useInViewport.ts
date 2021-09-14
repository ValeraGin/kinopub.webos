import { useCallback, useEffect, useRef, useState } from 'react';
import { findDOMNode } from 'react-dom';

type Props = {
  onEnterViewport?: () => void;
  onLeaveViewport?: () => void;
};

const useInViewport = (
  target: React.MutableRefObject<React.ReactInstance | null | undefined>,
  props: Props,
  options?: IntersectionObserverInit,
  config = { disconnectOnLeave: false },
) => {
  const { onEnterViewport, onLeaveViewport } = props;
  const [, forceUpdate] = useState();

  const observer = useRef<IntersectionObserver | null>(null);

  const inViewportRef = useRef(false);
  const intersected = useRef(false);

  const enterCountRef = useRef(0);
  const leaveCountRef = useRef(0);

  const startObserver = useCallback(() => {
    if (target.current && observer.current) {
      const node = findDOMNode(target.current) as Element;
      if (node) {
        observer.current.observe(node);
      }
    }
  }, [target, observer]);

  const stopObserver = useCallback(() => {
    if (target.current && observer.current) {
      const node = findDOMNode(target.current) as Element;
      if (node) {
        observer.current.unobserve(node);
        observer.current.disconnect();
        observer.current = null;
      }
    }
  }, [target, observer]);

  const handleIntersection = useCallback(
    (entries) => {
      const entry = entries[0] || {};
      const { isIntersecting, intersectionRatio } = entry;
      const isInViewport = typeof isIntersecting !== 'undefined' ? isIntersecting : intersectionRatio > 0;

      // enter
      if (!intersected.current && isInViewport) {
        intersected.current = true;

        onEnterViewport?.();

        enterCountRef.current += 1;
        inViewportRef.current = isInViewport;

        forceUpdate(isInViewport);

        return;
      }

      // leave
      if (intersected.current && !isInViewport) {
        intersected.current = false;

        onLeaveViewport?.();

        if (config.disconnectOnLeave && observer.current) {
          // disconnect obsever on leave
          observer.current.disconnect();
        }

        leaveCountRef.current += 1;
        inViewportRef.current = isInViewport;

        forceUpdate(isInViewport);
      }
    },
    [observer, config.disconnectOnLeave, onEnterViewport, onLeaveViewport],
  );

  const initIntersectionObserver = useCallback(() => {
    if (!observer.current) {
      observer.current = new IntersectionObserver(handleIntersection, options);
    }
  }, [observer, options, handleIntersection]);

  useEffect(() => {
    initIntersectionObserver();
    startObserver();

    return () => {
      stopObserver();
    };
  }, [initIntersectionObserver, startObserver, stopObserver]);

  return {
    inViewport: inViewportRef.current,
    enterCount: enterCountRef.current,
    leaveCount: leaveCountRef.current,
  };
};

export default useInViewport;
