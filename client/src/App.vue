<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  data() {
    return {
      user_data: JSON.parse(localStorage.getItem("user_data")),
    };
  },
  mounted() {
    if (this.user_data) {
      if (this.user_data.user_type === 1) {
        // this.$router.push({ path: "userhome" });
      } else if (this.user_data.user_type === 2) {
        // this.$router.push({ path: "experthome" });
      }
    } else {
      this.$router.push({ path: "login" });
    }
  },
};
</script>

<style>
@import url("https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap");
@import "~vue-wysiwyg/dist/vueWysiwyg.css";

@import "~vue2-editor/dist/vue2-editor.css";

/* Import the Quill styles you want */
@import '~quill/dist/quill.core.css';
@import '~quill/dist/quill.bubble.css';
@import '~quill/dist/quill.snow.css';

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

.errors {
  font-size: 12px;
  float: left;
  color: red;
}
</style>
