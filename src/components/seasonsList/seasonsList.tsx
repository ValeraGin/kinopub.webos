import map from 'lodash/map';

import { Item, Season } from 'api';
import SeasonItem from 'components/seasonItem';
import Text from 'components/text';

type Props = {
  item: Item;
  seasons?: Season[];
};

const SeasonsList: React.FC<Props> = ({ item, seasons }) => {
  if (!seasons?.length) {
    return null;
  }

  return (
    <div className="p-8">
      <Text>Список сезонов</Text>

      {map(seasons, (season) => (
        <SeasonItem key={season.id} item={item} season={season} />
      ))}
    </div>
  );
};

export default SeasonsList;
