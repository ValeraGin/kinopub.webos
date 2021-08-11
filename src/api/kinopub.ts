import BaseApiClient from './base';
import {
  BookmarkCreateResponse,
  BookmarkItemsResponse,
  BookmarksResponse,
  Bool,
  ChannelsResponse,
  CollectionItemsResponse,
  CollectionsResponse,
  CountriesResponse,
  DeviceCodeResponse,
  DeviceInfo,
  DeviceInfoResponse,
  DeviceRemoveResponse,
  DeviceSettingsParams,
  DeviceSettingsResponse,
  DevicesResponse,
  GendersResponse,
  HistoryResponse,
  ItemBookmarksResponse,
  ItemMediaLinksResponse,
  ItemMediaResponse,
  ItemTrailerResponse,
  ItemVoteResponse,
  ItemsParams,
  ItemsResponse,
  ItemsSearchParams,
  ItemsSearchResponse,
  OnConfirm,
  ServerLocationsReponse,
  StreamingTypesReponse,
  TokensResponse,
  TypesResponse,
  UserReponse,
  VideoQualitiesResponse,
  VoiceoverAuthorsResponse,
  VoiceoverTypesResponse,
  WatchingItemResponse,
  WatchingItemsResponse,
  WatchingToggleResponse,
  WatchingToggleWatchlistResponse,
} from './typings';

const KINOPUB_API_BASE_URL = process.env.KINOPUB_API_BASE_URL || 'https://api.service-kp.com';
const KINOPUB_API_CLIENT_ID = process.env.KINOPUB_API_CLIENT_ID || 'xbmc';
const KINOPUB_API_CLIENT_SECRET = process.env.KINOPUB_API_CLIENT_SECRET || 'cgg3gtifu46urtfp2zp1nqtba0k2ezxh';

class KinopubApiClient extends BaseApiClient {
  private clientId: string;

  private clientSecret: string;

  private accessTokenCheckIntervaId!: NodeJS.Timeout | null;

  constructor(
    clientId: string = KINOPUB_API_CLIENT_ID,
    clientSecret: string = KINOPUB_API_CLIENT_SECRET,
    baseUrl: string = KINOPUB_API_BASE_URL,
  ) {
    super(baseUrl);

    this.clientId = clientId;
    this.clientSecret = clientSecret;
  }

  clearTimers() {
    clearInterval(this.accessTokenCheckIntervaId!);

    this.accessTokenCheckIntervaId = null;
  }

  private async processTokensReponse(response: TokensResponse, onSuccess?: Function) {
    await this.clearTokens();

    switch (response.error) {
      case 'authorization_pending':
        break;

      case undefined:
        this.clearTimers();

        await this.saveTokens(response);
        onSuccess?.();
        return;

      default:
        this.clearTimers();
        throw response.error;
    }
  }

  /**
   * Получение access_token и refresh_token
   * @param code Код для получения access_token и refresh_token
   */
  async requestTokens(code: string) {
    const response = await this.post<TokensResponse>(`/oauth2/device`, null, {
      grant_type: 'device_token',
      client_id: this.clientId,
      client_secret: this.clientSecret,
      code,
    });

    return response;
  }

  /**
   * Обновление access_token и refresh_token
   * @param refresh_token Код для обновления access_token и refresh_token
   */
  async refreshTokens(refresh_token: string) {
    const response = await this.post<TokensResponse>(`/oauth2/token`, null, {
      grant_type: 'refresh_token',
      client_id: this.clientId,
      client_secret: this.clientSecret,
      refresh_token,
    });

    return response;
  }

  /**
   * Получение device_code
   */
  async requestDeviceCode() {
    const response = await this.post<DeviceCodeResponse>(`/oauth2/device`, null, {
      grant_type: 'device_code',
      client_id: this.clientId,
      client_secret: this.clientSecret,
    });

    return response;
  }

  /**
   * Авторизация устройства
   */
  async deviceAuthorization(onConfirm?: OnConfirm) {
    const refreshToken = this.getRefreshToken();

    if (refreshToken) {
      const response = await this.refreshTokens(refreshToken);

      await this.processTokensReponse(response);
    } else {
      const { interval, code, user_code, verification_uri } = await this.requestDeviceCode();

      onConfirm?.(user_code, verification_uri);

      await new Promise<void>((resolve, reject) => {
        this.clearTimers();
        this.accessTokenCheckIntervaId = setInterval(async () => {
          const response = await this.requestTokens(code);

          try {
            await this.processTokensReponse(response, resolve);
          } catch (ex) {
            reject(ex);
          }
        }, (interval || 10) * 1000);
      });
    }
  }

  /**
   * Отключение устройства
   */
  deactivate() {
    this.deviceUnlink();

    this.clearTokens();
    this.clearTimers();
  }

