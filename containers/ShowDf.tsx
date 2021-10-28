import Box from '@mui/material/Box';
import { SelectChangeEvent } from '@mui/material/Select';
import { DataFrame } from 'danfojs';
import { fold as eitherFold } from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { fold as optionFold, none, Option, some } from 'fp-ts/Option';
import { TaskEither } from 'fp-ts/TaskEither';
import React, { FC, useEffect, useState } from 'react';
import Select, { Option as SelectOption } from '../components/Select';
import Table, { Column, TableProps } from '../components/Table';

const columnToColumn = (column: string): Column => ({
  label: column,
  minWidth: 100,
  align: 'right',
  format: (v) => v.toLocaleString(),
});

const columnToOption = (column: string, idx: number): SelectOption => ({
  label: column,
  id: idx,
});

export type ShowDfProps = {
  df: Option<TaskEither<Error, DataFrame>>;
  idSuffix: string;
};

const ShowDf: FC<ShowDfProps> = ({ df, idSuffix }) => {
  const [columns, setColumns] = useState<Array<Column>>([]);
  const [data, setData] = useState<TableProps['data']>([]);
  const [options, setOptions] = useState<Array<SelectOption>>([]);
  const [selectedOptionIds, setSelectedOptionIds] = useState<Array<number>>([]);
  const [innerDf, setInnerDf] = useState<Option<DataFrame>>(none);

  const changeColumnsAndData = (df: DataFrame) => {
    setColumns(df.columns.map(columnToColumn));
    setData(df.values as TableProps['data']);
  };

  const handleSelectedChange = (e: SelectChangeEvent<Array<number>>) => {
    const selectedId = typeof e.target.value === 'string' ? [] : e.target.value;
    const selectedColumns = options
      .filter((option) => selectedId.includes(option.id))
      .map((option) => option.id);

    setSelectedOptionIds(selectedId);
    pipe(
      innerDf,
      optionFold(
        // onNone
        () => {},
        // onSome
        (df) => {
          const df_ = df.iloc({ columns: selectedColumns });
          changeColumnsAndData(df_);
        }
      )
    );
  };

  useEffect(
    () =>
      pipe(
        df,
        optionFold(
          // Options: onNone
          () => {},
          // Options: onSome
          (getDf) => {
            getDf().then((e) =>
              pipe(
                e,
                eitherFold(
                  // Either: onLeft
                  // TODO: refactor to SnackBar
                  console.error,
                  // Either: onRight
                  (d) => {
                    setInnerDf(some(d));
                    changeColumnsAndData(d);
                    setOptions(d.columns.map(columnToOption));
                    setSelectedOptionIds(d.columns.map((_, idx) => idx));
                  }
                )
              )
            );
          }
        )
      ),
    [df]
  );

  return (
    <Box>
      <Select
        labelId={`ShowDf-Select-Label-${idSuffix}`}
        options={options}
        selectedOptionIds={selectedOptionIds}
        handleChange={handleSelectedChange}
      />
      <Table columns={columns} data={data} />
    </Box>
  );
};

export default ShowDf;
