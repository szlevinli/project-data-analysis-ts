import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import { ChangeEventHandler, FC } from 'react';

const input = styled('input');

const NoneDisplayInput = input({
  display: 'none',
});

type Props = {
  id: string;
  handleInputFileChange: ChangeEventHandler<HTMLInputElement>;
};

const ChooseFile: FC<Props> = (props) => (
  <Stack direction="row" alignItems="center" spacing={2}>
    <label htmlFor={props.id}>
      <NoneDisplayInput
        accept=".csv"
        id={props.id}
        type="file"
        onChange={props.handleInputFileChange}
      />
      <Button variant="contained" component="span">
        选择文件
      </Button>
    </label>
  </Stack>
);

export default ChooseFile;
