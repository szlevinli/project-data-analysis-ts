import React, { FC, useEffect, useState } from 'react';
import MuiSelect, { SelectChangeEvent } from '@mui/material/Select';
import { times, identity, contains } from 'ramda';
import {
  Checkbox,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
} from '@mui/material';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export type Props = {
  labelId: string;
  optionNames: Array<string>;
  handleChange: (e: SelectChangeEvent<Array<number>>) => void;
};

const Select: FC<Props> = ({ optionNames, handleChange, labelId }) => {
  const [selected, setSelected] = useState<Array<number>>([]);

  useEffect(() => {
    setSelected(optionNames.map((_, idx) => idx));
  }, [optionNames]);

  const handleChange_ = (e: SelectChangeEvent<Array<number>>) => {
    const v = e.target.value;
    console.log(v);
    setSelected(typeof v === 'string' ? selected : v);
  };
  return (
    <div>
      <FormControl sx={{ m: 1, width: 300 }}>
        <InputLabel id={labelId}>字段</InputLabel>
        <MuiSelect
          labelId={labelId}
          id="project-data-analysis-multiple-checkbox"
          multiple
          value={selected}
          onChange={handleChange_}
          input={<OutlinedInput label="fields" />}
          renderValue={(v) => `已选择 ${v.length} 个字段`}
          MenuProps={MenuProps}
        >
          {optionNames.map((optionName, idx) => (
            <MenuItem key={idx} value={idx}>
              <Checkbox checked={contains(idx, selected)} />
              <ListItemText primary={optionName} />
            </MenuItem>
          ))}
        </MuiSelect>
      </FormControl>
    </div>
  );
};

export default Select;
