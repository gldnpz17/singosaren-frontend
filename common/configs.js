const configs = {
  isrDurationSeconds: process.env.ISR_DURATION_SECONDS ? Number.parseInt(process.env.ISR_DURATION_SECONDS) : 10
}

export default configs