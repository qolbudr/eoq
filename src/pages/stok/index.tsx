import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import TableStock from 'src/views/tables/TableStock'
import { Button, CardContent, MenuItem, Modal, TextField } from '@mui/material'
import Box from '@mui/material/Box'
import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { deleteData, getStockData, insertData } from 'src/utils/firebase/database'
import Swal from 'sweetalert2'

const Stock = (): JSX.Element => {
  const [open, setOpen] = useState<boolean>(false)
  const [data, setData] = useState<any[]>([])

  const [values, setValues] = useState<StoreData>({
    buy: null,
    freqOrder: null,
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
    use: null
  })

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const handleChange = (prop: keyof StoreData) => (event: ChangeEvent<HTMLInputElement>) => {
    if (prop == 'month') {
      let date = new Date(event.target.value)
      let month = date.getMonth()
      let year = date.getFullYear()
      setValues({ ...values, year: year, [prop]: month })
    } else {
      setValues({ ...values, [prop]: parseInt(event.target.value) })
    }
  }

  useEffect(() => {
    getStock()
  }, [])

  const getStock = async () => {
    const result = await getStockData()
    setData(result)
  }

  const deleteStock = async (id: string) => {
    const result = await deleteData(id)
    getStock()
    Swal.fire({
      title: 'Berhasil',
      text: 'Data berhasil dihapus',
      icon: 'success',
      showConfirmButton: false
    })
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    await insertData(values)
    handleClose()
    getStock()
    Swal.fire({
      title: 'Berhasil',
      text: 'Data berhasil ditambahkan',
      icon: 'success',
      showConfirmButton: false
    })
    setValues({
      buy: null,
      freqOrder: null,
      month: new Date().getMonth(),
      year: new Date().getFullYear(),
      use: null
    })
  }

  const month = [
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember'
  ]

  return (
    <>
      <Grid container spacing={6}>
        <Grid item xs={12} md={8} lg={10}>
          <Typography variant='h5'>
            <Link>Stok Bahan Baku Kedelai</Link>
          </Typography>
          <Typography variant='body2'>Kelola data bahan baku kedelai pada Pabrik Tahu Kabul Group</Typography>
        </Grid>
        <Grid item xs={12} md={4} lg={2}>
          <Button onClick={handleOpen} fullWidth size='large' variant='contained'>
            Tambah Data
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <CardHeader title='Stok Bahan' titleTypographyProps={{ variant: 'h6' }} />
            <CardContent>
              <TableStock data={data} deleteStock={deleteStock} month={month} />
              <Box sx={{ marginBottom: 8 }}></Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
      >
        <Box
          sx={{
            position: 'absolute' as 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 500,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4
          }}
        >
          <Typography sx={{ marginBottom: '30px' }} id='modal-modal-title' variant='h6' component='h2'>
            Tambah Data
          </Typography>
          <form onSubmit={handleSubmit}>
            {/* <TextField
              onChange={handleChange('month')}
              sx={{ marginBottom: 4 }}
              id='outlined-select-month'
              select
              fullWidth
              label='Pilih Bulan'
              defaultValue='0'
              value={values.month}
              required
            >
              {month.map((option, index) => (
                <MenuItem key={index} value={index}>
                  {option}
                </MenuItem>
              ))}
            </TextField> */}
            <TextField
              onChange={handleChange('month')}
              fullWidth
              id='outlined-select-montht'
              label='Pilih Bulan'
              hiddenLabel={true}
              sx={{ marginBottom: 4 }}
              required={true}
              value={`${values.year}-${values.month.toString().length == 1 ? '0' + `${values.month + 1}` : values.month + 1}`}
              type='month'
            />
            <TextField
              onChange={handleChange('buy')}
              fullWidth
              id='buy-count'
              label='Jumlah Pembelian (Kg)'
              sx={{ marginBottom: 4 }}
              required={true}
              value={values.buy}
              type='number'
            />
            <TextField
              onChange={handleChange('freqOrder')}
              fullWidth
              id='freq-order'
              label='Frekuensi Pembelian Bulan Dipilih'
              sx={{ marginBottom: 4 }}
              required={true}
              value={values.freqOrder}
              type='number'
            />
            <TextField
              onChange={handleChange('use')}
              fullWidth
              id='use'
              label='Jumlah Bahan Digunakan (Kg)'
              sx={{ marginBottom: 4 }}
              required={true}
              value={values.use}
              type='number'
            />
            <Button type={'submit'} fullWidth size='large' variant='contained'>
              Simpan
            </Button>
          </form>
        </Box>
      </Modal>
    </>
  )
}

export default Stock
