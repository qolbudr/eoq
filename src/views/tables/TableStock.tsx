// ** MUI Imports
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'

import { IconButton, Button } from '@mui/material'
import { Delete } from 'mdi-material-ui'

interface Props {
  data: any[],
  deleteStock: (id : string) => {},
  month: string[]
}

const TableStock = (props : Props) => {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label='table-stock'>
        <TableHead>
          <TableRow>
            <TableCell>Bulan</TableCell>
            <TableCell align='right'>Beli (Kg)</TableCell>
            <TableCell align='right'>Digunakan (Kg)</TableCell>
            <TableCell align='right'>Sisa (Beli - Digunakan)</TableCell>
            <TableCell align='right'>Aksi</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.data.map((e, index) => (
            <TableRow key={index}>
              <TableCell component='th'>{props.month[e.month]}</TableCell>
              <TableCell align='right'>{e.buy.toLocaleString('de-DE')}</TableCell>
              <TableCell align='right'>{e.use.toLocaleString('de-DE')}</TableCell>
              <TableCell align='right'>{(e.buy - e.use).toLocaleString('de-DE')}</TableCell>
              <TableCell align='right'>
                <IconButton onClick={() => props.deleteStock(e.id)} aria-label='delete'>
                  <Delete />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default TableStock
