import { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import Item from '@enact/moonstone/Item';
import styled from 'styled-components';

import Icon from 'components/icon';

const StyledLink = styled(Item)`
  color: inherit;
  text-decoration: none;
`;

const LinkInner = styled.div`
  display: flex;
  align-items: center;
  color: inherit;
  text-decoration: none;

  ${Icon} {
    margin-right: 0.5rem;
  }
`;

type Props = {
  href: string;
  icon?: string;
  iconOnly?: string;
  onClick?: () => void;
};

const Link: React.FC<Props> = ({ href, children, icon, iconOnly, onClick, ...props }) => {
  const history = useHistory();
  const handleOnClick = useCallback(() => {
    history.push(href);
    onClick?.();
  }, [href, onClick, history]);

  return (
    <StyledLink {...props} onClick={handleOnClick}>
      <LinkInner>
        {icon && <Icon name={icon} />}
        {!iconOnly && children}
      </LinkInner>
    </StyledLink>
  );
};

export default Link;
