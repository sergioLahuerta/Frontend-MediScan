<template>
  <v-app>
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
    
    <v-snackbar
      v-model="appStore.snackbar.show"
      :color="appStore.snackbar.color"
      :timeout="3500"
      location="top"
      rounded="lg"
    >
      {{ appStore.snackbar.message }}
      <template #actions>
        <v-btn variant="text" icon @click="appStore.hideSnackbar">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script setup lang="ts">
import { useAppStore } from '@/stores/appStore'
const appStore = useAppStore()
</script>
