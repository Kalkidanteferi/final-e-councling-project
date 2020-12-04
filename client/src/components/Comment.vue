<template>
  <div class="text-left mt-5 comment-body">
    <h6 class="text-info">{{user.fullname}}</h6>
    <p v-if="user.specialization" class="specialization">{{user.specialization}}</p>
    <p>{{ reply.content }}</p>
    <i  class="fa fa-times text-danger remove-icon" 
        v-if="user_data.userId === reply.user_id"
        @click="remove()"></i>
  </div>
</template>

<script>
import axios from "axios";
import * as shared from "../utils/shared";
export default {
  props: ["reply"],
  data() {
    return {
        user_data: JSON.parse(localStorage.getItem("user_data")),
      user: {},
    };
  },
  mounted() {
    axios
      .get(`${shared.base_url}/api/users/getuser/${this.reply.user_id}`)
      .then((res) => {
        this.user = res.data.data[0]
      });
  },
  methods: {
      remove() {
          // axios.delete(`${shared.base_url}/api/replies/${this.reply.id}`).then(() => {
          //     this.onDeleted();
          // })
          axios.delete(`${shared.base_url}/api/replies/${this.reply.id}/${this.reply.forum_id}/remove`)
      },
      onDeleted () {
      this.$emit('deleted',null)
    },
  },
};
</script>

<style scoped>
    .specialization{
        font-size: 12px;
        color: lightgrey;
    }
    .comment-body{
        position: relative;
        box-shadow:1px 1px rgb(240, 240, 240);
        border-radius: 8px;
        padding: 10px;
    }
    .remove-icon{
        position: absolute;
        top: 5px;
        right: 5px;
        cursor: pointer;
    }
</style>