<script setup lang="ts">
import { ref } from "vue";
import { useWebSocket } from "@vueuse/core";

const message = ref("");
const messages = ref<string[]>([]);

const { status, send, open, close } = useWebSocket("ws://localhost:3000/ws", {
  autoReconnect: true,
  onConnected: () => {
    console.log("WebSocket connected");
  },
  onDisconnected: () => {
    console.log("WebSocket disconnected");
  },
  onMessage: (_, event) => {
    console.log("Message received:", event.data);
    messages.value.push(event.data);
  },
});

const sendMessage = () => {
  if (message.value.trim()) {
    send(message.value);
    message.value = "";
  }
};
</script>

<template>
  <div class="px-10 py-15 max-w-2xl mx-auto">
    <h1 class="text-3xl font-bold underline mb-6">
      WebSocket Demo
    </h1>

    <!-- Connection Status -->
    <div class="mb-4">
      <span class="font-semibold">Status:</span>
      <span :class="{
        'text-green-600': status === 'OPEN',
        'text-yellow-600': status === 'CONNECTING',
        'text-red-600': status === 'CLOSED'
      }">
        {{ status }}
      </span>
    </div>

    <!-- Send Message -->
    <div class="mb-6 flex gap-2">
      <input v-model="message" @keyup.enter="sendMessage" type="text" placeholder="Type a message..."
        class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
      <button @click="sendMessage" :disabled="status !== 'OPEN'"
        class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed">
        Send
      </button>
    </div>

    <!-- Messages List -->
    <div class="bg-gray-100 p-4 rounded-lg min-h-75 max-h-125 overflow-y-auto">
      <h2 class="font-semibold mb-2">Messages:</h2>
      <div v-if="messages.length === 0" class="text-gray-500">
        No messages yet...
      </div>
      <div v-for="(msg, index) in messages" :key="index" class="bg-white p-2 rounded mb-2 shadow-sm">
        {{ msg }}
      </div>
    </div>

    <!-- Controls -->
    <div class="mt-4 flex gap-2">
      <button @click="open()" :disabled="status === 'OPEN'"
        class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed">
        Connect
      </button>
      <button @click="close()" :disabled="status !== 'OPEN'"
        class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed">
        Disconnect
      </button>
      <button @click="messages = []" class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
        Clear Messages
      </button>
    </div>
  </div>
</template>
