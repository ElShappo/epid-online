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
] as const;

export const defaultYear = availableYears.at(-1)

const columns: ColumnsType<DataType> = [
    {
      title: 'Год',
      dataIndex: 'year',
      key: 'year',
      width: 75,
      fixed: 'left',
      align: 'center'
    },
    {
      title: 'Название',
      dataIndex: 'territory',
      key: 'territory',
      width: 200,
      fixed: 'left',
      align: 'center',
      ellipsis: true
    },
    {
      title: 'Код',
      dataIndex: 'territory_code',
      key: 'territory_code',
      width: 75,
      fixed: 'left',
      align: 'center',
      ellipsis: true
    },
    {
      title: 'Мин. возраст',
      dataIndex: 'age_start',
      key: 'age_start',
      width: 85,
      fixed: 'left',
      align: 'center',
    },
    {
      title: 'Макс. возраст',
      dataIndex: 'age_end',
      key: 'age_end',
      width: 85,
      fixed: 'left',
      align: 'center',
    },
    {
      title: 'Все население',
      children: [
        {
          title: 'Мужчины и женщины',
          dataIndex: 'all',
          key: 'all',
          width: 150,
          sorter: (a, b) => +a.all - +b.all,
        },
        {
          title: 'Мужчины',
          dataIndex: 'all_men',
          key: 'all_men',
          width: 150,
          sorter: (a, b) => +a.all_men - +b.all_men,
        },
        {
          title: 'Женщины',
          dataIndex: 'all_women',
          key: 'all_women',
          width: 150,
          sorter: (a, b) => +a.all_women - +b.all_women,
        },
        {
          title: 'Пропорция',
          dataIndex: 'all_proportion',
          key: 'all_proportion',
          width: 150,
          sorter: (a, b) => +a.all_proportion - +b.all_proportion,
        }
      ],
    },
    {
      title: 'Городское население',
      children: [
        {
          title: 'Мужчины и женщины',
          dataIndex: 'urban_all',
          key: 'urban_all',
          width: 150,
          sorter: (a, b) => +a.urban_all - +b.urban_all,
        },
        {
          title: 'Мужчины',
          dataIndex: 'urban_men',
          key: 'urban_men',
          width: 150,
          sorter: (a, b) => +a.urban_men - +b.urban_men,
        },
        {
          title: 'Женщины',
          dataIndex: 'urban_women',
          key: 'urban_women',
          width: 150,
          sorter: (a, b) => +a.urban_women - +b.urban_women,
        },
        {
          title: 'Пропорция',
          dataIndex: 'urban_proportion',
          key: 'urban_proportion',
          width: 150,
          sorter: (a, b) => +a.urban_proportion - +b.urban_proportion,
        }
      ],
    },
    {
      title: 'Сельское население',
      children: [
        {
          title: 'Мужчины и женщины',
          dataIndex: 'rural_all',
          key: 'rural_all',
          width: 150,
          sorter: (a, b) => +a.rural_all - +b.rural_all,
        },
        {
          title: 'Мужчины',
          dataIndex: 'rural_men',
          key: 'rural_men',
          width: 150,
          sorter: (a, b) => +a.rural_men - +b.rural_men,
        },
        {
          title: 'Женщины',
          dataIndex: 'rural_women',
          key: 'rural_women',
          width: 150,
          sorter: (a, b) => +a.rural_women - +b.rural_women,
        },
        {
          title: 'Пропорция',
          dataIndex: 'rural_proportion',
          key: 'rural_proportion',
          width: 150,
          sorter: (a, b) => +a.rural_proportion - +b.rural_proportion,
        }
      ],
    },
  ];

export {availableYears, columns};