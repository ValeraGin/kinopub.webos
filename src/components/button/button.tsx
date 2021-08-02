import { useEffect, useRef } from 'react';
import EnactButton, { ButtonProps } from '@enact/moonstone/Button';
import styled from 'styled-components';

import Icon from 'components/icon';

const Wrapper = styled.div`
  display: inline-flex;

  > div {
    width: 100%;
  }
`;

const StyledButton = styled(EnactButton)`
  color: inherit;
  text-decoration: none;
`;

const ButtonInner = styled.div<{ iconOnly?: boolean }>`
  display: flex;
  align-items: center;
  color: inherit;
  text-decoration: none;

  ${Icon} {
    margin-right: ${(props) => !props.iconOnly && '0.5rem'};
  }
`;

type Props = {
  icon?: string;
  iconOnly?: boolean;
  autoFocus?: boolean;
  onClick?: React.MouseEventHandler;
} & ButtonProps;

const Button: React.FC<Props> = ({ icon, iconOnly, children, autoFocus, ...props }) => {
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let frameId: number;

    if (autoFocus) {
      frameId = requestAnimationFrame(() => {
        wrapperRef.current?.querySelector<HTMLDivElement>('[role="button"]')?.focus();
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
      <StyledButton {...props}>
        <ButtonInner iconOnly={iconOnly}>
          {icon && <Icon name={icon} />}
          {!iconOnly && children}
        </ButtonInner>
      </StyledButton>
    </Wrapper>
  );
};

export default Button;
