<script setup lang="ts">
import { Socket } from "@Services/Socket";
import { onMounted, onUnmounted } from "vue";

onMounted(() => {
  Socket.connect();
});

onUnmounted(() => {
  Socket.disconnect();
});
</script>

<template>
  <div class="min-h-screen bg-black">

  </div>
</template>
