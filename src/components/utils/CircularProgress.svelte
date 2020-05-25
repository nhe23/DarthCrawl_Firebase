<script>
  import { fade } from 'svelte/transition';
  export let radius;
  export let stroke;
  export let progress;

  $: normalizedRadius = radius - stroke * 2;
  $: circumference = normalizedRadius * 2 * Math.PI;
  $: offset = circumference - (progress / 100) * circumference;
</script>

<style>
  .progressCircle {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 1;
  }
  .progress-ring__circle {
    transition: 0.35s stroke-dashoffset;
    transform: rotate(-90deg);
    transform-origin: 50% 50%;
    stroke-dashoffset: 226;
  }
</style>

<svg class="progressCircle" width={radius * 2} height={radius * 2} out:fade>
  <circle
    class="progress-ring__circle"
    stroke="white"
    stroke-width={stroke}
    stroke-dasharray={circumference + ' ' + circumference}
    fill="transparent"
    style="stroke-dashoffset:{offset}"
    r={normalizedRadius}
    cx={radius}
    cy={radius} />
</svg>
