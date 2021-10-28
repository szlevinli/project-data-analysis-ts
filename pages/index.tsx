import Box from '@mui/material/Box';
import { DataFrame, read_csv } from 'danfojs';
import { pipe } from 'fp-ts/function';
import { fromNullable, map as optionMap, none, Option } from 'fp-ts/Option';
import { TaskEither, tryCatch } from 'fp-ts/TaskEither';
import type { NextPage } from 'next';
import React, { useState } from 'react';
import ChooseFile from '../components/ChooseFile';
import ShowDf from '../containers/ShowDf';

const createDfFromUrl = (url: string): TaskEither<Error, DataFrame> =>
  tryCatch(
    () => read_csv(url, {}),
    (err) => new Error(String(err))
  );

const Home: NextPage = () => {
  const [df, setDf] = useState<Option<TaskEither<Error, DataFrame>>>(none);

  const handleInputFileChange: React.ChangeEventHandler<HTMLInputElement> = (
    e
  ) =>
    pipe(
      e.target.files?.[0],
      fromNullable,
      optionMap(URL.createObjectURL),
      optionMap(createDfFromUrl),
      setDf
    );

  return (
    <Box>
      <ChooseFile
        id="ChooseFile-vacancy"
        handleInputFileChange={handleInputFileChange}
      />
      <ShowDf df={df} idSuffix="vacancy" />
    </Box>
  );
};

export default Home;
