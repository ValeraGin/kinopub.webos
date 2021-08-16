/* eslint-disable no-shadow */

export enum Bool {
  True = 1,
  False = 0,
}

export type Streaming = 'http' | 'hls' | 'hls2' | 'hls4';

export type DeviceInfo = {
  /**
   * Название устройства.
   */
  title: string;

  /**
   * Информация по “железу” устройства.
   */
  hardware: string;

  /**
   * Информация по софту устройства.
   */
  software: string;
};

export type User = {
  username: string;
  reg_date: number;
  subscription: {
    active: boolean;
    end_time: number;
    days: number;
  };
  profile: {
    name: string;
    avatar: string;
  };
};

export type ServerLocation = {
  id: string;
  location: string;
  name: string;
};

export type StreamingType = {
  id: string;
  code: Streaming;
  name: string;
  description: string;
};

export type VoiceoverType = {
  id: string;
  title: string;
  short_title: string;
};

export type VoiceoverAuthor = {
  id: string;
  title: string;
  short_title: string;
};

export type VideoQuality = {
  id: string;
  title: string;
  quality: number;
};

export type Type = {
  id: string;
  title: string;
};

export type Gender = {
  id: string;
  title: string;
  type: string;
};

export type Country = {
  id: string;
  title: string;
};

export type DeviceSettingBoolean = {
  type: undefined;
  label: string;
  value: Bool;
};

export type DeviceSettingList = {
  type: 'list';
  label: string;
  value: {
    id: string;
    label: string;
    description: string;
    selected: Bool;
  }[];
};

export type DeviceSettings = {
  /**
   * Поддерживает ли устройство SSL
   */
  supportSsl: DeviceSettingBoolean;

  /**
   * Поддерживает ли устройство HEVC
   */
  supportHevc: DeviceSettingBoolean;

  /**
   * Поддерживает ли устройство HDR (10bit color)
   */
  supportHdr: DeviceSettingBoolean;

  /**
   * Поддерживает ли устройство UHD/4K
   */
  support4k: DeviceSettingBoolean;

  /**
   * На данный момент только для HLS4, плейлист строится из всех доступных файлов AVC+HEVC
   */
  mixedPlaylist: DeviceSettingBoolean;

  /**
   * Типа стриминга
   */
  streamingType: DeviceSettingList;

  /**
   * Регион, откуда получать контент
   */
  serverLocation: DeviceSettingList;
};

export type Device = {
  id: string;
  title: string;
  hardware: string;
  software: string;
  created: number;
  updated: number;
  last_seen: number;
  is_browser: number;
  settings: DeviceSettings;
};

export type Tracklist = {
  /**
   * Исполнитель
   */
  artist: string;

  /**
   * Название композиции
   */
  title: string;

  /**
   * Ссылка на аудио файл
   */
  url: string;
};

export type Subtitle = {
  lang: string;

  /**
   * Смещение относительно видео-потока
   */
  shift: number;

  /**
   * Доступно в файле-исходнике, вшиты в него отдельным стримом
   */
  embed: boolean;

  /**
   * Форсированные субтитры (перевод вывисок, других языков и тд)
   */
  forced: boolean;

  file: string;

  url: string;
};

export type Audio = {
  id: string;
  index: number;
  codec: 'aac' | 'ac3';
  channels: number;
  lang: string;
  type?: {
    id: string;
    title: string;
    short_title?: string;
  };
  author?: {
    id: string;
    title: string;
    short_title?: string;
  };
};

export type File = {
  w: number;
  h: number;
  codec: string;
  quality: string;
  quality_id: string;
  file: string;
  url: {
    http: string;
    hls?: string;
    hls2?: string;
    hls4?: string;
  };
};

export type Trailer = {
  id: string;
  url: string;
  files?: File[];
};

export type Posters = {
  small: string;
  medium: string;
  big: string;
  wide?: string;
};

export enum WatchingStatus {
  NoWatched = -1,
  Watching = 0,
  Watched = 1,
}

