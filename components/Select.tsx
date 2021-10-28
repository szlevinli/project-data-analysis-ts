import {
  Checkbox,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
} from '@mui/material';
import MuiSelect, { SelectChangeEvent } from '@mui/material/Select';
import React, { FC } from 'react';

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

export type Option = {
  label: string;
  id: number;
};

export type SelectProps = {
  labelId: string;
  options: Array<Option>;
  selectedOptionIds: Array<number>;
  handleChange: (e: SelectChangeEvent<Array<number>>) => void;
};

const Select: FC<SelectProps> = ({
  options,
  selectedOptionIds,
  handleChange,
  labelId,
}) => {
  return (
    <div>
      <FormControl sx={{ m: 2, width: 300 }}>
        <InputLabel id={labelId}>字段</InputLabel>
        <MuiSelect
          labelId={labelId}
          id={`multiple-checkbox-${labelId}`}
          multiple
          value={selectedOptionIds}
          onChange={handleChange}
          input={<OutlinedInput label="fields" />}
          renderValue={(v) => `已选择 ${v.length} 个字段`}
          MenuProps={MenuProps}
        >
          {options.map((option) => (
            <MenuItem key={option.id} value={option.id}>
              <Checkbox checked={selectedOptionIds.includes(option.id)} />
              <ListItemText primary={option.label} />
            </MenuItem>
          ))}
        </MuiSelect>
      </FormControl>
    </div>
  );
};

export default Select;
