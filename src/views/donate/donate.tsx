import map from 'lodash/map';

import Seo from 'components/seo';
import Text from 'components/text';
import Title from 'components/title';

import { ReactComponent as Boosty } from './assets/boosty.svg';
import { ReactComponent as Patreon } from './assets/patreon.svg';
import { ReactComponent as PayPal } from './assets/paypal.svg';

const DONATE_TYPES = [
  {
    key: 'boosty',
    icon: Boosty,
    link: 'boosty.to/adascal',
  },
  {
    key: 'patreon',
    icon: Patreon,
    link: 'patreon.com/adascal',
  },
  {
    key: 'paypal',
    icon: PayPal,
    link: 'paypal.me/adascal',
  },
];

const DonateView: React.FC = () => {
  const title = 'Поддержка проекта';

  return (
    <>
      <Seo title={title} />
      <Title>{title}</Title>

      <div>Спасибо за желание поддержать проект</div>
      <div>Пожертвования сугубо добровольные и ни к чему не обязывают,</div>
      <div>Но помогают автору думать, что его работа важна</div>

      <div className="flex justify-around py-10">
        {map(DONATE_TYPES, ({ key, link, icon: Icon }) => (
          <div key={key} className="flex flex-col items-center w-1/4">
            <Icon className="h-40" />
            <Text className="pt-2">{link}</Text>
          </div>
        ))}
      </div>

      <Text>Так же можно сделать перевод на кошельки:</Text>
      <Text>
        Payeer - <b>P11710891</b>
      </Text>
      <Text>
        FKWallet - <b>F100864127</b>
      </Text>

      <div className="absolute bottom-4">
        <Text>Приложение не является официальным клиентом и разрабатывается силами одного человека для личного использования</Text>
      </div>
    </>
  );
};

export default DonateView;
