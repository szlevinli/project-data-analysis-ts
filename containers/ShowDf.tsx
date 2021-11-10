import Box from '@mui/material/Box';
import { SelectChangeEvent } from '@mui/material/Select';
import { DataFrame } from 'danfojs';
import { constVoid, pipe } from 'fp-ts/function';
import { fold as optionFold, Option } from 'fp-ts/Option';
import { range } from 'ramda';
import React, { FC, useEffect, useState } from 'react';
import Select, { Option as SelectOption } from '../components/Select';
import Table, { Column as TableColumn, TableProps } from '../components/Table';

export const createTableColumn = (
  column: string,
  idx: number
): TableColumn => ({
  id: idx,
  label: column,
  minWidth: 100,
  align: 'right',
  format: (v) => v.toLocaleString(),
});

export const createSelectOption = (
  column: string,
  idx: number
): SelectOption => ({
  id: idx,
  label: column,
});

export type ShowDfProps = {
  df: Option<DataFrame>;
  idSuffix: string;
};

const ShowDf: FC<ShowDfProps> = ({ df, idSuffix }) => {
  // For Table component
  const [tableColumns, setTableColumns] = useState<Array<TableColumn>>([]);
  const [tableData, setTableDat] = useState<TableProps['data']>([]);

  // For Select component
  const [selectOptions, setSelectOptions] = useState<Array<SelectOption>>([]);
  const [selectedOptionIds, setSelectedOptionIds] = useState<Array<number>>([]);

  // Inner DataFrame
  // const [subDF, setSubDF] = useState<Option<DataFrame>>(none);

  useEffect(() => {
    const onNoneNothingToDo = constVoid;
    const onRightSetDf = (df: DataFrame) => {
      // setSubDF(some(df));
      changeColumnsAndData(df);
      setSelectOptions(df.columns.map(createSelectOption));
      setSelectedOptionIds(range(0, df.columns.length));
    };
    pipe(
      df,
      optionFold(
        // Options: onNone
        onNoneNothingToDo,
        // Options: onSome
        onRightSetDf
      )
    );
  }, [df]);

  // 从 DataFrame 提取 columns 和 data
  const changeColumnsAndData = (df: DataFrame) => {
    setTableColumns(df.columns.map(createTableColumn));
    setTableDat(df.values as TableProps['data']);
  };

  // Select 组件选择内容改变的事件处理器
  const handleSelectedChange = (e: SelectChangeEvent<Array<number>>) => {
    // 选择的选项IDs(多选)
    const selectedIds = (
      typeof e.target.value === 'string' ? selectedOptionIds : e.target.value
    ).sort();

    setSelectedOptionIds(selectedIds);

    pipe(
      // subDF,
      df,
      optionFold(
        // onNone
        constVoid,
        // onSome
        (df) => {
          changeColumnsAndData(df.iloc({ columns: selectedIds }));
        }
      )
    );
  };

  return (
    <Box>
      <Select
        labelId={`ShowDf-Select-Label-${idSuffix}`}
        options={selectOptions}
        selectedOptionIds={selectedOptionIds}
        handleChange={handleSelectedChange}
      />
      <Table columns={tableColumns} data={tableData} />
    </Box>
  );
};

export default ShowDf;
