<script setup lang="ts">
import type { FormContext } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { Field, Form } from 'vee-validate'
import { computed, ref, watch } from 'vue'
import { z } from 'zod'
import { useDialogStore } from '@/stores/dialog'
import { useSecurityStore } from '@/stores/security'

const { t, locale } = useI18n()

const focus = ref({ name: false, email: false, message: false })

// Make schema reactive so messages update with locale
const schema = computed(() =>
  toTypedSchema(
    z.object({
      name: z.string().min(2, t('contact.validation.name_min')),
      email: z.string().email(t('contact.validation.email')),
      message: z.string().min(10, t('contact.validation.message_min')),
    }),
  ),
)

// Re-validate on locale change to refresh shown errors immediately
const formRef = ref<FormContext | null>(null)
watch(locale, () => {
  formRef.value?.validate()
})

const security = useSecurityStore()
const dialog = useDialogStore()
const company = ref('') // honeypot decoy

async function onSubmit(values: { name: string, email: string, message: string, company?: string }) {
  try {
    const { $csrfFetch } = useNuxtApp()
    const res = await $csrfFetch('/api/contact', {
      method: 'POST',
      body: {
        name: values.name,
        email: values.email,
        message: values.message,
        company: company.value ?? '',
        captchaToken: security.captchaToken,
        honeypotToken: security.honeypotToken,
      },
    })
    console.debug('[contact] submit result', res)
    console.warn(t('contact.thanks', { name: values.name }))
    // Clear tokens after successful submit
    security.clear()
    // Close dialog and show confetti for ~5s
    dialog.close()
    dialog.showConfetti(5000)
  }
  catch (e: any) {
    console.error('[contact] Failed to send message', e?.data || e?.message || e)
    throw e
  }
}

const baseInput
  = 'w-full rounded-xl px-3 pt-6 pb-3 bg-black/10 dark:bg-white/1 text-black dark:text-white placeholder:opacity-0 outline-none ring-1 ring-black/10 dark:ring-white/10 focus-visible:ring-1 focus-visible:ring-black/30 dark:focus-visible:ring-white/30 backdrop-blur-lg transition-all duration-500'
</script>

<template>
  <div class="mx-auto max-w-2xs">
    <h2 class="text-primary mb-4 text-center text-2xl">
      {{ $t('contact.title') }}
    </h2>

    <Form
      ref="formRef"
      v-slot="{ isSubmitting }"
      :validation-schema="schema"
      :initial-values="{ name: '', email: '', message: '' }"
      class="relative flex flex-col gap-5"
      @submit="onSubmit"
    >
      <Field v-slot="{ field, meta: m, errors }" name="name">
        <div class="group relative">
          <label for="name" class="group-focus-within:text-primary pointer-events-none absolute top-2 left-3 z-10 text-xs opacity-70 transition">{{ $t('contact.fields.name') }}</label>
          <input
            v-bind="field"
            id="name"
            type="text"
            :class="[
              baseInput,
              focus.name && m.valid && field.value ? 'ring-primary' : '',
              m.touched && !m.valid ? '' : '',
            ]"
            @focus="focus.name = true"
            @blur="focus.name = false"
          >
          <Transition name="scale">
            <span v-if="focus.name && m.valid && field.value" class="text-primary pointer-events-none absolute top-2 right-2 z-10">✓</span>
          </Transition>
          <Transition name="fade">
            <p v-if="m.touched && errors[0]" class="text-error mt-1 text-sm">
              {{ errors[0] }}
            </p>
          </Transition>
        </div>
      </Field>

      <!-- Honeypot decoy (must stay empty) -->
      <input
        v-model="company"
        name="company"
        type="text"
        autocomplete="off"
        tabindex="-1"
        aria-hidden="true"
        style="display:none"
      >

      <Field v-slot="{ field, meta: m, errors }" name="email">
        <div class="group relative">
          <label for="email" class="group-focus-within:text-primary pointer-events-none absolute top-2 left-3 z-10 text-xs opacity-70 transition">{{ $t('contact.fields.email') }}</label>
          <input
            v-bind="field"
            id="email"
            type="email"
            :class="[
              baseInput,
              focus.email && m.valid && field.value ? 'ring-primary' : '',
              m.touched && !m.valid ? '' : '',
            ]"
            @focus="focus.email = true"
            @blur="focus.email = false"
          >
          <Transition name="scale">
            <span v-if="focus.email && m.valid && field.value" class="text-primary pointer-events-none absolute top-2 right-2 z-10">✓</span>
          </Transition>
          <Transition name="fade">
            <p v-if="m.touched && errors[0]" class="text-error mt-1 text-sm">
              {{ errors[0] }}
            </p>
          </Transition>
        </div>
      </Field>

      <Field v-slot="{ field, meta: m, errors }" name="message">
        <div class="group relative">
          <label for="message" class="group-focus-within:text-primary pointer-events-none absolute top-2 left-3 z-10 text-xs opacity-70 transition">{{ $t('contact.fields.message') }}</label>
          <textarea
            v-bind="field"
            id="message"
            rows="3"
            :class="[
              `${baseInput} resize-y`,
              focus.message && m.valid && field.value ? 'ring-primary' : '',
              m.touched && !m.valid ? '' : '',
            ]"
            @focus="focus.message = true"
            @blur="focus.message = false"
          />
          <Transition name="scale">
            <span v-if="focus.message && m.valid && field.value" class="text-primary pointer-events-none absolute top-2 right-2 z-10">✓</span>
          </Transition>
          <Transition name="fade">
            <p v-if="m.touched && errors[0]" class="text-error mt-1 text-sm">
              {{ errors[0] }}
            </p>
          </Transition>
        </div>
      </Field>

      <Button
        type="submit"
        :disabled="isSubmitting"
        class="px-5 py-2"
      >
        <span v-if="!isSubmitting">{{ $t('contact.submit') }}</span>
        <span v-else>{{ $t('contact.sending') }}</span>
      </Button>
    </Form>
  </div>
</template>

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
