import EnactButton, { ButtonProps } from '@enact/moonstone/Button';
import styled from 'styled-components';

import Icon from '../icon';

const StyledButton = styled(EnactButton)`
  color: inherit;
  text-decoration: none;
`;

const ButtonInner = styled.div<{ iconOnly: boolean }>`
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
  onClick?: React.MouseEventHandler;
} & ButtonProps;

const Button: React.FC<Props> = ({ icon, iconOnly, children, ...props }) => {
  return (
    <StyledButton {...props}>
      <ButtonInner iconOnly={iconOnly}>
        {icon && <Icon name={icon} />}
        {!iconOnly && children}
      </ButtonInner>
    </StyledButton>
  );
};

export default Button;