  /**
   * Информация о пользователе
   */
  user() {
    return this.get<UserReponse>(`/v1/user`);
  }

  /**
   * Список локаций сервера
   */
  serverLocations() {
    return this.get<ServerLocationsReponse>(`/v1/references/server-location`);
  }

  /**
   * Список типов стриминга
   */
  streamingTypes() {
    return this.get<StreamingTypesReponse>(`/v1/references/streaming-type`);
  }

  /**
   * Список типов переводов
   */
  voiceoverTypes() {
    return this.get<VoiceoverTypesResponse>(`/v1/references/voiceover-type`);
  }

  /**
   * Список авторов озвучек/переводов
   */
  voiceoverAuthors() {
    return this.get<VoiceoverAuthorsResponse>(`/v1/references/voiceover-author`);
  }

  /**
   * Список качеств видео
   */
  videoQualities() {
    return this.get<VideoQualitiesResponse>(`/v1/references/video-quality`);
  }

  /**
   * Список устройств на аккаунте
   */
  devices() {
    return this.get<DevicesResponse>(`/v1/device`);
  }

  /**
   * Информация о текущем устройстве
   */
  deviceInfo() {
    return this.get<DeviceInfoResponse>(`/v1/device/info`);
  }

  /**
   * Информация о устройстве
   * @param id Идентификатор устройства
   */
  deviceInfoById(id: string) {
    return this.get<DeviceInfoResponse>(`/v1/device/${id}`);
  }

  /**
   * Удаление текущего устройства
   */
  deviceUnlink() {
    return this.post<Response>(`/v1/device/unlink`);
  }

  /**
   * Удаление устройства
   * @param id Идентификатор устройства
   */
  deviceRemoveById(id: string) {
    return this.post<DeviceRemoveResponse>(`/v1/device/${id}/remove`);
  }

  /**
   * Изменение информации о текущем устройстве
   * @param deviceInfo Информация о текущем устройстве
   */
  deviceNotify(deviceInfo: DeviceInfo) {
    return this.post<Response>(`/v1/device/notify`, deviceInfo);
  }

  /**
   * Получение настроек устройства
   * @description На данный момент все настройки разбиваются на тип “чекбокс” и “список”. “Чекбокс” это настройки вида да/нет (1/0).
   * Если не указан type, значит настройка трактуется как “чекбокс”.
   * Если указан type: ‘list’, значит надо обрабатывать как список, формат
   *
   * Набор полей в списках всегда одинаков - id, label, description, selected
   *
   * Доступные настройки:
   * * supportSsl boolean - Поддерживает ли устройство SSL
   * * supportHevc boolean - Поддерживает ли устройство HEVC
   * * supportHdr boolean - Поддерживает ли устройство HDR (10bit color)
   * * support4k boolean - Поддерживает ли устройство UHD/4K
   * * mixedPlaylist boolean - На данный момент только для HLS4, плейлист строится из всех доступных файлов AVC+HEVC.
   * * streamingType integer - Идентификатор типа стриминга
   * * serverLocation integer - Идентификатор региона, откуда получать контент
   */
  deviceSettings(id: string) {
    return this.get<DeviceSettingsResponse>(`/v1/device/${id}/settings`);
  }

  /**
   * Изменение настроек устройства
   */
  saveDeviceSettings(id: string, settings: DeviceSettingsParams) {
    return this.post<Response>(`/v1/device/${id}/settings`, settings);
  }

  /**
   * Типы контента
   * @description Видео контент условно разделен на типы:
   * * movie - Фильмы
   * * serial - Сериалы
   * * 3D - 3D Фильмы
   * * concert - Концерты
   * * documovie - Документальные фильмы
   * * docuserial - Документальные сериалы
   * * tvshow - ТВ Шоу
   */
  types() {
    return this.get<TypesResponse>(`/v1/types`);
  }

  /**
   * Типы жанров
   * @description Жанры, как и контент, разделены по типам.
   * Видео контент с типом movie, serial, 3d может принадлежать только жанрам с типом movie и т.д.
   * * movie - жанры типов видео контента movie, serial, 3D (Фильмов и Сериалов)
   * * music - жанры типов видео контента concert (Концерты)
   * * docu - жанры типов видео контента documovie, docuserial (Документальные фильмы и сериалы)
   */
  genders() {
    return this.get<GendersResponse>(`/v1/genres`);
  }

  /**
   * Спиоск стран
   */
  countries() {
    return this.get<CountriesResponse>(`/v1/countries`);
  }

  /**
   * Видео контент
   */
  items(params: ItemsParams, page?: number, perpage?: number) {
    return this.get<ItemsResponse>(`/v1/items`, {
      ...params,
      page,
      perpage,
    });
  }

