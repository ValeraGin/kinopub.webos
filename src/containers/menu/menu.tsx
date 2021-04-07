import { useLocation } from 'react-router-dom';
import map from 'lodash/map';
import styled from 'styled-components';

import Link from 'components/link';
import { PATHS, generatePath } from 'routes';

const Nav = styled.nav`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const List = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;

const ListItem = styled.li<{ active: boolean }>`
  color: ${(props) => props.active && 'var(--main-color)'};
`;

const menuItems: {
  name: string;
  icon: string;
  href: string;
}[][] = [
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
  ],
  [
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
  ],
  [
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
  ],
];

type Props = {};

const Menu: React.FC<Props> = (props) => {
  const location = useLocation();

  return (
    <Nav {...props}>
      {map(menuItems, (list, idx) => (
        <List key={idx}>
          {map(list, (item) => (
            <ListItem key={item.href} active={location.pathname === item.href}>
              <Link href={item.href} icon={item.icon}>
                {item.name}
              </Link>
            </ListItem>
          ))}
        </List>
      ))}
    </Nav>
  );
};

export default Menu;
