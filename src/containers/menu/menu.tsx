import { useLocation } from 'react-router-dom';
import map from 'lodash/map';

import Link from 'components/link';
import { PATHS, generatePath } from 'routes';

type MenuItem = {
  name: string;
  icon: string;
  href: string;
};

const menuItems: (MenuItem | null)[][] = [
  [
    {
      name: 'Главная',
      icon: 'home',
      href: PATHS.Home,
    },
    {
      name: 'Поиск',
      icon: 'search',
      href: PATHS.Search,
    },
    {
      name: 'Я смотрю',
      icon: 'notifications_active',
      href: PATHS.Watching,
    },
    {
      name: 'Закладки',
      icon: 'bookmark',
      href: PATHS.Bookmarks,
    },
    {
      name: 'Подборки',
      icon: 'list',
      href: PATHS.Collections,
    },
  ].filter(Boolean),
  [
    {
      name: 'Новинки',
      icon: 'new_releases',
      href: generatePath(PATHS.Releases),
    },
    {
      name: 'Фильмы',
      icon: 'movie',
      href: generatePath(PATHS.Category, { categoryId: 'movie' }),
    },
    {
      name: 'Сериалы',
      icon: 'tv',
      href: generatePath(PATHS.Category, { categoryId: 'serial' }),
    },
    {
      name: 'Мультфильмы',
      icon: 'toys',
      href: generatePath(PATHS.Genre, { genreId: '23' }),
    },
    {
      name: 'Аниме',
      icon: 'auto_awesome',
      href: generatePath(PATHS.Genre, { genreId: '25' }),
    },
    {
      name: 'Концерты',
      icon: 'library_music',
      href: generatePath(PATHS.Category, { categoryId: 'concert' }),
    },
    {
      name: 'Докуфильмы',
      icon: 'archive',
      href: generatePath(PATHS.Category, { categoryId: 'documovie' }),
    },
    {
      name: 'Докусериалы',
      icon: 'description',
      href: generatePath(PATHS.Category, { categoryId: 'docuserial' }),
    },
    {
      name: 'ТВ Шоу',
      icon: 'live_tv',
      href: generatePath(PATHS.Category, { categoryId: 'tvshow' }),
    },
    {
      name: 'Спорт',
      icon: 'sports_soccer',
      href: generatePath(PATHS.Channels),
    },
  ].filter(Boolean),
  [
    process.env.REACT_APP_HIDE_DONATE_MENU === 'true'
      ? null
      : {
          name: 'Донат',
          icon: 'favorite',
          href: PATHS.Donate,
        },
    {
      name: 'Спидтест',
      icon: 'speed',
      href: PATHS.Speed,
    },
    {
      name: 'Настройки',
      icon: 'settings',
      href: PATHS.Settings,
    },
  ].filter(Boolean),
];

type Props = {};

const Menu: React.FC<Props> = (props) => {
  const location = useLocation();

  return (
    <nav className="group h-screen flex flex-col justify-between" {...props}>
      {map(menuItems, (list, idx) => (
        <ul key={idx}>
          {map(list, (item: MenuItem) => (
            <li key={item.href}>
              <Link href={item.href} icon={item.icon} active={location.pathname.startsWith(item.href)} className="px-2 py-1 rounded-r">
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      ))}
    </nav>
  );
};

export default Menu;
