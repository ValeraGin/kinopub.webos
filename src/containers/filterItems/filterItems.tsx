import { useCallback, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import first from 'lodash/first';
import last from 'lodash/last';
import range from 'lodash/range';

import { GenderType, ItemType, ItemsParams } from 'api/typings';
import Button from 'components/button';
import Checkbox from 'components/checkbox';
import Popup from 'components/popup';
import Select from 'components/select';
import useApi from 'hooks/useApi';
import useButtonEffect from 'hooks/useButtonEffect';
import useSessionState from 'hooks/useSessionState';

const GENDER_TYPES_MAP: Record<ItemType, GenderType> = {
  movie: 'movie',
  serial: 'movie',
  concert: 'music',
  documovie: 'docu',
  docuserial: 'docu',
  tvshow: 'tvshow',
} as const;

const DEFAULT_ITEM = { title: '—', value: null };

const YEAR_OPTIONS = range(1912, new Date().getFullYear() + 1)
  .reverse()
  .map((year) => ({ title: `${year}`, value: `${year}` }));

const RATING_OPTIONS = range(1, 10)
  .reverse()
  .map((rating) => ({ title: `${rating}+`, value: `${rating}` }));

const AGE_OPTIONS = [
  { title: '0+', value: '0' },
  { title: '6+', value: '6' },
  { title: '12+', value: '12' },
  { title: '16+', value: '16' },
  { title: '18+', value: '18' },
];

const SORTING_OPTIONS = [
  { title: 'Дата обновления', value: 'updated' },
  { title: 'Дата добавления', value: 'created' },
  { title: 'Год выпуска', value: 'year' },
  { title: 'Название', value: 'title' },
  { title: 'Рейтинг Кинопаб', value: 'rating' },
  { title: 'Рейтинг КиноПоиск', value: 'kinopoisk_rating' },
  { title: 'Рейтинг IMDb', value: 'imdb_rating' },
  { title: 'Просмотрам', value: 'views' },
];

const PERIOD_OPTIONS = [
  { title: 'Всё время', value: null },
  { title: 'Сутки', value: dayjs().add(-1, 'day').unix() },
  { title: 'Неделю', value: dayjs().add(-1, 'week').unix() },
  { title: 'Месяц', value: dayjs().add(-1, 'month').unix() },
  { title: 'Квартал', value: dayjs().add(-3, 'month').unix() },
  { title: 'Год', value: dayjs().add(-1, 'year').unix() },
];

type FilterItemsProps = {
  type: ItemType;
  defaultGenre?: string;
  storageKey: string;
  onFilter?: (params: ItemsParams | null) => void;
};

const FilterItems: React.FC<FilterItemsProps> = ({ type, defaultGenre, storageKey, onFilter }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: genders } = useApi('genders');
  const { data: countries } = useApi('countries');
  const { data: subtitles } = useApi('subtitles');
  const [genre, setGenre] = useSessionState<string | null>(`${storageKey}:filter:genre`, null);
  const [country, setCountry] = useSessionState<string | null>(`${storageKey}:filter:country`, null);
  const [subtitle, setSubtitle] = useSessionState<string | null>(`${storageKey}:filter:subtitle`, null);
  const [yearFrom, setYearFrom] = useSessionState<number | null>(`${storageKey}:filter:yearFrom`, null);
  const [yearTo, setYearTo] = useSessionState<number | null>(`${storageKey}:filter:yearTo`, null);
  const [ratingKinopoisk, setRatingKinopoisk] = useSessionState<number | null>(`${storageKey}:filter:ratingKinopoisk`, null);
  const [ratingIMDB, setRatingIMDB] = useSessionState<number | null>(`${storageKey}:filter:ratingIMDB`, null);
  const [age, setAge] = useSessionState<string | null>(`${storageKey}:filter:age`, null);
  const [sorting, setSorting] = useSessionState<string>(`${storageKey}:filter:sorting`, SORTING_OPTIONS[0].value);
  const [period, setPeriod] = useSessionState<number | null>(`${storageKey}:filter:period`, PERIOD_OPTIONS[0].value);
  const [sortingAsc, setSortingAsc] = useSessionState<boolean>(`${storageKey}:filter:sortingAsc`, false);
  const [only4K, setOnly4K] = useSessionState<boolean>(`${storageKey}:filter:only4K`, false);
  const [onlyAC3, setOnlyAC3] = useSessionState<boolean>(`${storageKey}:filter:onlyAC3`, false);
  const [skipAds, setSkipAds] = useSessionState<boolean>(`${storageKey}:filter:skipAds`, false);
  const [skipErotic, setSkipErotic] = useSessionState<boolean>(`${storageKey}:filter:skipErotic`, false);

  const gendersForType = useMemo(() => genders?.items?.filter?.((gender) => gender.type === GENDER_TYPES_MAP[type]), [genders, type]);

  const genderOptions = useMemo(
    () => [
      DEFAULT_ITEM,
      ...(gendersForType?.map?.((gender) => ({
        title: gender.title,
        value: `${gender.id}`,
      })) || []),
    ],
    [gendersForType],
  );
  const countryOptions = useMemo(
    () => [
      DEFAULT_ITEM,
      ...(countries?.items?.map?.((country) => ({
        title: country.title,
        value: `${country.id}`,
      })) || []),
    ],
    [countries],
  );
  const subtitleOptions = useMemo(
    () => [
      DEFAULT_ITEM,
      ...(subtitles?.items?.map?.((subtitle) => ({
        title: subtitle.title,
        value: subtitle.id,
      })) || []),
    ],
    [subtitles],
  );

  const yearOptions = useMemo(() => [DEFAULT_ITEM, ...YEAR_OPTIONS], []);
  const ratingOptions = useMemo(() => [DEFAULT_ITEM, ...RATING_OPTIONS], []);
  const ageOptions = useMemo(() => [DEFAULT_ITEM, ...AGE_OPTIONS], []);

  const clearFilters = useCallback(() => {
    setGenre(null);
    setCountry(null);
    setAge(null);
    setSubtitle(null);
    setYearFrom(null);
    setYearTo(null);
    setRatingKinopoisk(null);
    setRatingIMDB(null);
    setSorting(SORTING_OPTIONS[0].value);
    setPeriod(PERIOD_OPTIONS[0].value);
    setSortingAsc(false);
    setOnly4K(false);
    setOnlyAC3(false);
    setSkipAds(false);
    setSkipErotic(false);
  }, [
    setGenre,
    setCountry,
    setAge,
    setSubtitle,
    setYearFrom,
    setYearTo,
    setRatingKinopoisk,
    setRatingIMDB,
    setSorting,
    setPeriod,
    setSortingAsc,
    setOnly4K,
    setOnlyAC3,
    setSkipAds,
    setSkipErotic,
  ]);

  const handleOpen = useCallback(() => {
    setIsOpen(true);
  }, []);
  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleApply = useCallback(() => {
    if (isOpen) {
      const params: ItemsParams = {
        sort: `${sortingAsc ? '' : '-'}${sorting}`,
        ...(genre ? { genre } : {}),
        ...(country ? { country } : {}),
        ...(age ? { age } : {}),
        ...(onlyAC3 ? { ac3: 1 } : {}),
        ...(only4K ? { quality: ['4'] } : {}),
        ...(yearFrom || yearTo ? { year: `${yearFrom || last(YEAR_OPTIONS)?.value}-${yearTo || first(YEAR_OPTIONS)?.value}` } : {}),
        ...(subtitle ? { subtitles: subtitle } : {}),
        ...(skipAds || skipErotic
          ? { force: [skipAds && 'advert', skipErotic && 'erotic'].filter(Boolean) as ('advert' | 'erotic')[] }
          : {}),
        ...(period || ratingIMDB || ratingKinopoisk
          ? {
              conditions: [
                period && `created>=${period}`,
                ratingIMDB && `imdb_rating>=${ratingIMDB}`,
                ratingKinopoisk && `kinopoisk_rating>=${ratingKinopoisk}`,
              ].filter(Boolean) as string[],
            }
          : {}),
      };

      onFilter?.(params);
      handleClose();
    }
  }, [
    isOpen,
    genre,
    country,
    yearFrom,
    yearTo,
    subtitle,
    sorting,
    sortingAsc,
    skipAds,
    skipErotic,
    ratingKinopoisk,
    ratingIMDB,
    only4K,
    age,
    onlyAC3,
    period,
    handleClose,
    onFilter,
  ]);
  const handleReset = useCallback(() => {
    if (isOpen) {
      clearFilters();
      onFilter?.(null);
      handleClose();
    }
  }, [isOpen, clearFilters, handleClose, onFilter]);

  useButtonEffect('Red', handleReset);
  useButtonEffect('Green', handleApply);
  useButtonEffect('Blue', handleOpen);

  return (
    <>
      <Button icon="filter_list" className="text-blue-600" onClick={handleOpen} />
      <Popup visible={isOpen} onClose={handleClose}>
        <div className="flex justify-between">
          <Select
            className="my-1"
            label="Жанр"
            value={defaultGenre || genre}
            defaultValue={DEFAULT_ITEM.value}
            onChange={setGenre}
            options={genderOptions}
            splitIn={2}
            disabled={!!defaultGenre}
          />
          <Select
            className="my-1"
            label="Страна"
            value={country}
            defaultValue={DEFAULT_ITEM.value}
            onChange={setCountry}
            options={countryOptions}
            splitIn={2}
          />
        </div>

        <div className="flex justify-between">
          <Select
            className="my-1"
            label="Субтитры"
            value={subtitle}
            defaultValue={DEFAULT_ITEM.value}
            onChange={setSubtitle}
            options={subtitleOptions}
            splitIn={3}
          />
          <Select
            disabled
            className="my-1"
            label="Возраст"
            value={age}
            defaultValue={DEFAULT_ITEM.value}
            onChange={setAge}
            options={ageOptions}
            splitIn={6}
          />
        </div>

        <div className="flex justify-between">
          <Select
            className="my-1"
            label="Год выхода с"
            value={yearFrom}
            defaultValue={DEFAULT_ITEM.value}
            onChange={setYearFrom}
            options={yearOptions}
            splitIn={6}
          />
          <Select
            className="my-1"
            label="Год выхода по"
            value={yearTo}
            defaultValue={DEFAULT_ITEM.value}
            onChange={setYearTo}
            options={yearOptions}
            splitIn={6}
          />
        </div>

        <div className="flex justify-between">
          <Select
            className="my-1"
            label="Рейтинг КиноПоиск"
            value={ratingKinopoisk}
            defaultValue={DEFAULT_ITEM.value}
            onChange={setRatingKinopoisk}
            options={ratingOptions}
            splitIn={5}
          />
          <Select
            className="my-1"
            label="Рейтинг IMDb"
            value={ratingIMDB}
            defaultValue={DEFAULT_ITEM.value}
            onChange={setRatingIMDB}
            options={ratingOptions}
            splitIn={5}
          />
        </div>

        <div className="flex justify-between">
          <Select
            className="my-1"
            label="Сортировка по"
            value={sorting}
            defaultValue={SORTING_OPTIONS[0].value}
            onChange={setSorting}
            options={SORTING_OPTIONS}
            splitIn={2}
          />
          <Select
            className="my-1"
            label="Период за"
            value={period}
            defaultValue={PERIOD_OPTIONS[0].value}
            onChange={setPeriod}
            options={PERIOD_OPTIONS}
            splitIn={3}
          />
        </div>

        <div className="flex justify-between">
          <div className="flex flex-col justify-start w-1/2">
            <Checkbox checked={sortingAsc} onChange={(checked) => setSortingAsc(checked)}>
              Сортировка по возрастанию
            </Checkbox>

            <div className="flex justify-between">
              <Checkbox className="w-1/2" checked={skipAds} onChange={(checked) => setSkipAds(checked)}>
                Без рекламы
              </Checkbox>
              <Checkbox className="w-1/2" checked={skipErotic} onChange={(checked) => setSkipErotic(checked)}>
                Без эротики
              </Checkbox>
            </div>
          </div>
          <div className="flex flex-col justify-start w-1/2">
            <Checkbox checked={only4K} onChange={(checked) => setOnly4K(checked)}>
              Только 4K
            </Checkbox>
            <Checkbox checked={onlyAC3} onChange={(checked) => setOnlyAC3(checked)} disabled>
              Только AC3
            </Checkbox>
          </div>
        </div>

        <div className="flex justify-end">
          <Button className="text-red-600" icon="clear" onClick={handleReset}>
            Сбросить
          </Button>
          <Button className="text-green-600" icon="done" onClick={handleApply}>
            Применить
          </Button>
        </div>
      </Popup>
    </>
  );
};

export default FilterItems;
