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
  deleteReport: (id : string) => {}
}

const TableStock = (props : Props) => {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label='table-stock'>
        <TableHead>
          <TableRow>
            <TableCell>Tanggal</TableCell>
            <TableCell align='right'>EOQ</TableCell>
            <TableCell align='right'>Frequensi Pemesanan (EOQ)</TableCell>
            <TableCell align='right'>Biaya Pemesanan (EOQ)</TableCell>
            <TableCell align='right'>Biaya Penyimpanan (EOQ)</TableCell>
            <TableCell align='right'>Safety Stock</TableCell>
            <TableCell align='right'>Reorder Point</TableCell>
            <TableCell align='right'>Aksi</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.data.map((e, index) => (
            <TableRow key={index}>
              <TableCell component='th'>{e.date.toDate().toLocaleString().toString()}</TableCell>
              <TableCell align='right'>{e.eoq.toFixed(2) + ' Kg'}</TableCell>
              <TableCell align='right'>{e.frequency.toFixed(2) + ' Kali'}</TableCell>
              <TableCell align='right'>{'Rp. ' + e.orderCost.toFixed(2)}</TableCell>
              <TableCell align='right'>{'Rp. ' + e.saveCost.toFixed(2)}</TableCell>
              <TableCell align='right'>{e.safetyStock.toFixed(2) + ' Kg'}</TableCell>
              <TableCell align='right'>{e.reorderPoint.toFixed(2) + ' Kg'}</TableCell>
              <TableCell align='right'>
                <IconButton onClick={() => props.deleteReport(e.id)} aria-label='delete'>
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
