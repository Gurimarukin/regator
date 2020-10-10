<script lang="ts">
  import { timeStore } from './stores/timeStore'

  const pad10 = (n: number): string => (n < 10 ? `0${n}` : n.toString())

  const formatDate = (date: Date): string => {
    const hours = pad10(date.getHours())
    const minutes = pad10(date.getMinutes())
    const seconds = pad10(date.getSeconds())
    return `${hours}:${minutes}:${seconds}`
  }

  $: formatted = formatDate($timeStore)
</script>

<div>{formatted}</div>
