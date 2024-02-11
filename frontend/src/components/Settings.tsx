import {
  Button,
  DatePicker,
  DatePickerProps,
  // Input,
  Modal,
  message,
} from "antd";
import { useState } from "react";
import { SettingOutlined } from "@ant-design/icons";
import { observer } from "mobx-react-lite";
import year from "../globalStore/year";
import { availableYears, defaultYear } from "../constants";
import { availableYearsType } from "../types";
import dayjs from "dayjs";

type SettingsProps = {
  buttonSize: "small" | "middle" | "large";
};

const Settings = observer(({ buttonSize }: SettingsProps) => {
  const [open, setOpen] = useState(false);
  const [, contextHolder] = message.useMessage();

  const showModal = () => {
    setOpen(true);
  };

  const handleOk = () => {
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const onChange: DatePickerProps["onChange"] = (date, dateString) => {
    console.log(date);
    console.log(dateString);
    console.log(date?.year());

    if (date?.year()) {
      year.set(date?.year() as availableYearsType);
    }
  };

  function disabledYears(current: any) {
    return !availableYears.includes(current.year());
  }

  // const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
  //   const input: string = (e.target as any).value;

  //   try {
  //     const result = parsePositiveNumberRanges(input);
  //     years.replace(Array.from(result));
  //     console.log(`Parsed years from input: ${result}`);
  //   } catch (error) {
  //     console.error(error);

  //     if (error instanceof BoundsOrderException) {
  //       messageApi.open({
  //         type: "error",
  //         content: `Неверный порядок в диапазоне: поменяйте местами ${error.left} и ${error.right}`,
  //       });
  //     } else {
  //       messageApi.open({
  //         type: "error",
  //         content: `Неверный формат`,
  //       });
  //     }
  //   }
  // };

  const defaultFormattedDate = new Date();
  defaultFormattedDate.setFullYear(defaultYear!);

  return (
    <>
      {contextHolder}
      <Button
        size={buttonSize}
        icon={<SettingOutlined />}
        type="primary"
        onClick={showModal}
      >
        Настройки
      </Button>
      <Modal
        title="Настройки"
        centered
        open={open}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={
          [
            // <Button key="submit" type="primary" onClick={handleOk}>
            //   Подтвердить
            // </Button>,
          ]
        }
      >
        <div style={{ display: "flex", gap: "0.5em", alignItems: "center" }}>
          <DatePicker
            onChange={onChange}
            picker="year"
            disabledDate={disabledYears}
            placeholder="Выберите год"
            style={{ flex: "1 1 0" }}
            defaultValue={dayjs(defaultFormattedDate)}
          />
          {/* <div style={{ flex: "1 1 0", whiteSpace: "nowrap" }}>
            Введите год(-ы):
          </div>
          <Input
            placeholder="Пример: 2010, 2013, 2015-2019"
            style={{ flex: "1 1 80%" }}
            onPressEnter={handleEnter}
          /> */}
        </div>
      </Modal>
    </>
  );
});

export default Settings;
