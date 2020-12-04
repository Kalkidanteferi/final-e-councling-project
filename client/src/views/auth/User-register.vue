<template>
  <div class="container">
    <div class="card form-card">
      <ValidationObserver v-slot="{ handleSubmit }">
        <form @submit.prevent="handleSubmit(onSubmit)">
          <ValidationProvider
            name="Full name"
            rules="required|alpha"
            v-slot="{ errors }"
          >
            <div class="md-form">
              <input
                type="text"
                v-model="user_data.fullname"
                placeholder="Full name"
                class="form-control form-control-sm"
              />
              <span class="errors">{{ errors[0] }}</span>
            </div>
          </ValidationProvider>

          <ValidationProvider
            name="Username"
            rules="required|alpha"
            v-slot="{ errors }"
          >
            <div class="md-form">
              <input
                type="text"
                v-model="user_data.username"
                placeholder="Username"
                class="form-control form-control-sm"
              />
              <span class="errors">{{ errors[0] }}</span>
            </div>
          </ValidationProvider>

          <ValidationProvider
            name="Email"
            rules="required|email"
            v-slot="{ errors }"
          >
            <div class="md-form">
              <input
                type="email"
                v-model="user_data.email"
                placeholder="Email"
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
                v-model="user_data.password"
                placeholder="Password"
                class="form-control form-control-sm"
              />
              <span class="errors">{{ errors[0] }}</span>
            </div>
          </ValidationProvider>
          <br />

          <button v-if="!loading" type="submit" class="btn btn-default btn-sm">
            Register
          </button>
        </form>
      </ValidationObserver>
      <router-link v-if="!loading" to="/login"
        >Already have an account</router-link
      >
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
      user_data: {
        fullname: "",
        username: "",
        email: "",
        password: "",
      },
      confirm_password: "",
      loading: false,
    };
  },
  mounted() {},
  methods: {
    onSubmit() {
      this.loading = true;
      axios
        .post(`${shared.base_url}/api/users/userRegister`, this.user_data)
        .then(() => {
          this.$router.push({ path: "login" });
        })
        .catch((err) => {
          this.loading = false;
          if (err.response && err.response.status === 422) {
            if (err.response.data.error.details.messages.email) {
              this.$toast.open({
                message: err.response.data.error.details.messages.email[0],
                position: "top",
                type: "error",
                duration: 3000,
                dismissible: true,
              });
            } else if (err.response.data.error.details.messages.username) {
              this.$toast.open({
                message: err.response.data.error.details.messages.username[0],
                position: "top",
                type: "error",
                duration: 3000,
                dismissible: true,
              });
            }else {
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
  padding: 10px 15px;
  margin-top: 25%;
}

.errors {
  font-size: 12px;
  float: left;
  color: red;
}
</style>