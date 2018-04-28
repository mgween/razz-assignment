<template lang="html">
  <div v-if="prize" class="component">
    <div class="grid">
      <img :src="prize.image_url" :alt="prize.name">
      <div class="prize-form">
        <h2>{{ prize.name }}</h2>
        <button @click="modalDisplayed = true" :disabled="prize.quantity < 1" :class="{'disabled-button': prize.quantity < 1}" class="button">Redeem ></button>
        <span>{{ prize.quantity }} left in stock</span>
      </div>
      <div class="description">
        <h3>Description</h3>
        {{ prize.description }}
      </div>
    </div>

    <modal v-if="modalDisplayed" :prize="prize" @close-modal="modalDisplayed = false" />

  </div>
</template>

<script>
import Modal from '@/components/Modal';

export default {
  name: 'Details',
  components: { 'modal': Modal },
  data() {
    return {
      prize: null,
      modalDisplayed: false
    }
  },
  created() {
    const prizeId = encodeURI(this.$route.params.prize);
    fetch(`${this.server}/prize?prizeId=${prizeId}`)
    .then(response => response.json())
    .then(data => {
      this.prize = data;
      this.$emit('show-footer');
    });
  },
  destroyed() {
    this.$emit('hide-footer');
  }
}
</script>

<style lang="css" scoped>
.component {
  margin: 0 10rem;
}
.grid {
  display: grid;
  grid-template-columns: 50% 50%;
  grid-column-gap: 2rem;
  padding-top: 1rem;
}
.grid > img {
  max-width: 100%;
}
.prize-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  padding: 1rem;
  background: white;
}
.prize-form > h2 {
  font-size: 2em;
}
.prize-form > span {
  font-size: 0.75em;
}
.description {
  grid-column-end: span 2;
  display: flex;
  padding: 3rem 0;
}
.description > h3 {
  margin: 0 3rem 0 0;
}
@media screen and (max-width: 768px) {
  .component {
    margin: 1rem;
  }
  .grid {
    display: flex;
    flex-direction: column;
  }
  .description {
    flex-direction: column;
  }
}
</style>
