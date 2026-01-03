<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
import { SocketService } from "@Services/SocketService";

const socket = new SocketService();

onMounted(() => {
  socket.connect();
});

onUnmounted(() => {
  socket.disconnect();
});

const sendTestMessage = () => {
  socket.send("Hello from client!");
};
</script>

<template>
  <div class="min-h-screen bg-black">
    <button @click="sendTestMessage" class="bg-blue-500 text-white px-4 py-2 rounded">
      Send Test Message</button>
  </div>
</template>
