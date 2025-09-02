<template>
  <main class="justify-center align-middle">
    <Blob />
    <section class="flex flex-col items-center">
      <div class="relative max-w-prose">
        <h1 class="sr-only">
          Mirko May
        </h1>
        <Section>
          <ScrollIndicator class="fixed right-0 bottom-28 left-0 hidden text-center sm:block" />
          <h2 class="mr-auto mb-4 text-4xl leading-tight">
            <span class="block md:inline">
              <span class="text-primary text-shadow-lg" v-html="`${$t('greet1')}`" />,
            </span>
            <span class="block md:inline">
              <span class="text-primary text-shadow-lg" v-html="`${$t('greet2')}`" />
            </span>
            <span class="block md:inline">
              {{ $t('greet3') }}
              <span class="text-primary text-shadow-lg" v-html="`${$t('greet4')}`" />
            </span>
          </h2>
          <WordHover class="text-2xl">
            {{ $t('section1') }}<Highlight>{{ $t('section1_highlight') }}</Highlight>{{ $t('section1_1') }}
          </WordHover>
        </Section>

        <Section>
          <WordHover class="text-2xl">
            {{ $t('section2') }}<Highlight>{{ $t('section2_highlight') }}</Highlight>{{ $t('section2_1') }}
          </WordHover>
        </Section>

        <Section class="mb-[15vh] md:mb-[20vh]">
          <WordHover class="text-2xl">
            {{ $t('section3') }}<Highlight>{{ $t('section3_highlight') }}</Highlight>{{ $t('section3_1') }}<Highlight>{{ $t('section3_highlight_2') }}</Highlight>{{ $t('section3_2') }}
          </WordHover>
        </Section>
      </div>
    </section>
  </main>
</template>
