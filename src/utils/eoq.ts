export const getCostEveryOrder = (total: number, count: number) => {
  return Math.round(total / count)
}

export const getFrequent = (data: any[]) => {
    let result = 0
    data.forEach(e => {
      result += e.freqOrder
    })
  
    return result
  }

export const getCountStock = (data: any[]) => {
  let result = 0
  data.forEach(e => {
    result += e.buy
  })

  return result
}

export const getSaveCost = (total: number, countStock: number) => {
  return total / countStock
}

export const getEOQ = (de: number, es: number, ha: number) => {
  return Math.sqrt((2 * de * es) / ha)
}

export const averageStock = (qi: number) => {
  return qi / 2
}

export const orderRound = (de: number, qi: number) => {
  return de / qi
}

export const costOrderEOQ = (de: number, qib: number, es: number) => {
  return (de / qib) * es
}

export const saveCostEOQ = (qib: number, ha: number) => {
  return (qib / 2) * ha
}

export const getAvgUse = (data: any[]) => {
  let result = 0;
  data.forEach((e) => {
    result += e.use
  })

  return result / data.length
}

export const getSafetyStock = (maxUse : number, avgUse : number) => {
  return (maxUse - avgUse) * 3
}