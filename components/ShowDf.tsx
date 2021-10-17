import { DataFrame } from 'danfojs';
import { fold, Option } from 'fp-ts/Option';
import { FC } from 'react';
import Table from './Table';

export type Props = {
  df: Option<DataFrame>;
};

const ShowDf: FC<Props> = ({ df }) => {
  const [columns, data] = fold<DataFrame, [string[], Array<Array<string>>]>(
    () => [[], [[]]],
    (x) => [x.columns, x.values as Array<Array<string>>]
  )(df);

  return <Table columns={columns} data={data} />;
};

export default ShowDf;
