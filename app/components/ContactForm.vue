<template>
  <div>
    <h2 class="mb-4 text-2xl text-primary text-center">{{ $t('contact.title') }}</h2>

    <Form ref="formRef" :validation-schema="schema" :initial-values="{ name: '', email: '', message: '' }" @submit="onSubmit" v-slot="{ meta, isSubmitting }" class="relative flex flex-col gap-5">
      <Field name="name" v-slot="{ field, meta: m, errors }">
        <div class="group relative">
          <label for="name" class="pointer-events-none absolute left-3 top-2 z-10 text-xs opacity-70 transition group-focus-within:text-primary">{{ $t('contact.fields.name') }}</label>
          <input v-bind="field" id="name" type="text" @focus="focus.name = true" @blur="focus.name = false" :class="[
            baseInput,
            focus.name && m.valid && field.value ? 'ring-2 ring-primary' : '',
            m.touched && !m.valid ? 'ring-2 ring-error' : '',
          ]" />
          <Transition name="scale">
            <span v-if="focus.name && m.valid && field.value" class="pointer-events-none absolute right-2 top-2 z-10 text-primary">✓</span>
          </Transition>
          <Transition name="fade">
            <p v-if="m.touched && errors[0]" class="mt-1 text-sm text-error">{{ errors[0] }}</p>
          </Transition>
        </div>
      </Field>

      <Field name="email" v-slot="{ field, meta: m, errors }">
        <div class="group relative">
          <label for="email" class="pointer-events-none absolute left-3 top-2 z-10 text-xs opacity-70 transition group-focus-within:text-primary">{{ $t('contact.fields.email') }}</label>
          <input v-bind="field" id="email" type="email" @focus="focus.email = true" @blur="focus.email = false" :class="[
            baseInput,
            focus.email && m.valid && field.value ? 'ring-2 ring-primary' : '',
            m.touched && !m.valid ? 'ring-2 ring-error' : '',
          ]" />
          <Transition name="scale">
            <span v-if="focus.email && m.valid && field.value" class="pointer-events-none absolute right-2 top-2 z-10 text-primary">✓</span>
          </Transition>
          <Transition name="fade">
            <p v-if="m.touched && errors[0]" class="mt-1 text-sm text-error">{{ errors[0] }}</p>
          </Transition>
        </div>
      </Field>

      <Field name="message" v-slot="{ field, meta: m, errors }">
        <div class="group relative">
          <label for="message" class="pointer-events-none absolute left-3 top-2 z-10 text-xs opacity-70 transition group-focus-within:text-primary">{{ $t('contact.fields.message') }}</label>
          <textarea v-bind="field" id="message" rows="3" @focus="focus.message = true" @blur="focus.message = false" :class="[
            `${baseInput} resize-y`,
            focus.message && m.valid && field.value ? 'ring-2 ring-primary' : '',
            m.touched && !m.valid ? 'ring-2 ring-error' : '',
          ]" />
          <Transition name="scale">
            <span v-if="focus.message && m.valid && field.value" class="pointer-events-none absolute right-2 top-2 z-10 text-primary">✓</span>
          </Transition>
          <Transition name="fade">
            <p v-if="m.touched && errors[0]" class="mt-1 text-sm text-error">{{ errors[0] }}</p>
          </Transition>
        </div>
      </Field>

      <Button type="submit" :disabled="isSubmitting" class="px-5 py-2">
        <span v-if="!isSubmitting">{{ $t('contact.submit') }}</span>
        <span v-else>{{ $t('contact.sending') }}</span>
      </Button>
    </Form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Form, Field } from 'vee-validate'
import { z } from 'zod'
import { toTypedSchema } from '@vee-validate/zod'
import type { FormContext } from 'vee-validate'
const { t, locale } = useI18n()

const focus = ref({ name: false, email: false, message: false })

// Make schema reactive so messages update with locale
const schema = computed(() =>
  toTypedSchema(
    z.object({
      name: z.string().min(2, t('contact.validation.name_min')),
      email: z.email(t('contact.validation.email')),
      message: z.string().min(10, t('contact.validation.message_min')),
    }),
  ),
)

// Re-validate on locale change to refresh shown errors immediately
const formRef = ref<FormContext | null>(null)
watch(locale, () => {
  formRef.value?.validate()
})

async function onSubmit(values: { name: string; email: string; message: string }) {
  await new Promise((r) => setTimeout(r, 700))
  alert(t('contact.thanks', { name: values.name }))
}

const baseInput =
  'w-full rounded-xl px-3 pt-6 pb-3 bg-black/10 dark:bg-white/20 text-black dark:text-white placeholder:opacity-0 outline-none ring-0 focus-visible:ring-2 focus-visible:ring-white focus:backdrop-blur-lg transition-all duration-500'
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.18s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.scale-enter-active,
.scale-leave-active {
  transition:
    transform 0.18s,
    opacity 0.18s;
  transform-origin: 90% 0;
}

.scale-enter-from,
.scale-leave-to {
  transform: scale(0.9);
  opacity: 0;
}
</style>
