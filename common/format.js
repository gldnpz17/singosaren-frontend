const Format = {
  currency: raw => Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(raw)
}

export default Format