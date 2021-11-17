import Box from '@mui/material/Box';
import { DataFrame } from 'danfojs';
import { fold as eitherFold } from 'fp-ts/Either';
import { flow, pipe } from 'fp-ts/function';
import { chainFirst } from 'fp-ts/Identity';
import {
  fold as optionFold,
  map as optionMap,
  none,
  Option,
  some,
} from 'fp-ts/Option';
import type { NextPage } from 'next';
import { always, compose } from 'ramda';
import React, { ChangeEvent, useEffect, useState } from 'react';
import ChooseFile from '../components/ChooseFile';
import ShowDf from '../containers/ShowDf';
import { useDfFromEvent } from '../libs/hooks/useDf';
import { addVacancyMonths } from '../libs/vacancy';

const needColumns = [2, 3, 4, 7, 8, 9, 11, 15];
const dateColumn = '起始日期';

const byILoc = (df: DataFrame) => df.iloc({ columns: needColumns });

const getSubDf = flow(byILoc);

const Home: NextPage = () => {
  const [df, setDf] = useState<Option<DataFrame>>(none);
  const [subDf, setSubDf] = useState<Option<DataFrame>>(none);
  const [changeEvent, setChangeEvent] =
    useState<Option<ChangeEvent<HTMLInputElement>>>(none);
  const optionEitherDf = useDfFromEvent(changeEvent);

  useEffect(() => {
    // TODO: use stack snake
    const onLeftHandleError = console.log;
    const onRightSetDf = flow<
      [DataFrame],
      Option<DataFrame>,
      Option<DataFrame>,
      Option<DataFrame>,
      Option<DataFrame>,
      void
    >(
      some,
      chainFirst<Option<DataFrame>, void>(setDf),
      optionMap(getSubDf),
      optionMap(addVacancyMonths('vacancy_months')(dateColumn)),
      setSubDf
    );
    const onNoneSetDfToNone = compose(setDf, always(none));
    const onSomeSetDfToSomeDf = eitherFold<any, DataFrame, void>(
      onLeftHandleError,
      onRightSetDf
    );
    pipe(optionEitherDf, optionFold(onNoneSetDfToNone, onSomeSetDfToSomeDf));
  }, [optionEitherDf]);

  const handleInputFileChange: React.ChangeEventHandler<HTMLInputElement> =
    compose(setChangeEvent, some);

  return (
    <Box>
      <ChooseFile
        id="ChooseFile-vacancy"
        handleInputFileChange={handleInputFileChange}
      />
      <ShowDf df={df} idSuffix="vacancy" />
      <ShowDf df={subDf} idSuffix="vacancy_sub" />
    </Box>
  );
};

export default Home;
