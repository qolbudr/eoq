import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import TableStock from 'src/views/tables/TableStock'
import { Button, CardContent, MenuItem, Modal, TextField } from '@mui/material'
import Box from '@mui/material/Box'
import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { deleteData, deleteReportData, getReportData, getStockData, insertData } from 'src/utils/firebase/database'
import Swal from 'sweetalert2'
import TableReport from 'src/views/tables/TableReport'

const Laporan = (): JSX.Element => {
  const [open, setOpen] = useState<boolean>(false)
  const [data, setData] = useState<any[]>([])

  const [values, setValues] = useState<StoreData>({
    buy: null,
    freqOrder: null,
    month: 0,
    use: null
  })

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const handleChange = (prop: keyof StoreData) => (event: ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [prop]: parseInt(event.target.value) })
  }

  useEffect(() => {
    getStock()
  }, [])

  const getStock = async () => {
    const result = await getReportData()
    setData(result)
  }

  const deleteReport = async (id: string) => {
    const result = await deleteReportData(id)
    getStock()
    Swal.fire({
      title: 'Berhasil',
      text: 'Data berhasil dihapus',
      icon: 'success',
      showConfirmButton: false
    })
  }

  return (
    <>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Typography variant='h5'>
            <Link>Laporan Hasil EOQ</Link>
          </Typography>
          <Typography variant='body2'>Lihat Laporan Hasil Hitung EOQ</Typography>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <CardHeader title='Laporan' titleTypographyProps={{ variant: 'h6' }} />
            <CardContent>
              <TableReport data={data} deleteReport={deleteReport} />
              <Box sx={{ marginBottom: 8 }}></Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  )
}

export default Laporan
