<template>
  <div>
    <avatar :username="name"></avatar>
    <input type="text" v-model="name">
  </div>
</template>
<script>
import Avatar from 'vue-avatar'
 
export default {
  components: {
    Avatar
  },
  data() {
    return {
      name: 'Biruk'
    }
  },
}
</script>