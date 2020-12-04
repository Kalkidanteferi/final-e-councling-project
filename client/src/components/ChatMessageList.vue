<template>
  <div class="message-body">
    <div class="d-flex">
      <avatar :username="user.fullname"></avatar>
      <div class="user-detail">
        <p class="name">{{ user.fullname }}</p>
        <p class="specialization" v-if="user.specialization">
          {{ user.specialization }}
        </p>
      </div>
    </div>
  </div>
</template>
<script>
import Avatar from "vue-avatar";
import UserService from "../services/userService";

export default {
  props: ["user_id"],
  components: {
    Avatar,
  },
  data() {
    return {
      name: "Full name",
      user: null,
      userService: new UserService(),
    };
  },
  mounted() {
      this.getUser(this.user_id)
  },

  methods: {
    getUser(id) {
      this.userService.getUserById(id).then((res) => {
        this.user = res.data.data[0];
      });
    },
  },

  watch: {
    user_id: function () {
      this.getUser(this.user_id);
    },
  },
};
</script>
<style scoped>
.message-body {
  width: 100%;
  height: 70px;
  background-color: rgb(206, 206, 206);
  padding: 10px;
  cursor: pointer;
}
.message-body:hover {
  background-color: rgb(200, 200, 200);
}
.user-detail {
  text-align: left;
  margin: 10px;
}
.name {
  font-size: 15px;
  margin-bottom: -5px;
}
.specialization {
  font-size: 12px;
  color: rgb(114, 114, 114);
}
</style>