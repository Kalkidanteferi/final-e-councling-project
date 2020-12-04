<template>
  <div class="bolg-card">
    <router-link :to="`/blog/${blog.id}`">
    
    <img class="card-image" :src="image" alt="" />
    <div class="card-body">
      <div class="d-flex justify-content-between">
        <h5 class="card-title">{{ truncate() }}</h5>
        <timeago :datetime="blog.createdAt" :auto-update="60"></timeago>
      </div>
      <p class="card-content" v-line-clamp:20="4">
        {{ blog.description }}
      </p>
    </div>
    </router-link>
      <div class="left" v-if="user_data.userId === blog.user_id">
        <span @click="modal = true"
          ><i class="action-icons fa fa-pen amber-text"></i
        ></span>
        <span @click="confirm = true"
          ><i class="action-icons fa fa-trash red-text"></i
        ></span>
      </div>
    <mdb-modal :show="modal" @close="modal = false">
      <ValidationObserver v-slot="{ handleSubmit }">
        <form @submit.prevent="handleSubmit(onSubmit)">
          <mdb-modal-header>
            <mdb-modal-title> Editing Blog </mdb-modal-title>
          </mdb-modal-header>
          <mdb-modal-body style="padding-bottom: 20px">
            <input
              type="file"
              style="display: none"
              ref="pickEditImg"
              accept="image/*"
              @change="onEditImg"
            />
            <img
              :src="editImgData.preview"
              @click="$refs.pickEditImg.click()"
              alt="Ads Image"
              class="img-thumbnail ads-img blog-image"
            />
            <ValidationProvider
              name="Title"
              rules="required"
              v-slot="{ errors }"
            >
              <input
                type="text"
                v-model="blog_data.title"
                placeholder="Title"
                class="form-control blog-inputs form-control-sm"
              />
              <span class="errors">{{ errors[0] }}</span>
            </ValidationProvider>

            <ValidationProvider
              name="Description"
              rules="required"
              v-slot="{ errors }"
            >
              <textarea
                placeholder="Say something..."
                class="md-textarea blog-inputs form-control"
                v-model="blog_data.description"
                rows="3"
              ></textarea>
              <span class="errors">{{ errors[0] }}</span>
            </ValidationProvider>
          </mdb-modal-body>
          <mdb-modal-footer>
            <button class="btn btn-primary btn-sm" @click="modal = true">
              Submit
            </button>
          </mdb-modal-footer>
        </form>
      </ValidationObserver>
    </mdb-modal>
    <mdb-modal
      :show="confirm"
      @close="confirm = false"
      size="sm"
      class="text-center"
      danger
    >
      <mdb-modal-header center :close="false">
        <mdb-modal-title class="heading">Are you sure?</mdb-modal-title>
      </mdb-modal-header>
      <mdb-modal-body>
        <i class="animated rotateIn fa fa-times fa-4x text-danger"></i>
      </mdb-modal-body>
      <mdb-modal-footer center>
        <button class="btn btn-outline-danger btn-sm" @click="remove()">
          Yes
        </button>
        <button class="btn btn-danger btn-sm" @click="confirm = false">
          No
        </button>
      </mdb-modal-footer>
    </mdb-modal>
  </div>
</template>
<script>
import * as shared from "../utils/shared";
import axios from "axios";
import {
  mdbModal,
  mdbModalHeader,
  mdbModalTitle,
  mdbModalBody,
  mdbModalFooter,
} from "mdbvue";
export default {
  props: ["blog"],
  components: {
    mdbModal,
    mdbModalHeader,
    mdbModalTitle,
    mdbModalBody,
    mdbModalFooter,
  },
  data() {
    return {
      confirm: false,
      modal: false,
      user_data: JSON.parse(localStorage.getItem("user_data")),
      editImgData: {
        selectedImg: null,
        preview: this.blog.image
          ? `${shared.base_url}/api/containers/images/download/${this.blog.image}`
          : require("../assets/default.png"),
      },
      blog_data: {
        title: this.blog.title,
        description: this.blog.description,
        image: this.blog.image,
      },
      image: this.blog.image
        ? `${shared.base_url}/api/containers/images/download/${this.blog.image}`
        : require("../assets/default.png"),
      detail: false
    };
  },
  mounted() {},
  methods: {
    remove() {
      axios.delete(`${shared.base_url}/api/blogs/${this.blog.id}`).then(() => {
        this.onDeleted();
      });
    },
    onDeleted() {
      this.$emit("deleted", null);
    },
    onEditImg(e) {
      this.editImgData.selectedImg = e.target.files[0];
      let reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onload = (event) => {
        this.editImgData.preview = event.target.result;
      };
    },
    truncate(){
        if (!this.detail) {
            if (this.blog.title.length > 10) {
                return this.blog.title.substring(0,10) + '...';
            } else {
                return this.blog.title;
            }
        }
    },
    onSubmit() {
      if (this.editImgData.selectedImg) {
        let formData = new FormData();
        formData.append("file", this.editImgData.selectedImg);
        axios
          .post(`${shared.base_url}/api/containers/images/upload`, formData)
          .then((res) => {
            this.blog_data.image = res.data.result.files.file[0].name;
            axios
              .patch(
                `${shared.base_url}/api/blogs/${this.blog.id}`,
                this.blog_data
              )
              .then((res) => {
                this.blog = res.data;
                this.image = res.data.image
                  ? `${shared.base_url}/api/containers/images/download/${res.data.image}`
                  : require("../assets/default.png");
                this.modal = false;
              });
          });
      } else {
        axios
          .patch(`${shared.base_url}/api/blogs/${this.blog.id}`, this.blog_data)
          .then((res) => {
            this.blog = res.data;
            this.modal = false;
          });
      }
    },
  },
};
</script>
<style scoped>
.bolg-card {
  width: 100%;
  height: 400px;
  box-shadow: 5px 1px 10px 3px rgb(223, 223, 223);
  margin: 20px;
  border-radius: 10px;
  cursor: pointer;
  position: relative;
}
.card-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}
.card-body {
  text-align: left;
}
.card-title {
  font-weight: bold;
  color: gray;
}
.card-content {
  color: rgb(109, 109, 109);
}
.action-icons {
  margin-left: 15px;
  font-size: 15px;
  cursor: pointer;
}
.left {
    position: absolute;
    bottom: 5px;
    left: 5px;
}
.action-icons:hover {
    text-shadow: #FC0 1px 0 10px;
}
.blog-image {
  width: 270px;
  height: 180px;
  cursor: pointer;
  object-fit: contain;
}
.blog-inputs {
  margin-top: 20px;
}
</style>