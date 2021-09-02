import cx from 'classnames';

import './styles.css';

const ICONS_MAP = {
  notifications_active: <>&#xe7f7;</>,
  new_releases: <>&#xe031;</>,
  library_music: <>&#xe030;</>,
  live_tv: <>&#xe639;</>,
  play_arrow: <>&#xe037;</>,
  play_circle_outline: <>&#xe039;</>,
  sports_soccer: <>&#xea2f;</>,
  expand_more: <>&#xe5cf;</>,
  expand_less: <>&#xe5ce;</>,
  emoji_emotions: <>&#xea22;</>,
  auto_awesome: <>&#xe65f;</>,
  visibility_off: <>&#xe8f5;</>,
  closed_caption: <>&#xe01c;</>,
  thumb_up: <>&#xe8dc;</>,
  graphic_eq: <>&#xe1b8;</>,
  filter_list: <>&#xe152;</>,
  arrow_back: <>&#xe5c4;</>,
} as const;

export type IconName = keyof typeof ICONS_MAP;

type Props = {
  name: IconName | string;
} & React.HTMLAttributes<HTMLSpanElement>;

const Icon: React.FC<Props> = ({ name, className, ...props }) => {
  return (
    <i {...props} className={cx(`material-icons text-center`, className)}>
      {ICONS_MAP[name as IconName] || name}
    </i>
  );
};

export default Icon;
