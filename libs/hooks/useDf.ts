import { DataFrame, read_csv } from 'danfojs';
import { Either } from 'fp-ts/Either';
import { constVoid, pipe } from 'fp-ts/function';
import {
  fold as optionFold,
  fromNullable,
  map as optionMap,
  none,
  Option,
  some,
} from 'fp-ts/Option';
import { tryCatch } from 'fp-ts/TaskEither';
import { compose } from 'ramda';
import { ChangeEvent, useEffect, useState } from 'react';

export const useDf = (url: Option<string>) => {
  const [df, setDf] = useState<Option<Either<Error, DataFrame>>>(none);

  useEffect(() => {
    pipe(
      url,
      optionFold(constVoid, (urlString) =>
        tryCatch(
          () => read_csv(urlString, {}),
          (err) => new Error(String(err))
        )().then(compose(setDf, some))
      )
    );
  }, [url]);

  return df;
};

export const useDfFromEvent = (
  event: Option<ChangeEvent<HTMLInputElement>>
) => {
  const [df, setDf] = useState<Option<Either<Error, DataFrame>>>(none);

  useEffect(() => {
    pipe(
      event,
      optionFold(
        () => {},
        (e) =>
          pipe(
            e.target.files?.[0],
            fromNullable,
            optionMap(URL.createObjectURL),
            useDf,
            setDf
          )
      )
    );
  }, [event]);

  return df;
};
