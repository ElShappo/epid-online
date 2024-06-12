import { useEffect, useMemo, useState } from "react";
import { Button, Input, TreeSelect } from "antd";
import FileSaver from "file-saver";
import ExcelJS from "exceljs";
import { observer } from "mobx-react-lite";
import TableComponent from "../TableComponent/TableComponent";
import { columns, loadingRegionsMessage } from "../../../../../constants";
import year from "../../../../../store/year";
import headerHeight from "../../../../../store/headerHeight";
import Loader from "../../../../../components/Loader/Loader";
import { PopulationSingleYear } from "../../classes/PopulationSingleYear";

const { SHOW_PARENT } = TreeSelect;

const RegionsPage = observer(() => {
  const [populationPerRegions, setPopulationPerRegions] = useState<PopulationSingleYear>();
  const [gotRegions, setGotRegions] = useState<boolean>(false);
  const [selectedRegions, setSelectedRegions] = useState<string[]>();
  const [ageFilters, setAgeFilters] = useState("");

  const treeData = useMemo(() => {
    const onChange = (newValue: string[]) => {
      console.log("Old value: ", selectedRegions);
      console.log("New value: ", newValue);
      setSelectedRegions(newValue);
    };
    return {
      treeData: [populationPerRegions?.getRegions()?.getAntDesignTreeSelectFormat()],
      value: selectedRegions,
      onChange,
      treeCheckable: true,
      showCheckedStrategy: SHOW_PARENT,
      placeholder: "Выберите регионы",
    };
  }, [populationPerRegions, selectedRegions]);

  useEffect(() => {
    async function init() {
      console.log(`useEffect triggered with year = ${year.get()}`);
      const populationSingleYear = new PopulationSingleYear(year.get());
      try {
        await populationSingleYear.setRegions();
        setPopulationPerRegions(populationSingleYear);
        setGotRegions(true);
      } catch (error) {
        console.error("could not load regions");
        console.error(error);
      }
    }
    init();
    return () => {
      setGotRegions(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year.get()]);

  return gotRegions ? (
    <div className="flex gap-3 w-full max-md:flex-col">
      <div
        className={
          !selectedRegions || !selectedRegions.length
            ? "flex items-center justify-center w-full px-96 max-xl:px-64 max-lg:px-36 max-sm:px-0"
            : "md:flex-none md:w-[20%]"
        }
      >
        <TreeSelect {...(treeData as any)} className="h-auto w-full" />
      </div>
      {selectedRegions && selectedRegions.length ? (
        <div className="md:flex-initial md:w-[80%]">
          <Input.Search
            placeholder="Укажите диапазон(-ы) возрастов (пример: 1-1, 5-5, 7-10)"
            onSearch={(value) => {
              setAgeFilters(value);
            }}
          ></Input.Search>
          <TableComponent
            height={`calc(100vh - ${headerHeight.get()}px - 270px)`}
            rowsWithoutSummary={populationPerRegions!.getMergedRegions(selectedRegions).filter((row) => {
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
            className="w-full"
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
              for (const row of populationPerRegions!.getMergedRegions(selectedRegions)) {
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
    </div>
  ) : (
    <Loader text={loadingRegionsMessage} height={`calc(100vh - ${headerHeight.get()}px - 117px)`} />
  );
});

export default RegionsPage;
