<template>
  <div>
    <mdb-btn-group size="sm">
      <mdb-btn color="light-blue" @click.native="toUser()" :active="user_tab"
        >Register as user</mdb-btn
      >
      <mdb-btn color="light-blue" @click.native="toExpert()" :active="!user_tab"
        >Register as Expert</mdb-btn
      >
    </mdb-btn-group>
    <router-view></router-view>
  </div>
</template>

<script>
import { mdbBtn, mdbBtnGroup } from "mdbvue";
export default {
  name: "register",
  components: {
    mdbBtn,
    mdbBtnGroup,
  },
  data() {
    return {
      user_tab: true,
    };
  },
  mounted() {
    this.$router.push({ path: "user" });
  },
  methods: {
    toUser() {
      this.$router.push({ path: "user" });
      this.user_tab = !this.user_tab;
    },

    toExpert() {
      this.$router.push({ path: "expert" });
      this.user_tab = !this.user_tab;
    },
  },
};
</script>