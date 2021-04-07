import map from 'lodash/map';
import styled from 'styled-components';

import { Item, Season } from 'api';
import SeasonItem from 'components/seasonItem';
import Text from 'components/text';

const Wrapper = styled.div`
  padding: 2rem;
`;

type Props = {
  item: Item;
  seasons?: Season[];
};

const SeasonsList: React.FC<Props> = ({ item, seasons }) => {
  if (!seasons?.length) {
    return null;
  }

  return (
    <Wrapper>
      <Text>Список сезонов</Text>
      {map(seasons, (season) => (
        <SeasonItem key={season.id} item={item} season={season} />
      ))}
    </Wrapper>
  );
};

export default SeasonsList;
