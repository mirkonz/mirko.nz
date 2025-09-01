<template>
  <div>
    <h2 class="mb-4 text-2xl text-primary text-center">Kontaktformular</h2>

    <!-- <Transition
      mode="out-in"
      @before-enter="hBeforeEnter"
      @enter="hEnter"
      @after-enter="hAfterEnter"
      @before-leave="hBeforeLeave"
      @leave="hLeave"
      @after-leave="hAfterLeave"
    >
      <div v-if="!showSubmit" key="gate" class="overflow-hidden">
        <div class="flex flex-col items-center gap-2">
          <h3 class="text-xs opacity-70">Connect the dots to show the contact form</h3>
          <div class="w-32 h-32">
            <Captcha ref="captchaRef" @completed="onCompleted" />
          </div>
        </div>
      </div> -->

    <!-- <div key="form" class="overflow-visible"> -->
    <Form :validation-schema="schema" :initial-values="{ name: '', email: '', message: '' }" @submit="onSubmit" v-slot="{ meta, isSubmitting }" class="relative flex flex-col gap-5">
      <Field name="name" v-slot="{ field, meta: m, errors }">
        <div class="group relative">
          <label for="name" class="pointer-events-none absolute left-3 top-2 z-10 text-xs opacity-70 transition group-focus-within:text-primary">Name</label>
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
          <label for="email" class="pointer-events-none absolute left-3 top-2 z-10 text-xs opacity-70 transition group-focus-within:text-primary">Email</label>
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
          <label for="message" class="pointer-events-none absolute left-3 top-2 z-10 text-xs opacity-70 transition group-focus-within:text-primary">Nachricht</label>
          <textarea v-bind="field" id="message" rows="5" @focus="focus.message = true" @blur="focus.message = false" :class="[
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

      <Button type="submit" :disabled="!meta.valid || isSubmitting" class="px-5 py-2">
        <span v-if="!isSubmitting">Absenden</span>
        <span v-else>Wird gesendet…</span>
      </Button>
    </Form>
    <!-- </div>
    </Transition> -->
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Form, Field } from 'vee-validate'
import { z } from 'zod'
import { toFormValidator } from '@vee-validate/zod'

const captchaRef = ref<InstanceType<typeof Captcha> | null>(null)
const focus = ref({ name: false, email: false, message: false })
// const showSubmit = ref(false)

const schema = toFormValidator(
  z.object({
    name: z.string().min(2, 'Bitte gib mindestens 2 Zeichen ein'),
    email: z.string().email('Bitte gib eine gültige E-Mail ein'),
    message: z.string().min(10, 'Bitte mindestens 10 Zeichen'),
  }),
)

// function onCompleted() {
//   showSubmit.value = true
// }

async function onSubmit(values: { name: string; email: string; message: string }) {
  await new Promise((r) => setTimeout(r, 700))
  alert(`Danke, ${values.name}!`)
}

const baseInput =
  'w-full rounded-xl px-3 pt-6 pb-3 bg-black/10 dark:bg-white/20 text-white placeholder:opacity-0 outline-none ring-0 focus-visible:ring-2 focus-visible:ring-white focus:backdrop-blur-lg transition-all duration-500'

function hBeforeEnter(el: Element) {
  const e = el as HTMLElement
  e.style.height = '0px'
}
function hEnter(el: Element) {
  const e = el as HTMLElement
  const h = e.scrollHeight
  e.style.transition = 'height 200ms ease'
  requestAnimationFrame(() => {
    e.style.height = `${h}px`
  })
}
function hAfterEnter(el: Element) {
  const e = el as HTMLElement
  e.style.height = ''
  e.style.transition = ''
}
function hBeforeLeave(el: Element) {
  const e = el as HTMLElement
  e.style.height = `${e.scrollHeight}px`
}
function hLeave(el: Element) {
  const e = el as HTMLElement
  e.style.transition = 'height 200ms ease'
  requestAnimationFrame(() => {
    e.style.height = '0px'
  })
}
function hAfterLeave(el: Element) {
  const e = el as HTMLElement
  e.style.height = ''
  e.style.transition = ''
}
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
