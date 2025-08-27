<template>
  <main class="justify-center align-middle">
    <Blob />
    <section class="flex flex-col items-center selection:bg-green selection:text-black">
      <div class="max-w-prose relative">
        <OpenForWork class="w-24 h-24 fixed z-30 top-8 right-8 drop-shadow-xl/25" />

        <Section>
          <div>
            <h1 class="text-4xl mb-4 sr-only">Mirko May</h1>
            <h2 class="text-4xl leading-tight mb-4">
              <span class="block md:inline"><span class="text-green">Hello</span>, </span>
              <span class="block md:inline"><span class="text-green">Kia Ora</span></span>
              <span class="block md:inline">
                and
                <span class="text-green">Moin Moin</span>
              </span>
            </h2>
            <p class="text-2xl">
              I’m <span class="text-green">Mirko</span>, a Front-end/UI Engineer from Wellington, New Zealand. I focus
              on creating clear, accessible and reliable digital experiences. My expertise lies in building design
              systems that scale with products and teams, ensuring consistency, usability and long-term resilience.
            </p>
          </div>
          <ScrollIndicator class="text-center fixed bottom-24 right-0 left-0 hidden sm:block" />
        </Section>

        <Section>
          <p class="text-2xl">
            My work centres on user experience, accessibility and SEO-friendly front-end practices, ensuring that
            interfaces are not only intuitive but also discoverable and inclusive. My expertise includes developing
            design patterns, maintaining clear documentation and enabling collaboration between design and engineering
            teams.
          </p>
        </Section>

        <Section class="mb-[15vh]">
          <p class="text-2xl">
            I believe design is about clarity and intent as much as aesthetics. My goal is to reduce friction, support
            creativity and ensure technology remains accessible, user-centred and effective at scale.
          </p>
        </Section>
      </div>
    </section>
  </main>
</template>