  /**
   * Поиск
   * @description Поиск производится по полям title, director, cast
   */
  itemsSearch(params: ItemsSearchParams, page?: number, perpage?: number) {
    return this.get<ItemsSearchResponse<typeof params['sectioned']>>(`/v1/items/search`, {
      ...params,
      page,
      perpage,
    });
  }

  /**
   * Похожие видео
   * @param id Идентификатор item для которого проивзодится поиск похожих
   */
  itemSmiliar(id: string) {
    return this.get<ItemsResponse>(`/v1/items/similar`, { id });
  }

  /**
   * Список медиа-контента
   * @param id Идентификатор item для которого запрашивается медиа-контент
   * @param nolinks 1 исключает ссылки на видео (значение по умолчания - 0).
   * У больших сериалов ссылки занимают львиную долю объема ответа причем большинство из этих ссылок не используется в рамках 1 запроса.
   * В следующей версии значение по умолчанию станет 1, а через версию параметр станет недоступным и ссылки нужно будет всегда получать в отдельном запросе.
   */
  itemMedia(id: string, nolinks: Bool = Bool.True) {
    return this.get<ItemMediaResponse>(`/v1/items/${id}`, { nolinks });
  }

  /**
   * Ссылки на субтитры и видео-файлы для media
   * @param id Идентификатор media
   */
  itemMediaLinks(id: string) {
    return this.get<ItemMediaLinksResponse>(`/v1/items/media-links`, { mid: id });
  }

  /**
   * Ссылка на видео-файл по имени файла
   * @param file Путь к файлуv
   * @param type Тип потока, http | hls | hls2 | hls4
   */
  itemMediaFileLink(file: string, type: string) {
    return this.get<{ url: string }>(`/v1/items/media-video-link`, { file, type });
  }

  /**
   * Голосование за видео
   * @param id Идентификатор item
   * @param like 1: нравится, 0: не нравится
   */
  itemVote(id: string, like: Bool) {
    return this.get<ItemVoteResponse>(`/v1/items/vote`, { id, like });
  }

  /**
   * Трейлер к контенту
   */
  itemTrailer(id?: string, sid?: string) {
    return this.get<ItemTrailerResponse>(`/v1/items/trailer`, { id, sid });
  }

  /**
   * Свежие видео
   * @param type Тип видео контента
   * @param page Текущая страница
   * @param perpage Количество на страницу
   */
  itemsFresh(type: string, page?: number, perpage?: number) {
    return this.get<ItemsResponse>(`/v1/items/fresh`, { type, page, perpage });
  }

  /**
   * Горячие видео
   * @param type Тип видео контента
   * @param page Текущая страница
   * @param perpage Количество на страницу
   */
  itemsHot(type: string, page?: number, perpage?: number) {
    return this.get<ItemsResponse>(`/v1/items/hot`, { type, page, perpage });
  }

  /**
   * Популярные видео
   * @param type Тип видео контента
   * @param page Текущая страница
   * @param perpage Количество на страницу
   */
  itemsPopular(type: string, page?: number, perpage?: number) {
    return this.get<ItemsResponse>(`/v1/items/popular`, { type, page, perpage });
  }

  /**
   * Список транслируемых каналов
   * @description Транслируемые, на данный момент, каналы. Обычно это какие-то события типа Евро 2016, Рио 2016.
   */
  channels() {
    return this.get<ChannelsResponse>(`/v1/tv`);
  }

  /**
   * Список папок в закладках
   */
  bookmarks() {
    return this.get<BookmarksResponse>(`/v1/bookmarks`);
  }

  /**
   * Список фильмов/сериалов в папке
   * @param id Идентификатор закладки
   * @param page Текущая страница
   * @param perpage Количество на страницу
   */
  bookmarkItems(id: string, page?: number, perpage?: number) {
    return this.get<BookmarkItemsResponse>(`/v1/bookmarks/${id}`, { page, perpage });
  }

  /**
   * Список папок в которых присутствует фильм
   * @param id Идентификатор item
   */
  itemBookmarks(id: string) {
    return this.get<ItemBookmarksResponse>(`/v1/bookmarks/get-item-folders`, { item: id });
  }

  /**
   * Создать папку
   * @param title Название папки
   */
  bookmarkCreate(title: string) {
    return this.post<BookmarkCreateResponse>(`/v1/bookmarks/create`, { title });
  }

  /**
   * Удаление папки
   * @param folder Идентификатор папки
   */
  bookmarkRemove(folder: string) {
    return this.post<Response>(`/v1/bookmarks/remove-folder`, { folder });
  }

  /**
   * Добавление фильма в папку
   * @param item Идентификатор фильма
   * @param folder Идентификатор папки
   */
  bookmarkAddItem(item: string, folder: string) {
    return this.post<Response>(`/v1/bookmarks/add`, { item, folder });
  }

