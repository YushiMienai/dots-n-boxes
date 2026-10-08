const selectPlayerNumber = (max: number) => {
  return Array.from({length: max - MIN_PLAYERS + 1}, (_, i) => {
    const n = i + MIN_PLAYERS
    return (
      <option key={n} value={n}>
      {n} игрока
    </option>
  )
  })
}