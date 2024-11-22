<script setup lang="ts">
interface ConfirmDialogProps {
  title?: string
  text?: string
  confirmLabel?: string
  cancelLabel?: string
  icon?: string
}

const show = defineModel<boolean>()

const emit = defineEmits(['confirm', 'cancel'])

const {
  title = 'Are you sure?',
  confirmLabel = 'Yes',
  cancelLabel = 'No',
} = defineProps<ConfirmDialogProps>()
</script>

<template>
  <v-dialog v-model="show" persistent width="auto">
    <v-card :prepend-icon="icon" :title="title" :text="text">
      <template v-slot:actions>
        <v-spacer></v-spacer>

        <v-container class="d-flex justify-space-between">
          <v-btn color="primary" variant="flat" @click="emit('confirm')">{{ confirmLabel }}</v-btn>
          <v-btn color="seconday" variant="outlined" @click="emit('cancel')">{{
            cancelLabel
          }}</v-btn>
        </v-container>
      </template>
    </v-card>
  </v-dialog>
</template>