  /**
   * Удаление фильма из папки/папок
   * @param item Идентификатор фильма
   * @param folder Идентификатор папки, если отсутствует - удаляем из всех папок
   */
  bookmarkRemoveItem(item: string, folder?: string) {
    return this.post<Response>(`/v1/bookmarks/remove-item`, { item, folder });
  }

  /**
   * Переключение добвить/удалить фильм
   * @param item Идентификатор фильма
   * @param folder Идентификатор папки
   */
  bookmarkToggleItem(item: string, folder: string) {
    return this.post<Response>(`/v1/bookmarks/toggle-item`, { item, folder });
  }

  /**
   * Информация по просмотрам видео
   * @param id Идентификатор фильма/сериала/и тд
   * @param video Номер видео, начинается с 1. Если отсутсвует выводятся все видео.
   * @param season Номер сезона, присутсвует только у сериалов, начинается с 1. Если отсутсвует, выводятся все сезоны.
   */
  watchingItem(id: string, video?: number, season?: number) {
    return this.get<WatchingItemResponse>(`/v1/watching`, { id, video, season });
  }

  /**
   * Недосмотренные фильмы/концерты/документальные фильмы/3Д¶
   */
  watchingMovies() {
    return this.get<WatchingItemsResponse>(`/v1/watching/movies`);
  }

  /**
   * Список сериалов с новыми/не досмотренными сериями
   * @param subscribed 0 - Показывать все недосмотренные сериалы, 1 - Показывать сериалы отмеченные “Буду смотреть”
   */
  watchingSerials(subscribed?: Bool) {
    return this.get<WatchingItemsResponse>(`/v1/watching/serials`, { subscribed });
  }

  /**
   * Добавление метки о просмотре
   * @param id Идентификатор фильма/сериала/и тд
   * @param time Время в секундах, где остановился просмотр
   * @param video Номер видео, начинается с 1. Если отсутсвует выводятся все видео.
   * @param season Номер сезона, присутсвует только у сериалов, начинается с 1. Если отсутсвует для сезона, выдаст исключение 404 Not Found.
   */
  watchingMarkTime(id: string, time: number, video: number, season?: number) {
    return this.get<Response>(`/v1/watching/marktime`, { id, time, video, season });
  }

  /**
   * Изменение просмотрено/не просмотрено
   * @param id Идентификатор фильма/сериала/и тд
   * @param video Номер видео/эпизода, начинается с 1. Если отсутствует, модификации подвергаются все эпизоды сезона
   * @param season Номер сезона, присутствует только у сериалов, начинается с 1.
   */
  watchingToggle(id: string, video?: number, season?: number) {
    return this.get<WatchingToggleResponse>(`/v1/watching/toggle`, { id, video, season });
  }

  /**
   * Добавление сериала в список “Буду смотреть”
   * @param id Идентификатор фильма/сериала/и тд
   */
  watchingToggleWatchlist(id: string) {
    return this.get<WatchingToggleWatchlistResponse>(`/v1/watching/togglewatchlist`, { id });
  }

  /**
   * Список подборок
   * @param title Поиск по заголовку, минимум 3 символа. Выборка по типу LIKE ‘$ASD’
   * @param sort Сортировка, по умолчанию ‘updated-‘. Без знака ‘-‘ сортируется по возрастанию(ASC)
   * * id
   * * title
   * * views
   * * watchers
   * * created
   * * updated
   * @param page Пагинация, текущая страница
   * @param perpage Пагинация, кол-во на одной странице
   * @returns
   */
  collections(title?: string, sort?: string, page?: number, perpage?: number) {
    return this.get<CollectionsResponse>(`/v1/collections`, { title, sort, page, perpage });
  }

  /**
   * Список фильмов в подбороке
   * @param id Идентификатор подборки
   */
  collectionItems(id: string) {
    return this.get<CollectionItemsResponse>(`/v1/collections/view`, { id });
  }

  /**
   * Получение истории просмотров
   * @param page Номер страницы
   * @param perpage Кол-во на страницы, по умолчанию 20, максимум 50
   */
  history(page?: number, perpage?: number) {
    return this.get<HistoryResponse>(`/v1/history`, { page, perpage });
  }

  /**
   * Очистить просмотр для media
   * @param id Идентификатор media
   */
  historyClearMedia(id: string) {
    return this.post<Response>(`/v1/history/clear-for-media`, null, { id });
  }

  /**
   * Очистить просмотр для season
   * @param id Идентификатор season
   */
  historyClearSeason(id: string) {
    return this.post<Response>(`/v1/history/clear-for-season`, null, { id });
  }

  /**
   * Очистить просмотр для item
   * @param id Идентификатор item
   */
  historyClearItem(id: string) {
    return this.post<Response>(`/v1/history/clear-for-item`, null, { id });
  }
}

export default KinopubApiClient;
