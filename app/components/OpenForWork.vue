<template>
  <div class="grid grid-cols-1 grid-rows-1">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 500 500"
      class="text-primary col-start-1 row-start-1 fill-current"
    >
      <path
        d="M 500 250 A 250 250 0 0 1 250 500 A 250 250 0 0 1 0 250 A 250 250 0 0 1 250 0 A 250 250 0 0 1 500 250 Z"
      />
      <path
        d="M 480 250 C 480 377.0254924610825 377.0254924610825 480 250 480 C 122.97450753891752 480 20.000000000000014 377.0254924610825 20 250 C 19.999999999999986 122.97450753891752 122.97450753891754 20.000000000000025 250 20 C 377.0254924610825 20.000000000000007 480 122.97450753891754 480 250"
        style="fill: none; stroke: rgb(0, 0, 0); stroke-width: 10px; stroke-dasharray: 16"
      />
    </svg>
    <span
      class="col-start-1 row-start-1 flex items-center justify-center p-4 text-center text-lg leading-none font-bold text-black"
    >{{ $t('openForWork') }}</span>
  </div>
</template>
