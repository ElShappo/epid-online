import ProgramCard from "../../components/ProgramCard/ProgramCard";
import { ProgramDetails } from "../../types";

const programs: ProgramDetails[] = [
  {
    name: "Работа с демографией",
    description:
      "Эта программа позволяет Вам работать с демографией Российской Федерации: анализировать численность населения в различных возрастных группах, строить графики численности населения по возрастам, оценивать долю сельского и городского населения и т.д.",
    icon: "./population.svg",
    url: "/programs/population",
  },
  {
    name: "Раcчет эпидемиологических показателей",
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
  return (
    <main className="p-6">
      <h1 className="text-center text-2xl font-medium">Список доступных программ</h1>
      <div className="flex flex-wrap justify-center gap-8 pt-6">
        {programs.map((program) => {
          return <ProgramCard {...program} />;
        })}
      </div>
    </main>
  );
};

export default ProgramsPage;
