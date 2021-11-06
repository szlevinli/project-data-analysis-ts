import { waitFor } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import { DataFrame, read_csv } from 'danfojs';
import { Either, fold as eitherFold } from 'fp-ts/Either';
import { constVoid, pipe } from 'fp-ts/lib/function';
import {
  fold as optionFold,
  isNone,
  isSome,
  none,
  Option,
  some,
} from 'fp-ts/Option';
import { useDf } from './useDf';

// jest.mock('danfojs');
jest.mock('danfojs', () => {
  class MockedDataFrame {
    values = [
      [1, 2, 3],
      ['a', 'b', 'c'],
    ];
    columns = ['A', 'B'];
  }
  return {
    DataFrame: MockedDataFrame,
    read_csv: jest.fn(),
  };
});

const mockedReadCsv = read_csv as jest.MockedFunction<typeof read_csv>;

it('should return df', async () => {
  mockedReadCsv.mockResolvedValue(new DataFrame({}));
  const { result, rerender } = renderHook<
    { url: Option<string> },
    Option<Either<Error, DataFrame>>
  >(({ url }) => useDf(url), {
    initialProps: {
      url: none,
    },
  });
  expect(isNone(result.current)).toBeTruthy();

  rerender({ url: some('path1') });
  expect(isNone(result.current)).toBeTruthy();
  await waitFor(() => {
    expect(mockedReadCsv).toBeCalled();
    expect(isSome(result.current)).toBeTruthy();
    pipe(
      result.current,
      optionFold(
        constVoid,
        eitherFold(constVoid, (df) => {
          expect(df.values).toEqual([
            [1, 2, 3],
            ['a', 'b', 'c'],
          ]);
          expect(df.columns).toEqual(['A', 'B']);
        })
      )
    );
  });
});

it('should throw error', async () => {
  mockedReadCsv.mockRejectedValue(new Error('some error'));
  const { result } = renderHook<
    { url: Option<string> },
    Option<Either<Error, DataFrame>>
  >(({ url }) => useDf(url), {
    initialProps: {
      url: some('path1'),
    },
  });

  expect(isNone(result.current)).toBeTruthy();
  await waitFor(() => {
    pipe(
      result.current,
      optionFold(
        constVoid,
        eitherFold((e) => {
          expect(e.message).toEqual('some error');
        }, constVoid)
      )
    );
  });
});
