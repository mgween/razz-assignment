<template lang="html">
  <div class="component">
    <h2>Here is the full list of prizes that you can win.</h2>
    <transition name="fade" mode="out-in">
      <div v-if="loading" key="loading" class="loading">
        <span>Loading...</span>
      </div>
      <div v-else key="prizes" class="prize-list">
        <div v-for="prize in prizeList" class="prize">
          <img :src="prize.image_url" :alt="prize.name">
          <div class="prize-info">
            <div class="prize-text">Win a {{ prize.name }}</div>
            <div>
              <router-link :to="`/details/${prize._id}`" class="button">Redeem ></router-link>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'Prizes',
  data() {
    return {
      prizeList: null,
      loading: true
    }
  },
  created() {
    fetch(`${this.server}/prize-list`)
    .then(response => response.json())
    .then(data => {
      this.loading = false;
      this.prizeList = data;
    });
  }
}
</script>

<style lang="css" scoped>
h2 {
  margin: 4rem 0;
  font-weight: normal;
}
.component {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.prize-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 1rem;
}
.prize {
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
  background: white;
  text-align: center;
}
.prize > img {
  max-width: 400px;
}
.prize-info > * {
  margin: 3rem 0;
}
.prize-text {
  font-size: 1.2em;
  font-weight: bold;
}
@media screen and (max-width: 768px) {
  .prize-list {
    grid-template-columns: 1fr;
  }
}
</style>
