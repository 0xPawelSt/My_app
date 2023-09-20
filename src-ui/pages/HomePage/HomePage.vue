<template>
  <div class="text-h4 text-center">Welcome</div>
  <div class="text-h5 text-center mt-3">
    Select desired module from the menu on the left
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import ExampleService from "@/services/ExampleService";

onMounted(() => {
  const exampleService = new ExampleService();
  exampleService
    .getData()
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      console.log(error);
    });
});
</script>
