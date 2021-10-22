import Box from '@mui/material/Box';
import { DataFrame, read_csv } from 'danfojs';
import { fold as eitherFold } from 'fp-ts/Either';
import { none, Option, some } from 'fp-ts/Option';
import { TaskEither, tryCatch } from 'fp-ts/TaskEither';
import type { NextPage } from 'next';
import Head from 'next/head';
import React, { useState } from 'react';
import ChooseFile from '../components/ChooseFile';
import ShowDf from '../components/ShowDf';
import styles from '../styles/Home.module.css';

const createDfFromUrl = (url: string): TaskEither<Error, DataFrame> =>
  tryCatch(
    () => read_csv(url, {}),
    (err) => new Error(String(err))
  );

const Home: NextPage = () => {
  const [df, setDf] = useState<Option<DataFrame>>(none);

  const handleInputFileChange: React.ChangeEventHandler<HTMLInputElement> = (
    e
  ) => {
    const file = e.target.files?.[0];
    const url = URL.createObjectURL(file);
    createDfFromUrl(url)().then(
      eitherFold<Error, DataFrame, void>(
        // TODO: 读取文件失败, 打印错误到控制台. 未来需要修改该方法在界面提醒用户操作失败
        console.error,
        // 读取文件成功
        (df) => {
          setDf(some(df));
        }
      )
    );
  };

  return (
    <Box>
      <ChooseFile
        id="ChooseFile-vacancy"
        handleInputFileChange={handleInputFileChange}
      />
      <ShowDf df={df} />
    </Box>
  );
};

export default Home;
