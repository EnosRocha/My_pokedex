<template>
  <div
    class="absolute top-0 left-0 h-screen w-screen flex overflow-hidden justify-center items-center bg-orange-500"
  >
    <div
      class="flex flex-col justify-center gap-5 shadow-md items-center h-[400px] w-60 bg-white rounded-md"
    >
      <img :src="pikachudancing" alt="pikachu dancing" class="h-40" />
      <input
        v-model="userName"
        placeholder="username"
        class="w-50 border border-gray-300 rounded-md p-2"
      />
      <input
        type="password"
        v-model="password"
        placeholder="password"
        class="w-50 border border-gray-300 rounded-md p-2"
      />
      <div class="flex space-x-2 h-full">
        <button
          @click="handleSubmit"
          class="w-20 h-10 rounded-md border border-gray-300 bg-blue-700 text-white shadow-md hover:scale-110 transition-transform active:scale-90"
        >
          ENTER
        </button>
        <button
          @click="handleSignUp"
          class="w-20 h-10 rounded-md border border-gray-300 bg-green-700 text-white shadow-md hover:scale-110 transition-transform active:scale-90"
        >
          SIGN UP
        </button>
      </div>

      <p v-if="error" class="text-red-500 mt-2">{{ error }}</p>
      <p v-if="signup" class="text-green-600 mt-2 font-bold">{{ signup }}</p>
    </div>
  </div>
</template>

<script setup>
import pikachudancing from "../src/assets/pikachudancing.gif";
import { useRouter } from "vue-router";
import { jwtDecode } from "jwt-decode";
import { ref } from "vue";

const props = defineProps({
  setToken: Function,
});

const router = useRouter();

const userName = ref("");
const password = ref("");
const error = ref("");
const signup = ref("");

async function handleSubmit() {
  error.value = "";
  console.log("Attempting login with username:", userName.value);
  console.log("Attempting login with password:", password.value);

  try {
    const response = await fetch("http://localhost:8080/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: userName.value,
        password: password.value,
      }),
    });

    console.log(response);
    if (!response.ok) {
      console.warn("An Error has been found during the process");
      error.value = "Username or password invalid";
      return;
    }
    const data = await response.json();

    localStorage.setItem("token", data.acessToken);
    if (typeof props.setToken === "function") {
      props.setToken(data.acessToken);
    }

    const decoded = jwtDecode(data.acessToken);
    console.log("Decoded Token:", decoded);

    if (decoded.scope?.toUpperCase() === "ADMIN") {
      router.push("/adminpokedex");
    } else {
      router.push("/userpokedex");
    }
  } catch (err) {
    console.warn("An Error has been found during the process", error);
    error.value = "Login failed";
    return;
  } finally {
    userName.value = "";
    password.value = "";
  }
}
async function handleSignUp() {
  error.value = "";
  signup.value = "";
  try {
    const response = await fetch("http://localhost:8080/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userName: userName.value,
        password: password.value,
      }),
    });
    if (!response.ok) {
      console.warn("An Error has been found during the process");
      error.value = "Registration failed";
      return;
    }
    signup.value = "Registration successful!";
  } catch (err) {
    console.warn("An Error has been found during the process", error);
    error.value = "UserName or password invalid for registration";
    return;
  } finally {
    userName.value = "";
    password.value = "";
  }
}
</script>
