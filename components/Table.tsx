import React, { FC, useState, ChangeEvent } from 'react';
import Paper from '@mui/material/Paper';
import TableContainer from '@mui/material/TableContainer';
import MuiTable from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { Calculate } from '@mui/icons-material';

// TODO: 需要应用该接口
export interface Column {
  id: string;
  label: string;
  minWidth?: number;
  align?: 'right';
  format?: (value: number) => string;
}

interface Props {
  columns: Array<string>;
  data: Array<Array<string>>;
}

const Table: FC<Props> = (props) => {
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
      <TableContainer sx={{ maxHeight: 'calc(80vh - 200px)' }}>
        <MuiTable stickyHeader>
          <TableHead>
            <TableRow>
              {props.columns.map((column) => (
                // TODO:  minWidth 需要参数化
                <TableCell key={column} style={{ minWidth: 100 }}>
                  {column}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {props.data
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, i) => (
                <TableRow hover tabIndex={-1} key={i}>
                  {row.map((d, j) => (
                    <TableCell key={j}>{d}</TableCell>
                  ))}
                </TableRow>
              ))}
          </TableBody>
        </MuiTable>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={props.data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default Table;
