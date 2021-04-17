import { useEffect, useRef } from 'react';
import BaseInput, { InputProps } from '@enact/moonstone/Input';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: inline-flex;

  > div {
    width: 100%;
  }
`;

type Props = {
  autoFocus?: boolean;
} & InputProps;

const Input: React.FC<Props> = ({ autoFocus, ...props }) => {
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let frameId: number;

    if (autoFocus) {
      frameId = requestAnimationFrame(() => {
        wrapperRef.current?.querySelector('input')?.focus();
      });
    }

    return () => {
      if (frameId) {
        cancelAnimationFrame(frameId);
      }
    };
  }, [wrapperRef, autoFocus]);

  return (
    <Wrapper ref={wrapperRef}>
      <BaseInput {...props} />
    </Wrapper>
  );
};

export default Input;
