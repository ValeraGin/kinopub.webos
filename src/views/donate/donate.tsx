import Seo from 'components/seo';
import Text from 'components/text';
import Title from 'components/title';

import { ReactComponent as Boosty } from './assets/boosty.svg';
import { ReactComponent as Patreon } from './assets/patreon.svg';
import { ReactComponent as Paypal } from './assets/paypal.svg';

const DonateView: React.FC = () => {
  const title = 'Поддержка проекта';

  return (
    <>
      <Seo title={title} />
      <Title title={title} />

      <div>Спасибо за желание поддержать проект</div>
      <div>Пожертвования сугубо добровольные и ни к чему не обязывают,</div>
      <div>Но помогают автору думать, что его работа важна</div>

      <div className="flex justify-around py-10">
        <div className="flex flex-col items-center w-1/4">
          <Boosty />
          <Text className="pt-2">boosty.to/adascal</Text>
        </div>
        <div className="flex flex-col items-center w-1/4">
          <Patreon />
          <Text className="pt-2">patreon.com/adascal</Text>
        </div>
        <div className="flex flex-col items-center w-1/4">
          <Paypal />
          <Text className="pt-2">paypal.me/adascal</Text>
        </div>
      </div>

      <div className="absolute bottom-4">
        <Text>Приложение не является официальным клиентом и разрабатывается силами одного человека для личного использования</Text>
      </div>
    </>
  );
};

export default DonateView;