export type Video = {
  id: string;

  title: string;
  thumbnail: string;

  number: number;

  /**
   * Время в секундах
   */
  duration: number;

  /**
   * Статус просмотра эпизода: -1 не смотрели вообще, 0 - начали смотреть, 1 - просмотрели
   */
  watched: WatchingStatus;

  watching: {
    /**
     * Статус просмотра эпизода: -1 не смотрели вообще, 0 - начали смотреть, 1 - просмотрели
     */
    status: WatchingStatus;

    /**
     * Время просмотра в секундах
     */
    time: number;
  };
  /**
   * Номера аудио-дорожек ('1,2,3,4')
   */
  tracks: string[];
  subtitles: Subtitle[];
  audios: Audio[];
  files: File[];
  ac3: Bool;
};

export type Season = {
  id: string;

  /**
   * Название сезона
   */
  title: string;

  number: number;

  episodes: Video[];

  /**
   * Статус просмотра эпизода: -1 не смотрели вообще, 0 - начали смотреть, 1 - просмотрели
   */
  watched: WatchingStatus;

  watching: {
    /**
     * Статус просмотра эпизода: -1 не смотрели вообще, 0 - начали смотреть, 1 - просмотрели
     */
    status: WatchingStatus;

    /**
     * Время просмотра в секундах
     */
    time: number;
  };
};

export type Item = {
  id: string;

  /**
   * Название / Оригинальное название
   */
  title: string;

  /**
   * Тип контента
   */
  type: string;

  /**
   * Подтип контента, бывают многосерийные фильмы, концерты
   */
  subtype: 'multi' | string;
  year: number;
  cast: string;
  director: string;
  voice: string;

  created_at: number;

  updated_at: number;

  /**
   * Продолжительность фильма/сериала
   */
  duration: {
    /**
     * Средняя продолжительность для сериалов, полная для фильмов
     */
    average: number;

    /**
     * Общая продолжительность фильма, сериала
     */
    total: number;
  };

  /**
   * Количество аудио дорожек
   */
  langs: number;

  /**
   * Присутствуют или нет AC-3 аудио
   */
  ac3: Bool;

  /**
   * Количество субтитров
   */
  subtitles: number;

  /**
   * Качество фильма, для сериалов берется наибольшее количество серий с определенным качеством
   */
  quality: number;

  poor_quality: boolean;

  genres: Gender[];
  countries: Country[];

  /**
   * Описание фильма
   */
  plot: string;

  tracklist: Tracklist[];
  imdb: number;
  imdb_rating: number;
  imdb_votes: number;
  kinopoisk: number;
  kinopoisk_rating: number;
  kinopoisk_votes: number;
  rating: number;
  rating_votes: number;
  rating_percentage: number;
  views: number;
  comments: number;

  /**
   * Для сериалов: true - окончен, false - снимается
   */
  finished: boolean;

  /**
   * Присутствуют посторонние вставки рекламы
   */
  advert: boolean;

  /**
   * Подписан ли пользователь на сериал
   */
  in_watchlist: true;

  /**
   * Подписан ли пользователь на сериал, alias in_watchlist
   */
  subscribed: true;

  bookmarks: {
    id: string;
    title: string;
  }[];

  posters: Posters;
  trailer: Trailer;

  /**
   * Всего эпизодов
   */
  total?: number;

  /**
   * Просмотренных эпизодов
   */
  watched?: number;

  /**
   * Новых/недосмотренных эпизовод
   */
  new?: number;
};

export type ItemDetails = {
  videos?: Video[];
  seasons?: Season[];
} & Item;

export type Comment = {
  id: string;
  depth: number;
  unread: boolean;
  deleted: boolean;
  message: string;
  created: number;
  rating: number;
  user: {
    id: string;
    name: string;
    avatar: string;
  };
};

export type Channel = {
  id: string;
  title: string;
  name: string;
  logos: {
    s: string;
    m: string;
  };
  stream: string;
};

export type Bookmark = {
  id: string;
  title: string;
  views: number;
  count: number;
  created: number;
  updated: number;
};

