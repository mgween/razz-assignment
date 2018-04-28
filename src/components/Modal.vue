<template lang="html">
  <div class="modal-bg">
    <div v-if="stage === 0" class="modal">
      <font-awesome-icon :icon="icons.close" size="2x" @click="$emit('close-modal')" />
      <h2>Are you sure?</h2>
      <img :src="$props.prize.image_url" :alt="$props.prize.name">
      <p>Redeem for {{ $props.prize.name }}?</p>
      <div v-if="responseMsg" style="color: red;">{{ responseMsg }}</div>
      <div>
        <button @click="redeemPrize" :disabled="$props.prize.quantity < 1" :class="{'disabled-button': $props.prize.quantity < 1}" class="button">Yes</button>
        <button @click="$emit('close-modal')" class="button cancel-button">Cancel</button>
      </div>
    </div>
    <div v-else class="modal">
      <font-awesome-icon :icon="icons.close" size="2x" @click="$emit('close-modal')" />
      <h2>Congratulations!</h2>
      <p>You redeemed {{ $props.prize.name }}</p>
      <router-link to="/prizes" class="button">More Prizes</router-link>
    </div>
  </div>
</template>

<script>
import faTimes from '@fortawesome/fontawesome-free-solid/faTimes';

export default {
  name: 'Modal',
  data() {
    return {
      stage: 0,
      responseMsg: null,
      icons: {
        close: faTimes
      }
    }
  },
  props: [ 'prize' ],
  methods: {
    redeemPrize() {
      fetch(`${this.server}/redeem-prize`, {
        method: 'POST',
        body: JSON.stringify({
          prizeId: this.prize._id,
          quantity: this.prize.quantity
        }),
        headers: { 'Content-Type': 'application/json' }
      })
      .then(response => response.json())
      .then(data => {
        if (data.ok) {
          if (data.nModified === 1) {
            this.stage++;
          } else {
            this.responseMsg = 'Sorry. This item is sold out.';
            this.$props.prize.quantity = 0;
          }
        } else if (data.codeName === 'Unauthorized') {
          this.responseMsg = 'You must be logged in to redeem a prize.';
        } else {
          this.responseMsg = 'Something went wrong.'
        };
      });
    }
  }
}
</script>

<style lang="css">
.cancel-button {
  background: #e5e5e5;
}
.modal-bg {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background: rgba(0, 0, 0, 0.5);
  z-index: 100;
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal {
  width: 40vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: white;
  padding: 1rem;
}
@media screen and (max-width: 768px) {
  .modal {
    width: 75vw;
  }
}
.modal > svg {
  align-self: flex-end;
  cursor: pointer;
  margin-top: 0;
}
.modal > * {
  margin: 1rem 0;
}
.modal > img {
  height: 200px;
  width: 200px;
  object-fit: cover;
  border-radius: 100px;
}
</style>
