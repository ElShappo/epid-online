const DescriptionPage = () => {
  return (
    <main className="flex justify-center text-2xl pt-4">
      <section className="flex flex-col gap-8 xl:w-2/3 p-4">
        <p className="card p-6">
          Основная сфера использования данного приложения - проведение демографического анализа субъектов Российской
          Федерации, а также оценка ряда эпидемиологических показателей.
        </p>
        <p className="card p-6">
          Помимо прочего, это приложение легко расширяемо, что позволяет добавлять в него новые подпрограммы без
          изменения старого функционала.
        </p>
        <p className="card p-6">
          Данное приложение написано с использованием таких технологий как: <b>TypeScript</b>, <b>React</b>,{" "}
          <b>Ant Design</b>,<b>TailwindCSS</b>, <b>Plotly</b>, <b>ExcelJS</b>
        </p>
      </section>
    </main>
  );
};

export default DescriptionPage;
