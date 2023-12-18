import { Input } from "antd";
import TableComponent from "../../components/TableComponent";

const RegionsPage = () => {
  const treeProps = {
    treeData: resolved,
    value,
    onChange,
    treeCheckable: true,
    showCheckedStrategy: SHOW_PARENT,
    placeholder: "Please select",
    style: {
      width: "90%",
    },
  };
  return (
    <>
      <Input.Search
        placeholder="Choose age(-s)..."
        onSearch={(value) => {
          setSearchedText(value);
        }}
      ></Input.Search>
      <TableComponent
        height={`calc(90vh - 252px)`}
        rowsWithoutSummary={rowsWithoutSummary}
        columns={columns}
        summary={!searchedText ? summary : undefined}
      ></TableComponent>
    </>
  );
};

export default RegionsPage;
