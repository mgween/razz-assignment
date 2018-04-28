<template>
  <div id="app">
    <div class="top-bar">
      <img src="http://via.placeholder.com/250x75" alt="logo">
      <div style="display: flex">
        <button @click="loginFormVisible = !loginFormVisible" class="button login-button">Login / Register</button>
        <div v-if="activeUser !== 'default'" class="user">
          <font-awesome-icon :icon="icons.user" size="2x" />
          {{ activeUser }}
        </div>
      </div>
    </div>
    <div v-if="loginFormVisible" class="login-menu-container">
      <login-form @login-data="assignLoginData($event)" />
    </div>
    <div @click="$router.push('/prizes')" class="header">
      <h1>Rewards</h1>
    </div>
    <div v-if="activeUser" class="router-container">
      <router-view />
    </div>
    <div class="footer">
      <span>Terms & Conditions | </span><span>Privacy Policy</span>
    </div>
  </div>
</template>

<script>
import faUser from '@fortawesome/fontawesome-free-solid/faUser';
import LoginForm from '@/components/LoginForm';

export default {
  name: 'App',
  components: { 'login-form': LoginForm },
  data() {
    return {
      connectedToDb: false,
      loginFormVisible: false,
      activeUser: null,
      icons: {
        user: faUser
      }
    }
  },
  methods: {
    assignLoginData(data) {
      this.activeUser = data.user;
      this.loginFormVisible = false;
    }
  },
  created() {
    fetch(`${this.server}/login`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        user: 'default',
        password: 'default'
      })
    })
    .then(response => response.json())
    .then(data => {
      this.assignLoginData(data);
    });
  }
}
</script>

<style lang="css">
@font-face {
  font-family: Quicksand;
  src: url('/static/font/Quicksand-Regular.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
  /* src: url('/static/font/Quicksand-Bold.ttf'); */
}
@font-face {
  font-family: Quicksand;
  src: url('/static/font/Quicksand-Bold.ttf') format('truetype');
  font-weight: bold;
  font-style: normal;
}
body {
  font-family: 'Quicksand';
  background: #f5f5f5;
}
.button {
  background: #ffce0a;
  padding: 0.75rem 3rem;
  border-radius: 1.5rem;
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
.login-menu-container {
  position: absolute;
  right: 0.5rem;
  margin-top: -1rem;
}
.header {
  text-align: center;
  padding: 3rem;
  background: #0274bb;
  color: white;
  text-decoration: none;
  cursor: pointer;
}
.header > h1 {
  font-weight: bold;
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
  .login-button {
    padding: 1rem;
  }
}
@media screen and (max-width: 375px) {
  .user {
    word-break: break-all;
  }
  .login-button {
    padding: 1rem 0;
  }
}
@media screen and (min-width: 1440px) {
  #app {
    margin: 0 15vw;
  }
}
</style>
