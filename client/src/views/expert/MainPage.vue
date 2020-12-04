<template>
  <div>
    <!--Navbar-->
    <nav class="navbar fixed-top navbar-expand-lg navbar-dark primary-color">
      <a class="navbar-brand" href="/expert/home">E-council</a>

      <div class="collapse navbar-collapse" id="basicExampleNav">
        <!-- Links -->
        <ul class="navbar-nav mr-auto">
          <li class="nav-item active">
            <router-link to="" class="navbar-item">Home</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/experthome/discussion" class="navbar-item">Discussion Forum</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/experthome/blog" class="navbar-item">Blog</router-link>
          </li>
           <li class="nav-item">
            <router-link to="/experthome/counselling" class="navbar-item">Counciling Service</router-link>
          </li>
        </ul>
        <!-- Links -->
        <span class="icon-btn" @click="logout()">
            <i class="fa fa-comment"></i>
        </span>
        <span class="icon-btn" @click="logout()">
            <i class="fa fa-sign-out-alt"></i>
        </span>
        
      </div>
      <!-- Collapsible content -->
    </nav>
    <!--/.Navbar-->
    <div class="container main-body">
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
export default {
  mounted() {
    if (!localStorage.getItem("user_data")) {
      this.$router.push({ path: "login" });
    }
  },
  methods: {
    logout() {
      localStorage.removeItem("user_data");
      this.$router.push({ path: "login" });
    },
  },
};
</script>

<style scoped>
.icon-btn{
    color: white;
    font-size: 30px;
    cursor: pointer;
    margin-left: 10px;
}
.navbar-item{
    color: white;
    margin-left: 30px;
    font-weight: bold;
}

.main-body{
    margin-top: 80px;
}
</style>