import { DataType } from "./types";
import type { ColumnsType } from 'antd/es/table';

const availableYears = [
  2009,
  2010,
  2012,
  2013,
  2014,
  2015,
  2016,
  2017,
  2018,
  2019,
  2020,
  2021,
  2022,
  2023
];

const subjects = [
    {
        title: 'Центральный федеральный округ',
        children: [
            "Белгородская область",
            "Брянская область",
            "Владимирская область",
            "Воронежская область",
            "Ивановская область",
            "Калужская область",
            "Костромская область",
            "Курская область",
            "Липецкая область",
            "Московская область",
            "Орловская область",
            "Рязанская область",
            "Смоленская область",
            "Тамбовская область",
            "Тверская область",
            "Тульская область",
            "Ярославская область",
            "г. Москва"
        ] 
    },
    {
        title: 'Северо-Западный федеральный',
        children: [
            "Республика Карелия",
            "Республика Коми",
            "Архангельская область",
            "Ненецкий автономный округ",
            "Архангельская область без автономного округа",
            "Вологодская область",
            "Калининградская область",
            "Ленинградская область",
            "Мурманская область",
            "Новгородская область",
            "Псковская область",
            "г. Санкт-Петербург"
        ]
    },
    {
        title: 'Южный федеральный округ',
        children: [
            "Республика Адыгея",
            "Республика Калмыкия",
            "Республика Крым",
            "Краснодарский край",
            "Астраханская область",
            "Волгоградская область",
            "Ростовская область",
            "г. Севастополь"
        ]
    },
    {
        title: 'Северо-Кавказский федеральный округ',
        children: [
            "Республика Дагестан",
            "Республика Ингушетия",
            "Кабардино-Балкарская Республика",
            "Карачаево-Черкесская Республика",
            "Республика Северная Осетия – Алания",
            "Чеченская Республика",
            "Ставропольский край"
        ]
    },
    {
        title: 'Приволжский федеральный округ',
        children: [
            "Республика Башкортостан",
            "Республика Марий Эл",
            "Республика Мордовия",
            "Республика Татарстан",
            "Удмуртская Республика",
            "Чувашская Республика",
            "Пермский край",
            "Кировская область",
            "Нижегородская область",
            "Оренбургская область",
            "Пензенская область",
            "Самарская область",
            "Саратовская область",
            "Ульяновская область"
        ]
    },
    {
        title: 'Уральский федеральный округ',
        children: [
            "Курганская область",
            "Свердловская область",
            "Тюменская область",
            "Ханты-Мансийский автономный округ – Югра",
            "Ямало-Ненецкий автономный округ",
            "Тюменская область без автономных округов",
            "Челябинская область"
        ]
    },
    {
        title: 'Сибирский федеральный округ',
        children: [
            "Республика Алтай",
            "Республика Тыва",
            "Республика Хакасия",
            "Алтайский край",
            "Красноярский край",
            "Иркутская область",
            "Кемеровская область – Кузбасс",
            "Новосибирская область",
            "Oмская область",
            "Томская область"
        ]
    },
    {
        title: 'Дальневосточный федеральный округ',
        children: [
            "Республика Бурятия",
            "Республика Саха (Якутия)",
            "Забайкальский край",
            "Камчатский край",
            "Приморский край",
            "Хабаровский край",
            "Амурская область",
            "Магаданская область",
            "Сахалинская область",
            "Еврейская автономная область",
            "Чукотский автономный округ"
        ]
    }
];

const columns: ColumnsType<DataType> = [
    {
      title: 'Число лет',
      dataIndex: 'age',
      key: 'age',
      width: 75,
      fixed: 'left',
      // filters: [
      //   {
      //     text: 'Joe',
      //     value: 'Joe',
      //   },
      //   {
      //     text: 'Category 1',
      //     value: 'Category 1',
      //   },
      //   {
      //     text: 'Category 2',
      //     value: 'Category 2',
      //   },
      // ],
      // filterSearch: true,
      // onFilter: (value: any, record) => String(record.age).startsWith(value),
    },
    {
      title: 'All population',
      children: [
        {
          title: 'Males and females',
          dataIndex: 'malesFemalesAll',
          key: 'malesFemalesAll',
          width: 150,
          sorter: (a, b) => +a.malesFemalesAll - +b.malesFemalesAll,
        },
        {
          title: 'Males',
          dataIndex: 'malesAll',
          key: 'malesAll',
          width: 150,
          sorter: (a, b) => +a.malesAll - +b.malesAll,
        },
        {
          title: 'Females',
          dataIndex: 'femalesAll',
          key: 'femalesAll',
          width: 150,
          sorter: (a, b) => +a.femalesAll - +b.femalesAll,
        },
        {
          title: 'Proportion',
          dataIndex: 'proportionAll',
          key: 'proportionAll',
          width: 150,
          sorter: (a, b) => +a.proportionAll - +b.proportionAll,
        }
      ],
    },
    {
      title: 'City population',
      children: [
        {
          title: 'Males and females',
          dataIndex: 'malesFemalesCity',
          key: 'malesFemalesCity',
          width: 150,
          sorter: (a, b) => +a.malesFemalesCity - +b.malesFemalesCity,
        },
        {
          title: 'Males',
          dataIndex: 'malesCity',
          key: 'malesCity',
          width: 150,
          sorter: (a, b) => +a.malesCity - +b.malesCity,
        },
        {
          title: 'Females',
          dataIndex: 'femalesCity',
          key: 'femalesCity',
          width: 150,
          sorter: (a, b) => +a.femalesCity - +b.femalesCity,
        },
        {
          title: 'Proportion',
          dataIndex: 'proportionCity',
          key: 'proportionCity',
          width: 150,
          sorter: (a, b) => +a.proportionCity - +b.proportionCity,
        }
      ],
    },
    {
      title: 'Rural population',
      children: [
        {
          title: 'Males and females',
          dataIndex: 'malesFemalesRural',
          key: 'malesFemalesRural',
          width: 150,
          sorter: (a, b) => +a.malesFemalesRural - +b.malesFemalesRural,
        },
        {
          title: 'Males',
          dataIndex: 'malesRural',
          key: 'malesRural',
          width: 150,
          sorter: (a, b) => +a.malesRural - +b.malesRural,
        },
        {
          title: 'Females',
          dataIndex: 'femalesRural',
          key: 'femalesRural',
          width: 150,
          sorter: (a, b) => +a.femalesRural - +b.femalesRural,
        },
        {
          title: 'Proportion',
          dataIndex: 'proportionRural',
          key: 'proportionRural',
          width: 150,
          sorter: (a, b) => +a.proportionRural - +b.proportionRural,
        }
      ],
    },
  ];

export {availableYears, subjects, columns};