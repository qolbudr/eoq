import { Alert, AlertTitle, Box, Button, Card, CardContent, CardHeader, Link, MenuItem, TextField } from '@mui/material'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { Equation, EquationEvaluate, EquationOptions, defaultErrorHandler } from 'react-equation'
import {
  averageStock,
  costOrderEOQ,
  getAvgUse,
  getCostEveryOrder,
  getCountStock,
  getEOQ,
  getFrequent,
  getSafetyStock,
  getSaveCost,
  orderRound,
  saveCostEOQ
} from 'src/utils/eoq'
import { getDataMonth, getMaxUse, getStockData, insertReport } from 'src/utils/firebase/database'
import Swal from 'sweetalert2'

interface State {
  orderCost: number
  saveCost: number
}

const Eoq = (): JSX.Element => {
  const [data, setData] = useState<any>()
  const [isCalculated, setCalculate] = useState<boolean>(false)
  const [values, setValues] = useState<State>({
    orderCost: 350000,
    saveCost: 13200000
  })

  const [countStock, setCountStock] = useState<number>(0)
  const [frequent, setFrequent] = useState<number>(0)
  const [costEveryOrder, setCostEveryOrder] = useState<number>(0)
  const [saveCost, setSaveCost] = useState<number>(0)
  const [eoq, setEoq] = useState<number>(0)
  const [avgStock, setAverageStock] = useState<number>(0)
  const [orderRnd, setOrderRound] = useState<number>(0)
  const [cOrder, setcOrder] = useState<number>(0)
  const [sCost, setsCost] = useState<number>(0)
  const [maxuse, setMaxuse] = useState<number>(0)
  const [avgUse, setAvgUse] = useState<number>(0)
  const [safetyStock, setSafetyStock] = useState<number>(0)

  const handleChange = (prop: keyof State) => (event: ChangeEvent<HTMLInputElement>) => {
    setCalculate(false)
    setValues({ ...values, [prop]: parseInt(event.target.value) })
  }

  useEffect(() => {
    getData()
  }, [])

  useEffect(() => {
    setEoq(getEOQ(countStock, costEveryOrder, saveCost))
  }, [countStock, costEveryOrder, saveCost])

  useEffect(() => {
    setAverageStock(averageStock(eoq))
    setOrderRound(orderRound(countStock, eoq))
  }, [eoq])

  useEffect(() => {
    setcOrder(costOrderEOQ(countStock, avgStock, costEveryOrder))
    setsCost(saveCostEOQ(avgStock, saveCost))
  }, [avgStock])

  const getData = async () => {
    const result = await getStockData()
    const maxuseRes = await getMaxUse()
    setMaxuse(maxuseRes[0].use)
    const stockCount = getCountStock(result)
    setCountStock(stockCount)
    setFrequent(getFrequent(result))
    setAvgUse(getAvgUse(result))
    setData(result)
  }

  const calculate = async (event: FormEvent) => {
    event.preventDefault()
    setCostEveryOrder(getCostEveryOrder(values.orderCost, frequent))
    setSaveCost(getSaveCost(values.saveCost, countStock))
    setEoq(getEOQ(countStock, costEveryOrder, saveCost))
    setAverageStock(averageStock(eoq))
    setOrderRound(orderRound(countStock, eoq))
    setcOrder(costOrderEOQ(countStock, avgStock, costEveryOrder))
    setsCost(saveCostEOQ(avgStock, saveCost))
    setSafetyStock(getSafetyStock(maxuse, avgUse))
    setCalculate(true)
  }

  const saveReport = async () => {
    await insertReport({
      date: new Date(),
      eoq: eoq,
      frequency: orderRnd,
      orderCost: cOrder,
      saveCost: sCost,
      safetyStock: safetyStock,
      reorderPoint: 3 * (eoq / orderRnd)
    })

    Swal.fire({
      title: 'Berhasil',
      text: 'Data berhasil disimpan',
      icon: 'success',
      showConfirmButton: false
    })
  }

  return (
    <>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Typography variant='h5'>
            <Link>Hitung EOQ</Link>
          </Typography>
          <Typography variant='body2'>Untuk menghitung EOQ silahkan isi form berikut</Typography>
        </Grid>
        <Grid item xs={12} md={12} lg={4}>
          <Card>
            <CardHeader title='Hitung EOQ' titleTypographyProps={{ variant: 'h6' }} />
            <CardContent>
              <form onSubmit={calculate}>
                <TextField
                  fullWidth
                  id='order-cost'
                  onChange={handleChange('orderCost')}
                  label='Total Biaya Pemesanan'
                  sx={{ marginBottom: 4, marginTop: 4 }}
                  type='number'
                  value={values.orderCost}
                  required
                />
                <TextField
                  fullWidth
                  onChange={handleChange('saveCost')}
                  id='save-cost'
                  label='Total Biaya Penyimpanan'
                  sx={{ marginBottom: 30 }}
                  type='number'
                  value={values.saveCost}
                  required
                />
                <Button type='submit' fullWidth size='large' variant='contained'>
                  Hitung
                </Button>
                {isCalculated ? (
                  <Button onClick={saveReport} sx={{ marginTop: 3 }} fullWidth size='large' variant='outlined'>
                    Simpan
                  </Button>
                ) : (
                  <></>
                )}
              </form>
            </CardContent>
          </Card>
        </Grid>
        {isCalculated ? (
          <>
            <Grid item xs={12} md={12} lg={8}>
              <Card>
                <CardHeader title='Hasil Safety Stock dan Reorder Point' titleTypographyProps={{ variant: 'h6' }} />
                <CardContent>
                  <Grid container spacing={6}>
                    <Grid item xs={12} lg={6}>
                      <Alert sx={{ marginBottom: '20px' }} severity='info'>
                        Perhitungan Safety Stock
                      </Alert>
                      <Equation
                        value={`Safety Stock = (Pemakaian Maksimum - Pemakaian Rata Rata) * Lead Time`}
                        errorHandler={defaultErrorHandler}
                      />
                      <br />
                      <Equation
                        value={`Safety Stock = (${maxuse} - ${avgUse}) * 3`}
                        errorHandler={defaultErrorHandler}
                      />
                      <br />
                      <Equation value={`Safety Stock = ${safetyStock} Kg`} errorHandler={defaultErrorHandler} />

                      <Alert sx={{ marginBottom: '20px', marginTop: '25px' }} severity='info'>
                        Waktu Pemesanan
                      </Alert>
                      <Equation
                        value={`Waktu Pemesanan = (Jumlah Hari Kerja) / (Frekuensi Pemesanan)`}
                        errorHandler={defaultErrorHandler}
                      />
                      <br />
                      <Equation
                        value={`Waktu Pemesanan = 360 / ${orderRnd.toFixed(2)}`}
                        errorHandler={defaultErrorHandler}
                      />
                      <br />
                      <Equation
                        value={`Waktu Pemesanan = ${(360 / orderRnd).toFixed(2)} Hari`}
                        errorHandler={defaultErrorHandler}
                      />
                    </Grid>
                    <Grid item xs={12} lg={6}>
                      <Alert sx={{ marginBottom: '20px' }} severity='info'>
                        Pemakaian Rata Rata
                      </Alert>
                      <Equation value={`Q = (EOQ) / (Waktu Pemesanan)`} errorHandler={defaultErrorHandler} />
                      <br />
                      <Equation
                        value={`Q = ${eoq.toFixed(2)} / ${(360 / orderRnd).toFixed(2)}`}
                        errorHandler={defaultErrorHandler}
                      />
                      <br />
                      <Equation value={`Q = ${(eoq / orderRnd).toFixed(2)} Kg`} errorHandler={defaultErrorHandler} />

                      <Alert sx={{ marginBottom: '20px', marginTop: '25px' }} severity='info'>
                        Reorder Point
                      </Alert>
                      <Equation value={`ROP = L * Q`} errorHandler={defaultErrorHandler} />
                      <br />
                      <Equation value={`ROP = 3 * ${(eoq / orderRnd).toFixed(2)}`} errorHandler={defaultErrorHandler} />
                      <br />
                      <Equation
                        value={`ROP = ${(3 * (eoq / orderRnd)).toFixed(2)} Kg`}
                        errorHandler={defaultErrorHandler}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Card>
                <CardHeader title='Hasil EOQ' titleTypographyProps={{ variant: 'h6' }} />
                <CardContent>
                  <Grid container spacing={6}>
                    <Grid item xs={12} lg={6}>
                      <Alert sx={{ marginBottom: '20px' }} severity='info'>
                        Biaya setiap kali pesan
                      </Alert>
                      <Equation
                        value={`Biaya Setiap Kali Pesan = (Total Biaya Pemesanan) / (Frequensi Pemesanan)`}
                        errorHandler={defaultErrorHandler}
                      />
                      <br />
                      <Equation
                        value={`Biaya Setiap Kali Pesan = ${values.orderCost} / ${frequent}`}
                        errorHandler={defaultErrorHandler}
                      />
                      <br />
                      <Equation
                        value={`Biaya Setiap Kali Pesan = Rp ${costEveryOrder}`}
                        errorHandler={defaultErrorHandler}
                      />

                      <Alert sx={{ marginBottom: '20px', marginTop: '25px' }} severity='info'>
                        Biaya penyimpanan bahan baku
                      </Alert>
                      <Equation
                        value={`Biaya Penyimpanan = (Total Biaya Penyimpanan) / (Jumlah Bahan Baku)`}
                        errorHandler={defaultErrorHandler}
                      />
                      <br />
                      <Equation
                        value={`Biaya Penyimpanan = ${values.saveCost} / ${countStock}`}
                        errorHandler={defaultErrorHandler}
                      />
                      <br />
                      <Equation
                        value={`Biaya Penyimpanan = Rp ${saveCost.toFixed(2)}`}
                        errorHandler={defaultErrorHandler}
                      />

                      <Alert sx={{ marginBottom: '20px', marginTop: '25px' }} severity='info'>
                        Perhitungan EOQ
                      </Alert>
                      <Equation value={`EOQ = sqrt((2 * D * S) / H)`} errorHandler={defaultErrorHandler} />
                      <br />
                      <Equation
                        value={`EOQ = sqrt((2 * ${countStock} * ${costEveryOrder}) / ${saveCost.toFixed(2)})`}
                        errorHandler={defaultErrorHandler}
                      />
                      <br />
                      <Equation value={`EOQ = ${eoq.toFixed(2)} Kg`} />

                      <Alert sx={{ marginBottom: '20px', marginTop: '25px' }} severity='info'>
                        Persediaan Rata Rata
                      </Alert>
                      <Equation value={`Persediaan Rata Rata (Q') = Q / 2`} errorHandler={defaultErrorHandler} />
                      <br />
                      <Equation
                        value={`Persediaan Rata Rata (Q') = ${eoq.toFixed(2)} / 2`}
                        errorHandler={defaultErrorHandler}
                      />
                      <br />
                      <Equation value={`Persediaan Rata Rata (Q') = ${avgStock.toFixed(2)} Kg`} />
                    </Grid>
                    <Grid item xs={12} lg={6}>
                      <Alert sx={{ marginBottom: '20px', marginTop: '0px' }} severity='info'>
                        Jumlah Pesanan Yang Diperkirakan
                      </Alert>
                      <Equation value={`Jumlah Pesanan Yang Diperkirakan = D / Q`} errorHandler={defaultErrorHandler} />
                      <br />
                      <Equation value={`F = ${countStock} / ${eoq.toFixed(2)}`} errorHandler={defaultErrorHandler} />
                      <br />
                      <Equation value={`F =  ${orderRnd.toFixed(2)} Kali`} />

                      <Alert sx={{ marginBottom: '20px', marginTop: '25px' }} severity='info'>
                        Biaya Pemesanan dengan Metode EOQ
                      </Alert>
                      <Equation value={`Biaya Pemesanan = D / (Q') * S`} errorHandler={defaultErrorHandler} />
                      <br />
                      <Equation
                        value={`Biaya Pemesanan = ${countStock} / ${avgStock.toFixed(2)} * ${costEveryOrder}`}
                        errorHandler={defaultErrorHandler}
                      />
                      <br />
                      <Equation value={`Biaya Pemesanan =  Rp ${cOrder.toFixed(2)}`} />

                      <Alert sx={{ marginBottom: '20px', marginTop: '25px' }} severity='info'>
                        Biaya Penyimpanan dengan Metode EOQ
                      </Alert>
                      <Equation value={`Biaya Penyimpanan = (Q') / 2 * H`} errorHandler={defaultErrorHandler} />
                      <br />
                      <Equation
                        value={`Biaya Penyimpanan = ${avgStock.toFixed(2)} / 2  * ${saveCost.toFixed(2)}`}
                        errorHandler={defaultErrorHandler}
                      />
                      <br />
                      <Equation value={`Biaya Penyimpanan =  Rp ${sCost.toFixed(2)}`} />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </>
        ) : (
          <></>
        )}
      </Grid>
    </>
  )
}

export default Eoq
