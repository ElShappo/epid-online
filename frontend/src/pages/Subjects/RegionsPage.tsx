const NewSubjectsPage = () => {
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

export default NewSubjectsPage;
