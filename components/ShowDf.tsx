import { DataFrame } from 'danfojs';
import { fold, Option } from 'fp-ts/Option';
import React, { FC } from 'react';
import Table from './Table';
import Select from './Select';
import Box from '@mui/material/Box';

export type Props = {
  df: Option<DataFrame>;
};

const ShowDf: FC<Props> = ({ df }) => {
  const [columns, data] = fold<DataFrame, [string[], Array<Array<string>>]>(
    () => [[], [[]]],
    (x) => [x.columns, x.values as Array<Array<string>>]
  )(df);

  return (
    <Box>
      <Select
        labelId="ShowDf-Select-Label"
        optionNames={columns}
        handleChange={() => console.log(`ShowDf Component handleChange.`)}
      />
      <Table columns={columns} data={data} />
    </Box>
  );
};

export default ShowDf;
