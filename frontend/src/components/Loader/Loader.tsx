import { Spin } from "antd";

type LoaderProps = {
  text: string;
  height: string;
};

const Loader = (loaderProps: LoaderProps) => {
  return (
    <section className="flex flex-col justify-center items-center" style={{ height: loaderProps.height }}>
      <Spin tip={loaderProps.text} />
      <h2 className="text-xl pt-4">{loaderProps.text}</h2>
    </section>
  );
};

export default Loader;
