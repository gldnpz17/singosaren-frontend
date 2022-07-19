const configs = {
  isrDurationSeconds: process.env.ISR_DURATION_SECONDS ? Number.parseInt(process.env.ISR_DURATION_SECONDS) : 60 * 60 * 12
}

export default configs