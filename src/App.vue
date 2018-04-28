<template>
  <div v-if="activeUser" id="app">
    <div class="top-bar">
      <img src="http://via.placeholder.com/250x75" alt="logo">
      <div style="display: flex">
        <button class="button" @click="loginForm.visible = !loginForm.visible">Login / Register</button>
        <div v-if="activeUser !== 'default'" class="user">
          <font-awesome-icon :icon="icons.user" size="2x" />
          {{ activeUser }}
        </div>
      </div>
    </div>
    <div v-if="loginForm.visible" class="login-menu">
      <input v-model="loginForm.username" @keyup.enter="doLogin" autofocus placeholder="Username">
      <input v-model="loginForm.password" @keyup.enter="doLogin" placeholder="Password" type="password">
      <div v-if="loginForm.responseText"style="color: red">{{ loginForm.responseText }}</div>
      <button @click="doLogin" :disabled="formIncomplete" :class="{'disabled-button': formIncomplete}" class="button">Login ></button>
      <button @click="addUser" :disabled="formIncomplete" :class="{'disabled-button': formIncomplete}" class="button">Register ></button>
    </div>
    <div @click="$router.push('/prizes')" class="header">
      <h1>Rewards</h1>
    </div>
    <div class="router-container">
      <router-view />
    </div>
    <div class="footer">
      Terms & Conditions | Privacy Policy
    </div>
  </div>
</template>

<script>
import faUser from '@fortawesome/fontawesome-free-solid/faUser';

export default {
  name: 'App',
  data() {
    return {
      connectedToDb: false,
      loginForm: {
        visible: false,
        username: 'default',
        password: 'default',
        responseText: null
      },
      activeUser: null,
      icons: {
        user: faUser
      }
    }
  },
  computed: {
    formIncomplete() {
      return !this.loginForm.username || !this.loginForm.password;
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
          user: this.loginForm.username,
          password: this.loginForm.password
        })
      })
      .then(response => response.json())
      .then(data => {
        if (data.ok) {
          this.activeUser = data.user;
          this.loginForm.visible = false;
          this.loginForm.username = '';
          this.loginForm.password = '';
        } else if (data.user === 'AuthenticationFailed') {
          this.loginForm.responseText = 'Invalid username / password';
        } else {
          this.loginForm.responseText = 'Something went wrong.'
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
          user: this.loginForm.username,
          password: this.loginForm.password
        })
      })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        if (data.user) {
          this.loginForm.responseText = `User ${data.user} has been created.`;
        } else if (data.codeName === 'DuplicateKey') {
          this.loginForm.responseText = 'Username already in use.';
        } else {
          this.loginForm.responseText = 'Something went wrong.';
        };
      });
    }
  },
  created() {
    this.doLogin();
  }
}
</script>

<style lang="css">
@font-face {
  font-family: Quicksand;
  src: url('/static/font/Quicksand-Regular.ttf');
}
body {
  font-family: 'Quicksand';
  background: #f5f5f5;
}
.button {
  background: #ffce0a;
  padding: 0.75rem 3rem;
  border-radius: 2rem;
  text-decoration: none;
  color: black;
  border: none;
  cursor: pointer;
}
.disabled-button {
  background: #e5e5e5;
  cursor: not-allowed;
}
.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.user {
  display: flex;
  align-items: center;
  margin: 0 1rem;
}
.user > svg {
  margin: 0 1rem;
}
.login-menu {
  position: absolute;
  right: 0.5rem;
  background: white;
  display: flex;
  flex-direction: column;
  margin-top: -1rem;
}
.login-menu > * {
  margin: 0.5rem;
}
.header {
  text-align: center;
  padding: 3rem;
  background: #0274bb;
  color: white;
  text-decoration: none;
  cursor: pointer;
}
.router-container {
  padding: 1rem 0;
}
.footer {
  text-align: center;
  padding: 3rem;
  background: #282828;
  color: white;
}
@media screen and (max-width: 425px) {
  .user {
    flex-direction: column;
    text-align: center;
    word-break: normal;
  }
  .user > svg {
    margin: 0;
  }
}
@media screen and (max-width: 375px) {
  .user {
    word-break: break-all;
  }
}
</style>
