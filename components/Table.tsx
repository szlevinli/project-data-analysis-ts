import Paper from '@mui/material/Paper';
import MuiTable from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { TableCellProps } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import React, { ChangeEvent, FC, useState } from 'react';
import OverflowTip from './OverflowTip';

export interface Column {
  label: string;
  minWidth?: number;
  align?: TableCellProps['align'];
  format?: (value: number) => string;
}

export interface TableProps {
  columns: Array<Column>;
  data: Array<Array<string>>;
}

const Table: FC<TableProps> = ({ columns, data }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (e: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (e: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+e.target.value);
    setPage(0);
  };

  return (
    <Paper
      sx={{
        width: 1,
        overflow: 'hidden',
      }}
    >
      <TableContainer sx={{ maxHeight: 'calc(80vh - 10rem)' }}>
        <MuiTable stickyHeader>
          <TableHead>
            <TableRow>
              {columns.map(
                ({ label, minWidth = 100, align = 'right' }, idx) => (
                  <TableCell key={idx} style={{ minWidth }} align={align}>
                    {label}
                  </TableCell>
                )
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {data
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, i) => (
                <TableRow hover tabIndex={-1} key={i}>
                  {columns.map(({ align, format, minWidth = 100 }, idx) => (
                    <TableCell key={idx} align={align}>
                      <OverflowTip
                        value={
                          format && !isNaN(Number(row[idx]))
                            ? format(+row[idx])
                            : row[idx]
                        }
                        width={minWidth}
                      />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
          </TableBody>
        </MuiTable>
      </TableContainer>
      {data.length > 0 && (
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      )}
    </Paper>
  );
};

export default Table;
