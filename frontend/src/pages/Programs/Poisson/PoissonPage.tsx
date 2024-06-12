import { Button, Form, Input } from "antd";
import { useMemo, useRef, useState } from "react";
import quantile from "@stdlib/stats/base/dists/chisquare/quantile";
import { defaultP } from "../../../constants";

const CalculationsIntervals = () => {
  const [form] = Form.useForm();
  const submitButton = useRef<any>();

  const [value, setValue] = useState<string>();
  const [pValue, setPValue] = useState<string>(defaultP.toString());

  function handleValueInput(evt: React.FormEvent<HTMLInputElement>) {
    setValue((evt.target as HTMLInputElement).value);
    form.validateFields();
  }

  function handlePValueInput(evt: React.FormEvent<HTMLInputElement>) {
    setPValue((evt.target as HTMLInputElement).value);
    form.validateFields();
  }

  const lowerBound = useMemo(() => {
    if (pValue == undefined || value == undefined) {
      return NaN;
    }
    return 0.5 * quantile(+pValue / 2, 2 * +value);
  }, [value, pValue]);

  const upperBound = useMemo(() => {
    if (pValue == undefined || value == undefined) {
      return NaN;
    }
    return 0.5 * quantile(1 - +pValue / 2, 2 * (+value + 1));
  }, [value, pValue]);

  const lowerError = useMemo(() => {
    if (value == undefined) {
      return NaN;
    }
    return Math.abs(+value - lowerBound);
  }, [lowerBound, value]);

  const upperError = useMemo(() => {
    if (value == undefined) {
      return NaN;
    }
    return Math.abs(upperBound - +value);
  }, [upperBound, value]);

  return (
    <section className="flex flex-col justify-center items-center gap-y-8 pt-16 max-md:pt-8 p-4">
      <Form
        className="px-8 pt-4 flex flex-col 2xl:w-2/5 xl:w-1/2 lg:w-2/3 md:w-5/6 w-full card"
        name="poisson-calculator"
        form={form}
        autoComplete="off"
        onValuesChange={() => {
          submitButton.current.click();
        }}
      >
        <Form.Item
          name="value"
          label={<span className="text-base">Полученное значение</span>}
          rules={[
            {
              validator: (_, value) => {
                if (+value >= 0) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("Число должно быть больше или равно 0"));
              },
            },
          ]}
        >
          <Input value={value} onInput={handleValueInput} size="large" />
        </Form.Item>
        <Form.Item
          initialValue={pValue}
          name="pValue"
          label={<span className="text-base">Уровень статистической значимости p</span>}
          rules={[
            {
              validator: (_, value) => {
                if (+value >= 0 && +value <= 1) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("Число доложно быть в диапазоне [0;1]"));
              },
            },
          ]}
        >
          <Input value={pValue} onInput={handlePValueInput} size="large" />
        </Form.Item>

        <Button className="hidden" ref={submitButton} type="primary" htmlType="submit"></Button>
      </Form>

      <Form className="px-8 pt-4 flex flex-col 2xl:w-2/5 xl:w-1/2 lg:w-2/3 md:w-5/6 w-full card" disabled>
        <Form.Item label={<span className="text-base">Нижняя доверительная граница</span>}>
          <Input value={isNaN(lowerBound) ? "ошибка" : lowerBound} size="large" />
        </Form.Item>
        <Form.Item label={<span className="text-base">Верхняя доверительная граница</span>}>
          <Input value={isNaN(upperBound) ? "ошибка" : upperBound} size="large" />
        </Form.Item>
        <Form.Item label={<span className="text-base">Погрешность -</span>}>
          <Input value={isNaN(lowerError) ? "ошибка" : lowerError} size="large" />
        </Form.Item>
        <Form.Item label={<span className="text-base">Погрешность +</span>}>
          <Input value={isNaN(upperError) ? "ошибка" : upperError} size="large" />
        </Form.Item>
      </Form>
    </section>
  );
};

export default CalculationsIntervals;
