<script setup>
import { ref } from 'vue';
import CommentSection from './components/CommentSection.vue';

const userId = ref('');
const users = ref(null);
const newEmail = ref('');

const getUser = async () => {
  try {
    const response = await fetch(`http://40.82.207.72:3000/api/user/${userId.value}`);
    if (!response.ok) {
      throw new Error('Failed to fetch user data'); 
    }
    users.value = await response.json();
    console.log(users.value);
  } catch (error) {
    console.error(error);
    alert('Error fetching user data: ' + error.message); 
  }
};

const changeEmail = async () => {
  try {
    const response = await fetch(`http://40.82.207.72:3000/api/user/${userId.value}/change-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `email=${newEmail.value}`,
    });
    if (!response.ok) {
      throw new Error('Failed to change email'); 
    }
    alert('Email updated successfully');
  } catch (error) {
    console.error(error);
    alert('Error changing email: ' + error.message); // Memberikan feedback kepada pengguna
  }
};

</script>

<template>
  <div id="app">
    <h1>User Dashboard</h1>
    <div>
      <input v-model="userId" placeholder="Enter User ID" />
      <button @click="getUser">Get User Info</button>
    </div>
    <div v-if="users">
      <h2>{{ users.name }}</h2>
      <p>Email: {{ users.email }}</p>
      <hr />
    </div>
    <CommentSection />
    <form @submit.prevent="changeEmail">
      <h3>Change Email</h3>
      <input v-model="newEmail" placeholder="New Email" />
      <button type="submit">Submit</button>
    </form>
  </div>
</template>
