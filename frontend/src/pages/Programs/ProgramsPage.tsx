import { useMemo, useState } from "react";
import { ProgramDetails } from "../../types";
import { Divider, Input } from "antd";
import ProgramCard from "./components/ProgramCard/ProgramCard";
import { noResults } from "../../constants";
import { observer } from "mobx-react-lite";

const programs: ProgramDetails[] = [
  {
    name: "Работа с демографией",
    description:
      "Эта программа позволяет Вам работать с демографией Российской Федерации: анализировать численность населения в различных возрастных группах, строить графики численности населения по возрастам, оценивать долю сельского и городского населения и т.д.",
    icon: "/programIcons/population.svg",
    url: "/programs/population",
  },
  {
    name: "Расчет эпидемиологических показателей",
    description:
      "Эта программа позволяет Вам рассчитывать ряд эпидемиологических показателей, среди которых: интенсивная заболеваемость, контактное число, риск инфицирования и т.д.",
    icon: "/programIcons/disease.jpg",
    url: "/programs/calculations",
  },
  {
    name: "Карта Российской Федерации",
    description: "Эта программа позволяет Вам напрямую работать с картой субъектов Российской Федерации.",
    icon: "/programIcons/map.svg",
    url: "/programs/map",
  },
  {
    name: "Расчет доверительных интервалов для распределения Пуассона",
    description: "Эта программа позволяет Вам рассчитывать доверительные интервалы для распределения Пуассона.",
    icon: "/programIcons/poisson.png",
    url: "/programs/poisson",
  },
];

const ProgramsPage = observer(() => {
  const [filter, setFilter] = useState("");
  const filteredPrograms = useMemo(() => {
    return programs.filter((program) => program.name.includes(filter));
  }, [filter]);

  return (
    <section className="p-4 overflow-y-auto">
      <label className="flex flex-col items-center">
        <div className="text-center pb-3">Поиск программы по названию: </div>
        <Input
          className="2xl:w-2/5 xl:w-1/2 lg:w-2/3 md:w-5/6 w-full"
          placeholder="Начинайте вводить название программы..."
          value={filter}
          onInput={(evt) => setFilter((evt.target as HTMLInputElement).value)}
        />
      </label>
      <Divider className="mt-5" />
      <div className="flex flex-wrap justify-center gap-8 overflow-y-auto">
        {filteredPrograms.length
          ? filteredPrograms.map((program) => {
              return <ProgramCard {...program} />;
            })
          : noResults}
      </div>
    </section>
  );
});

export default ProgramsPage;
