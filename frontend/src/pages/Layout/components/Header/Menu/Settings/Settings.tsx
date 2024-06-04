import { Button, DatePicker, DatePickerProps, Modal, message } from "antd";
import { useState } from "react";
import { observer } from "mobx-react-lite";
import dayjs from "dayjs";
import SettingsIcon from "@mui/icons-material/Settings";
import { availableYears, defaultYear } from "../../../../../../constants";
import year from "../../../../../../store/year";
import { availableYearsType } from "../../../../../../types";

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

  const defaultFormattedDate = new Date();
  defaultFormattedDate.setFullYear(defaultYear!);

  return (
    <>
      {contextHolder}
      <Button
        size={buttonSize}
        icon={<SettingsIcon fontSize="large" />}
        type="text"
        onClick={showModal}
        className="flex items-center h-auto text-xl"
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
