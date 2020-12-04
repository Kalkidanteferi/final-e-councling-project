<template>
  <div class="container">
    <div class="card form-card">
      <ValidationObserver v-slot="{ handleSubmit }">
        <form @submit.prevent="handleSubmit(onSubmit)">
          <ValidationProvider
            name="Username / Email"
            rules="required|alpha"
            v-slot="{ errors }"
          >
            <div class="md-form">
              <input
                type="text"
                v-model="auth_data.username"
                placeholder="Username"
                class="form-control form-control-sm"
              />
              <span class="errors">{{ errors[0] }}</span>
            </div>
          </ValidationProvider>

          <ValidationProvider
            name="Password"
            rules="required|min: 6"
            v-slot="{ errors }"
          >
            <div class="md-form">
              <input
                type="password"
                v-model="auth_data.password"
                placeholder="Password"
                class="form-control form-control-sm"
              />
              <span class="errors">{{ errors[0] }}</span>
            </div>
          </ValidationProvider>
          <br />

          <button v-if="!loading" type="submit" class="btn btn-default btn-sm">
            Login
          </button>
        </form>
      </ValidationObserver>
      <router-link v-if="!loading" to="/register">Create Account</router-link>
      <div class="d-flex justify-content-center">
        <div class="spinner-grow" role="status" v-if="loading">
          <span class="sr-only">Loading...</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import * as shared from "../../utils/shared";
export default {
  name: "login",
  data() {
    return {
      title: "hello",
      auth_data: {
        username: "",
        password: "",
      },
      loading: false,
    };
  },
  mounted() {},
  methods: {
    onSubmit() {
      this.loading = true;
      axios
        .post(`${shared.base_url}/api/users/signin`, this.auth_data)
        .then((res) => {
          localStorage.setItem('user_data', JSON.stringify(res.data.data))
          if (res.data.data.user_type === 1) {
            this.$router.push({ path: "userhome" });
          }else if (res.data.data.user_type === 2) {
            this.$router.push({ path: "experthome" });
          }
        })
        .catch((err) => {
          this.loading = false;
          if (err.response) {
            if (err.response.status === 401) {
              this.$toast.open({
                message: "Incorrect username/password",
                position: "top",
                type: "error",
                duration: 3000,
                dismissible: true,
              });
            } else {
              this.$toast.open({
                message: "Something went wrong",
                position: "top",
                type: "error",
                duration: 3000,
                dismissible: true,
              });
            }
          } else if (err.message === "Network Error") {
            this.$toast.open({
              message: "Network error",
              position: "top",
              type: "error",
              duration: 3000,
              dismissible: true,
            });
          }
        });
    },
  },
};
</script>

<style scoped>
.form-card {
  width: 420px;
  padding: 50px 15px;
  margin-top: 25%;
}
.errors {
  font-size: 12px;
  float: left;
  color: red;
}  
</style>