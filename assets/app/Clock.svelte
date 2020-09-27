<script lang="ts">
  const pad10 = (n: number): string => (n < 10 ? `0${n}` : n.toString())

  const formatDate = (date: Date): string => {
    const hours = pad10(date.getHours())
    const minutes = pad10(date.getMinutes())
    const seconds = pad10(date.getSeconds())
    return `${hours}:${minutes}:${seconds}`
  }

  let date = new Date()

  const untilNextSecond = (Date.now() % 1000) + 1
  setTimeout(() => {
    date = new Date()
    setInterval(() => {
      date = new Date()
    }, 1000)
  }, untilNextSecond)

  $: formatted = formatDate(date)
</script>

<div>{formatted}</div>
