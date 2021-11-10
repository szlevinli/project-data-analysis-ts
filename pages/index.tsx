import Box from '@mui/material/Box';
import { DataFrame } from 'danfojs';
import { pipe } from 'fp-ts/function';
import { none, Option, some, fold as optionFold } from 'fp-ts/Option';
import { fold as eitherFold } from 'fp-ts/Either';
import type { NextPage } from 'next';
import { always, compose } from 'ramda';
import React, { ChangeEvent, useEffect, useState } from 'react';
import ChooseFile from '../components/ChooseFile';
import ShowDf from '../containers/ShowDf';
import { useDfFromEvent } from '../libs/hooks/useDf';

const Home: NextPage = () => {
  const [df, setDf] = useState<Option<DataFrame>>(none);
  const [changeEvent, setChangeEvent] =
    useState<Option<ChangeEvent<HTMLInputElement>>>(none);
  const optionEitherDf = useDfFromEvent(changeEvent);

  useEffect(() => {
    // TODO: use stack snake
    const onLeftHandleError = console.log;
    const onRightSetDf = compose<DataFrame, Option<DataFrame>, void>(
      setDf,
      some
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
    </Box>
  );
};

export default Home;