export type Collection = {
  id: string;
  title: string;
  watchers: number;
  views: number;
  created: number;
  updated: number;
  posters: Posters;
};

export type History = {
  /**
   * Время где остановились
   */
  time: number;

  /**
   * Сколько раз смотрели данный media
   */
  counter: number;

  /**
   * Когда впервые посмотрели media
   */
  first_seen: number;

  /**
   * Когда последний раз посмотрели media
   */
  last_seen: number;

  /**
   * Описание item
   */
  item: Item;

  /**
   * Описание media
   */
  media: Video;
};

export type Pagination = {
  total: number;
  current: number;
  perpage: number;
  total_items?: number;
};

export type OnConfirm = (userCode: string, verificationUri: string) => void | Promise<void>;

export type Response = {
  status?: number;
  error?: string;
  error_description?: string;
};

export type PaginationResponse = {
  pagination: Pagination;
} & Response;

export type DeviceCodeResponse = {
  /**
   * Код, для дальнейшего получения access token'a
   */
  code: string;

  /**
   * Код который нужно показать пользователю
   */
  user_code: string;

  /**
   * URL где нужно ввести пользовательский код
   */
  verification_uri: string;

  /**
   * Через сколько данный device_code перестанет быть валидным
   */
  expires_in: number;

  /**
   * Интервал в секундах, через который посылать запросы на проверку активацииs
   */
  interval: number;
} & Response;

export type TokensResponse = {
  /**
   * Токен, который требуется для обращения к API
   */
  access_token: string;

  /**
   * Тип токена (bearer)
   */
  token_type: string;

  /**
   * Через сколько данный access_token перестанет быть валидным
   */
  expires_in: number;

  /**
   * Токен, с помощью которого можно получать access_token без получения device_code
   */
  refresh_token: string;
} & Response;

export type UserReponse = {
  user: User;
} & Response;

export type ServerLocationsReponse = {
  items: ServerLocation[];
} & Response;

export type StreamingTypesReponse = {
  items: StreamingType[];
} & Response;

export type VoiceoverTypesResponse = {
  items: VoiceoverType[];
} & Response;

export type VoiceoverAuthorsResponse = {
  items: VoiceoverAuthor[];
} & Response;

export type VideoQualitiesResponse = {
  items: VideoQuality[];
} & Response;

export type DevicesResponse = {
  devices: Device[];
} & Response;

export type DeviceInfoResponse = {
  device: Device;
} & Response;

export type DeviceRemoveResponse = {
  /**
   * Указывает, что данный запрос вызван текущим устройством или нет.
   * Удаление текущего устройства/браузера равносильно логауту.
   */
  current: boolean;
} & Response;

export type DeviceSettingsResponse = {
  settings: DeviceSettings;
} & Response;

export type DeviceSettingsParams = {
  [key in keyof DeviceSettings]?: DeviceSettings[key] extends DeviceSettingBoolean ? boolean : number;
};

export type TypesResponse = Type[];

export type GendersResponse = Gender[];

export type CountriesResponse = Country[];

