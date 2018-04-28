<template lang="html">
  <div class="login-menu">
    <input v-model="username" @keyup.enter="doLogin" autofocus placeholder="Username">
    <input v-model="password" @keyup.enter="doLogin" placeholder="Password" type="password">
    <div v-if="responseText" style="text-align:center">{{ responseText }}</div>
    <button @click="doLogin" :disabled="formIncomplete" :class="{'disabled-button': formIncomplete}" class="button">Login ></button>
    <button @click="addUser" :disabled="formIncomplete" :class="{'disabled-button': formIncomplete}" class="button">Register ></button>
  </div>
</template>

<script>
export default {
  name: 'LoginForm',
  data() {
    return {
      username: '',
      password: '',
      responseText: null
    }
  },
  computed: {
    formIncomplete() {
      return !this.username || !this.password;
    }
  },
  methods: {
    doLogin() {
      fetch(`${this.server}/login`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          user: this.username,
          password: this.password
        })
      })
      .then(response => response.json())
      .then(data => {
        if (data.ok) {
          this.$emit('login-data', data);
          this.username = '';
          this.password = '';
        } else if (data.user === 'AuthenticationFailed') {
          this.responseText = 'Invalid username / password';
        } else {
          this.responseText = 'Something went wrong.'
        }
      });
    },
    addUser() {
      fetch(`${this.server}/new-user`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          user: this.username,
          password: this.password
        })
      })
      .then(response => response.json())
      .then(data => {
        if (data.user) {
          this.responseText = `User ${data.user} has been created.`;
        } else if (data.codeName === 'DuplicateKey') {
          this.responseText = 'Username already in use.';
        } else {
          this.responseText = 'Something went wrong.';
        };
      });
    }
  }
}
</script>

<style lang="css" scoped>
.login-menu {
  display: flex;
  flex-direction: column;
  width: 15rem;
  background: white;
}
.login-menu > * {
  padding: 0.75rem;
  margin: 0.5rem;
}
</style>
