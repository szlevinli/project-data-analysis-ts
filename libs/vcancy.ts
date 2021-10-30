import {
  getDate,
  getDaysInMonth,
  isFirstDayOfMonth,
  isLastDayOfMonth,
} from 'date-fns';
import { always, compose, converge, divide, ifElse, subtract } from 'ramda';

export const daysToMonths = converge(divide, [getDaysInMonth, getDate]);

export const headMonths = ifElse(
  isFirstDayOfMonth,
  always(0),
  compose(subtract(1), daysToMonths)
);

export const tailMonths = ifElse(isLastDayOfMonth, always(0), daysToMonths);
