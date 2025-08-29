<template>
  <div class="flex flex-col gap-4">
    <h2 class="text-2xl text-primary text-shadow-lg text-center">Kontaktformular</h2>

    <label for="name" class="font-semibold">Name</label>
    <input
      id="name"
      type="text"
      class="bg-black/10 dark:bg-white/10 p-2 rounded focus-within:outline-2 focus-within:outline-offset-0 focus-within:outline-primary"
    />

    <label for="email" class="font-semibold">Email</label>
    <input
      id="email"
      type="email"
      class="bg-black/10 dark:bg-white/10 p-2 rounded focus-within:outline-2 focus-within:outline-offset-0 focus-within:outline-primary"
    />

    <label for="message" class="font-semibold">Nachricht</label>
    <textarea
      id="message"
      class="bg-black/10 dark:bg-white/10 p-2 rounded focus-within:outline-2 focus-within:outline-offset-0 focus-within:outline-primary"
    ></textarea>
    <div class="flex justify-center">
      <Button>Absenden</Button>
    </div>
  </div>
</template>
