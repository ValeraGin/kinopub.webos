import cx from 'classnames';
import styled from 'styled-components';

import './styles.css';

type Props = {
  name: string;
};

const ICONS_MAP = {
  notifications_active: <>&#xe7f7;</>,
  new_releases: <>&#xe031;</>,
  library_music: <>&#xe030;</>,
  live_tv: <>&#xe639;</>,
  play_circle_outline: <>&#xe039;</>,
  sports_soccer: <>&#xea2f;</>,
};

const Icon = styled.i.attrs<Props>(({ name, className, ...props }) => ({
  ...props,
  className: cx(`material-icons`, className),
  children: ICONS_MAP[name] || name,
}))<Props>``;

export default Icon;
