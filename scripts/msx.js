const fs = require('fs');
const path = require('path');
const { version } = require('../package.json');

const createMSXConfig = (url) => ({
  name: 'Kino Station X',
  extension: `Версия ${version}`,
  version: `${version}`,
  parameter: 'content:{PREFIX}{SERVER}/msx/start.json',
  action: '[settings:validate_links:0|home]',
  dictionary: 'http://fxml.ru/msx/lang/ru.json',
  pages: [
    {
      items: [
        {
          id: 'description',
          type: 'space',
          layout: '5,0,5,5',
          text: '',
        },
        {
          type: 'control',
          layout: '0,0,5,1',
          image: `${url}/icon-large.png`,
          label: 'KinoPub',
          action: `link:${url}`,
          selection: {
            important: true,
            action: 'update:content:description',
            data: {
              text: ['{txt:msx-white: KinoPub} — Приложения позволяет смотреть сериалы, фильмы, мультфильмы и т. д. с сайта kino.pub.'],
            },
          },
        },
        {
          type: 'control',
          layout: '0,1,5,1',
          image: 'http://msxplayer.ru/assets/images/features/apps.png',
          label: 'Media Station X Player',
          action: 'content:request:interaction:init@http://msxplayer.ru/plugins/links.html',
          selection: {
            important: true,
            action: 'update:content:description',
            data: {
              text: ['{txt:msx-white: Media Station X Player} — В этом плейлисте собраны все самые лучшие ссылки для твоего телевизора'],
            },
          },
        },
      ],
    },
  ],
});

if (process.env.URL) {
  const msxFolder = path.resolve(__dirname, '../build/msx');
  const msxConfig = createMSXConfig(process.env.URL);

  if (!fs.existsSync(msxFolder)) {
    fs.mkdirSync(msxFolder, { recursive: true });
  }

  fs.writeFileSync(`${msxFolder}/start.json`, JSON.stringify(msxConfig, null, 2), {});
}
