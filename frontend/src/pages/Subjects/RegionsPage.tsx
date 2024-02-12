import React, { useEffect, useState } from "react";
import { Await, useLoaderData, useNavigate } from "react-router-dom";
import { useOutletContext } from "react-router-dom";
import { Button, Input, TreeSelect } from "antd";
import TableComponent from "../../components/TableComponent";
import { columns } from "../../constants";
import FileSaver from "file-saver";
import "./SubjectsPage.css";
import { PopulationSingleYear } from "../../utils";
import ExcelJS from "exceljs";
import { observer } from "mobx-react-lite";
import year from "../../globalStore/year";

const { SHOW_PARENT } = TreeSelect;

const RegionsPage = observer(() => {
  const headerHeight = useOutletContext();
  console.error(headerHeight);

  const { population }: any = useLoaderData();
  const [selectedRegions, setSelectedRegions] = useState<any>();
  const [ageFilters, setAgeFilters] = useState("");
  const navigate = useNavigate();

  const onChange = (newValue: string[]) => {
    console.log("Old value: ", selectedRegions);
    console.log("New value: ", newValue);
    setSelectedRegions(newValue);
  };

  useEffect(() => {
    const url = `/main/subjects/${year}`;
    console.warn(`useEffect triggered with year = ${year}`);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore - the select field needs to be erased
    setSelectedRegions();
    navigate(url);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year.get()]);

  return (
    <div className="main-layout">
      <React.Suspense fallback={<div>Загружаю дерево регионов...</div>}>
        <Await
          resolve={population as PopulationSingleYear}
          errorElement={<div>Не удалось загрузить дерево регионов</div>}
        >
          {(resolved: PopulationSingleYear) => {
            console.log("Subject tree has been loaded");
            console.log(resolved);

            const tProps = {
              treeData: [resolved.getRegions().getAntDesignTreeSelectFormat()],
              value: selectedRegions,
              onChange,
              treeCheckable: true,
              showCheckedStrategy: SHOW_PARENT,
              placeholder: "Выберите регионы",
              style: {
                width: "90%",
              },
            };
            return (
              <>
                <div className="sider">
                  <TreeSelect {...tProps} className="tree" />
                </div>
                {selectedRegions && selectedRegions.length > 0 ? (
                  <div className="table-with-input">
                    <Input.Search
                      placeholder="Укажите диапазон(-ы) возрастов (пример: 1-1, 5-5, 7-10)"
                      onSearch={(value) => {
                        setAgeFilters(value);
                      }}
                    ></Input.Search>
                    <TableComponent
                      height={`calc(90vh - 252px)`}
                      rowsWithoutSummary={resolved
                        .getMergedRegions(selectedRegions)
                        .filter((row) => {
                          if (!ageFilters) {
                            return true;
                          }
                          const requiredRanges = ageFilters.split(", ");
                          const currentRange = `${row.age_start}-${row.age_end}`;
                          return requiredRanges.includes(currentRange);
                        })}
                      columns={columns}
                      summary={undefined}
                      // summary={!ageFilters ? summary : undefined}
                    ></TableComponent>
                    <Button
                      type="primary"
                      className="button-export"
                      onClick={async () => {
                        const workbook = new ExcelJS.Workbook();
                        workbook.addWorksheet("Лист1", {
                          pageSetup: {
                            horizontalCentered: true,
                            verticalCentered: true,
                          },
                        });
                        const worksheet = workbook.getWorksheet("Лист1");

                        let i = 2; // in Excel enumeration starts from 1
                        for (const row of resolved.getMergedRegions(
                          selectedRegions
                        )) {
                          worksheet?.insertRow(i, [
                            +row.year,
                            row.territory,
                            row.territory_code,

                            +row.age_start,
                            +row.age_end,

                            +row.all,
                            +row.all_men,
                            +row.all_women,
                            +row.all_proportion!,
                            +row.urban_all,
                            +row.urban_men,
                            +row.urban_women,
                            +row.urban_proportion!,
                            +row.rural_all,
                            +row.rural_men,
                            +row.rural_women,
                            +row.rural_proportion!,
                          ]);
                          ++i;
                        }
                        worksheet?.insertRow(1, [
                          "Год",
                          "Название",
                          "Код",

                          "Мин. возраст",
                          "Макс. возраст",

                          "Все население",
                          "Все население (мужчины)",
                          "Все население (женщины)",
                          "Все население (пропорция ж/м)",

                          "Городское население",
                          "Городское население (мужчины)",
                          "Городское население (женщины)",
                          "Городское население (пропорция ж/м)",

                          "Сельское население",
                          "Сельское население (мужчины)",
                          "Сельское население (женщины)",
                          "Сельское население (пропорция ж/м)",
                        ]);
                        const buffer = await workbook.xlsx.writeBuffer();
                        FileSaver.saveAs(new Blob([buffer]), "result.xlsx");
                      }}
                    >
                      Экспортировать в Excel
                    </Button>
                  </div>
                ) : null}
              </>
            );
          }}
        </Await>
      </React.Suspense>
    </div>
  );
});

export default RegionsPage;
