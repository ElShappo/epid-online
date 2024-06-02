import { useMemo, useState } from "react";
import ProgramCard from "../../components/ProgramCard/ProgramCard";
import { ProgramDetails } from "../../types";
import { Input } from "antd";

const programs: ProgramDetails[] = [
  {
    name: "Работа с демографией",
    description:
      "Эта программа позволяет Вам работать с демографией Российской Федерации: анализировать численность населения в различных возрастных группах, строить графики численности населения по возрастам, оценивать долю сельского и городского населения и т.д.",
    icon: "./population.svg",
    url: "/programs/population",
  },
  {
    name: "Расчет эпидемиологических показателей",
    description:
      "Эта программа позволяет Вам рассчитывать ряд эпидемиологических показателей, среди которых: интенсивная заболеваемость, контактное число, риск инфицирования и т.д.",
    icon: "./disease.jpg",
    url: "/programs/calculations",
  },
  {
    name: "Карта Российской Федерации",
    description: "Эта программа позволяет Вам напрямую работать с картой субъектов Российской Федерации.",
    icon: "./map.svg",
    url: "/programs/map",
  },
  {
    name: "Расчет доверительных интервалов для распределения Пуассона",
    description: "Эта программа позволяет Вам рассчитывать доверительные интервалы для распределения Пуассона.",
    icon: "./poisson.png",
    url: "/programs/poisson",
  },
];

const ProgramsPage = () => {
  const [filter, setFilter] = useState("");
  const filteredPrograms = useMemo(() => {
    return programs.filter((program) => program.name.includes(filter));
  }, [filter]);

  return (
    <main className="p-6">
      <h1 className="text-center text-2xl font-medium">Список доступных программ</h1>
      <label className="flex flex-col items-center">
        <div className="text-center pt-6 pb-3">Поиск программы по названию: </div>
        <Input
          className="2xl:w-2/5 xl:w-1/2 lg:w-2/3 md:w-5/6 w-full"
          placeholder="Начинайте вводить название программы..."
          value={filter}
          onInput={(evt) => setFilter((evt.target as HTMLInputElement).value)}
        />
      </label>
      <div className="flex flex-wrap justify-center gap-8 pt-6">
        {filteredPrograms.map((program) => {
          return <ProgramCard {...program} />;
        })}
      </div>
    </main>
  );
};

export default ProgramsPage;
