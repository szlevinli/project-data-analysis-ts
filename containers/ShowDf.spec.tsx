import { fireEvent, render, screen, within } from '@testing-library/react';
import { DataFrame, date_range } from 'danfojs';
import { none, some } from 'fp-ts/Option';
import React from 'react';
import ShowDf from './ShowDf';

const startDate = new date_range({ start: '2021-8-1', period: 3, freq: 'M' });

const testDF = new DataFrame({
  name: ['levin', 'levin-1', 'levin-2'],
  startDate,
  price: [100.01, 89.2, 64],
});

it('should be render when df is none', () => {
  render(<ShowDf df={none} idSuffix="test" />);

  // df 为 none 下的 Select 控件
  expect(screen.queryByLabelText('字段')).not.toBeNull();

  // df 为 none 下的 Table 控件
  expect(screen.queryByRole('columnheader')).toBeNull();
  const tbody = screen.queryAllByRole('rowgroup')[1];
  expect(within(tbody).queryByRole('row')).toBeNull();
});

it('should be render when df is some', () => {
  render(<ShowDf df={some(testDF)} idSuffix="test" />);

  // Select 控件
  expect(screen.queryByLabelText(/已选择 3/i)).not.toBeNull();

  // 点击下拉列表展示列表内容
  const dropDownButton = screen.getAllByRole('button')[0];
  fireEvent.mouseDown(dropDownButton);
  const checkboxes = screen.getAllByRole<HTMLInputElement>('checkbox');
  expect(checkboxes.length).toEqual(3);

  // Table 控件
  const tbody = screen.queryAllByRole('rowgroup', { hidden: true })[1];
  expect(within(tbody).queryAllByRole('row', { hidden: true }).length).toEqual(
    3
  );

  // 点击下拉列表中第二个 checkbox
  fireEvent.click(checkboxes[1]);
  expect(checkboxes[1].checked).toBeFalsy();
  expect(screen.queryByLabelText(/已选择 2/i)).not.toBeNull();
  expect(screen.getAllByRole('columnheader', { hidden: true }).length).toEqual(
    2
  );

  // 点击下拉列表中第一个 checkbox
  fireEvent.click(checkboxes[0]);
  expect(checkboxes[0].checked).toBeFalsy();
  expect(screen.queryByLabelText(/已选择 1/i)).not.toBeNull();
  expect(screen.getAllByRole('columnheader', { hidden: true }).length).toEqual(
    1
  );

  // 再次点击拉列表中第一个和第二个 checkbox
  fireEvent.click(checkboxes[0]);
  fireEvent.click(checkboxes[1]);
  expect(screen.queryByLabelText(/已选择 3/i)).not.toBeNull();
  expect(screen.getAllByRole('columnheader', { hidden: true }).length).toEqual(
    3
  );
});
