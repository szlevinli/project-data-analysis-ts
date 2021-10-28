import Box from '@mui/material/Box';
import { DataFrame } from 'danfojs';
import { fold as eitherFold } from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { fold as optionFold, Option } from 'fp-ts/Option';
import { TaskEither } from 'fp-ts/TaskEither';
import React, { FC, useEffect, useState } from 'react';
import Select from '../components/Select';
import Table, { Column, TableProps } from '../components/Table';

const columnTranslate = (column: string): Column => ({
  label: column,
  minWidth: 100,
  align: 'right',
  format: (v) => v.toLocaleString(),
});

export type ShowDfProps = {
  df: Option<TaskEither<Error, DataFrame>>;
  idSuffix: string;
};

const ShowDf: FC<ShowDfProps> = ({ df, idSuffix }) => {
  const [optionNames, setOptionNames] = useState<Array<string>>([]);
  const [columns, setColumns] = useState<Array<Column>>([]);
  const [data, setData] = useState<TableProps['data']>([]);

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
                  console.error,
                  // Either: onRight
                  (d) => {
                    setOptionNames(d.columns);
                    setColumns(d.columns.map(columnTranslate));
                    setData(d.values as TableProps['data']);
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
        optionNames={optionNames}
        handleChange={() => console.log(`ShowDf Component handleChange.`)}
      />
      <Table columns={columns} data={data} />
    </Box>
  );
};

export default ShowDf;