export type ItemsParams = {
  /**
   * Тип видео контента
   */
  type?: string;

  /**
   * Поиск по заголовку, минимум 3 символа. Выборка по типу LIKE ‘$ASD’
   */
  title?: string;

  /**
   * id жанра. Для множественного поиска список через запятую.
   */
  genre?: string;

  /**
   * id страны. Для множественного поиска список через запятую.
   */
  country?: string;

  /**
   * Год. Для поиска в промежутке year1-year2
   */
  year?: string;

  /**
   * Статус сериала, завершен/снимается
   */
  finished?: Bool;

  /**
   * Имена актеров чере запятую или +(плюс), “Actor1,Actor2+Actor3” - ищет (Actor1 OR (Actor2 AND Actor3))
   */
  actor?: string;

  /**
   * Имена режисеров чере запятую или +(плюс), “Actor1,Actor2+Actor3” - ищет (Actor1 OR (Actor2 AND Actor3))
   */
  director?: string;

  /**
   * Поиск по первой букве в названиях(рус, анг) фильма
   */
  letter?: string;

  /**
   * Массив простых условий для фильтра. Доступные поля как и в сортировке. year <= 100. Объединение условий через AND
   */
  conditions?: string[];

  /**
   * Массив для пропуска пользовательских настроек фильтрации
   *
   * * quality - Пропускаем проверку на сомнительное качество
   * * advert - Пропускаем проверку на контент с рекламой
   * * erotic - Пропускаем проверку на эротический контент
   */
  force?: ('quality' | 'advert' | 'erotic')[];

  /**
   * Сортировка, по умолчанию ‘updated-‘.
   * Без знака ‘-‘ сортируется по возрастанию(ASC), со знаком ‘-‘(минус) по убыванию(DESC).
   * Можно указать можество полей через запятую,.
   *
   * * id
   * * year
   * * title
   * * created
   * * updated
   * * rating
   * * views
   * * watchers
   */
  sort?: string;

  period?: string;

  /**
   * Массив идентификаторов качеств
   */
  quality?: string[];
};

export type ItemsResponse = {
  items: Item[];
} & PaginationResponse;

export type ItemsSearchParams = {
  /**
   * Строка поиска
   */
  q: string;

  /**
   * Тип контента
   */
  type?: string;

  /**
   * Поиск только в одном из полей title, director, cast. Если не указанно, поиск по всем полям
   */
  field?: string;

  /**
   * Разбивает запрос по секциям type. По умолчанию 0
   */
  sectioned?: Bool;
};

export type ItemsWithPagination = {
  items: Item[];
  pagination: Pagination;
};

export type ItemsSearchResponse<Sectioned extends Bool | undefined> = (Sectioned extends Bool.True
  ? {
      items: {
        [key: string]: ItemsWithPagination;
      };
    }
  : ItemsWithPagination) &
  Response;

export type ItemMediaResponse = {
  item: ItemDetails;
} & Response;

export type ItemMediaLinksResponse = {
  files: File[];
  subtitles: Subtitle[];
};

export type ItemVoteResponse = {
  /**
   * Засчитался ли голос
   */
  voted: boolean;

  /**
   * Всего голосов
   */
  total: number;

  /**
   * Позитивных голосов
   */
  positive: number;

  /**
   * Негативных голосов
   */
  negative: number;

  /**
   * Подсчитанный рейтинг: позитивные минус негативные
   */
  rating: number;
};

export type ItemCommentsResponse = {
  item: {
    id: string;
    title: string;
  };
  comments: Comment[];
} & Response;

export type ItemTrailerResponse = {
  trailer: Trailer;
} & Response;

export type ChannelsResponse = {
  channels: Channel[];
} & Response;

export type BookmarksResponse = {
  items: Bookmark[];
} & Response;

export type BookmarkItemsResponse = {
  folder: Bookmark;
  items: Item[];
} & PaginationResponse;

export type ItemBookmarksResponse = {
  folders: Bookmark[];
} & Response;

export type BookmarkCreateResponse = {
  folder: Bookmark;
} & Response;

export type WatchingItemResponse = {
  item: {
    id: string;
    title: string;
    type: string;

    /**
     * В зависимости от типа контента данная часть может меняться
     * Для сериалов
     */
    seasons: Season[];

    /**
     * Для фильмов, многосерийных фильмов и тд
     */
    videos: Video[];
  };
} & Response;

export type WatchingItemsResponse = {
  items: Item[];
};

export type WatchingToggleResponse = {
  /**
   * 0 - отмечено как непросмотренные, 1 - отмечено как просмотренные
   */
  watched: Bool;
} & Response;

export type WatchingToggleWatchlistResponse = {
  /**
   * false - отмечено как непросмотренные, true - отмечено как просмотренные
   */
  watching: boolean;
} & Response;

export type CollectionsResponse = {
  items: Collection[];
} & PaginationResponse;

export type CollectionItemsResponse = {
  collection: Collection;
  items: Item[];
};

export type HistoryResponse = {
  history: History[];
} & PaginationResponse;
