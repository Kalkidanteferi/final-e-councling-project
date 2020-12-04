<template>
  <div>
    <button class="d-flex btn btn-primary btn-sm" @click="modal = true">
      <i class="fa fa-plus"></i> Add
    </button>
    <div class="row">
      <div class="col-4" v-for="(item, index) in blogs" :key="index">
        <!-- <router-link :to="`/blog/${item.id}`"> -->
          <blog-compo :blog="item" @deleted="onDeleted()" />
        <!-- </router-link> -->
      </div>
    </div>
    <mdb-modal :show="modal" @close="modal = false">
      <ValidationObserver v-slot="{ handleSubmit }">
        <form @submit.prevent="handleSubmit(onSubmit)">
          <mdb-modal-header>
            <mdb-modal-title> Adding new Blog </mdb-modal-title>
          </mdb-modal-header>
          <mdb-modal-body style="padding-bottom: 20px">
            <input
              type="file"
              style="display: none"
              ref="pickAddImg"
              accept="image/*"
              @change="onAddImg"
            />
            <img
              :src="addImgData.preview"
              @click="$refs.pickAddImg.click()"
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
  </div>
</template>
<script>
import BlogCompo from "../../components/BlogCompo";
import axios from "axios";
import * as shared from "../../utils/shared";
import {
  mdbModal,
  mdbModalHeader,
  mdbModalTitle,
  mdbModalBody,
  mdbModalFooter,
} from "mdbvue";
export default {
  name: "Blog",
  components: {
    BlogCompo,
    mdbModal,
    mdbModalHeader,
    mdbModalTitle,
    mdbModalBody,
    mdbModalFooter,
  },
  data() {
    return {
      user_data: JSON.parse(localStorage.getItem("user_data")),
      modal: false,
      addImgData: {
        selectedImg: null,
        preview: require("../../assets/default.png"),
      },
      blog_data: {
        title: "",
        description: "",
        image: "",
      },
      blogs: [],
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      axios.get(`${shared.base_url}/api/blogs`).then((res) => {
        this.blogs = res.data;
      });
    },
    onAddImg(e) {
      this.addImgData.selectedImg = e.target.files[0];
      let reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onload = (event) => {
        this.addImgData.preview = event.target.result;
      };
    },
    onDeleted() {
      this.init();
    },
    onSubmit() {
      if (this.addImgData.selectedImg) {
        let formData = new FormData();
        formData.append("file", this.addImgData.selectedImg);
        axios
          .post(`${shared.base_url}/api/containers/images/upload`, formData)
          .then((res) => {
            this.blog_data.image = res.data.result.files.file[0].name;
            axios
              .post(
                `${shared.base_url}/api/users/${this.user_data.userId}/blogs`,
                this.blog_data
              )
              .then((res) => {
                this.blogs.push(res.data);
                this.modal = false;
              });
          });
      } else {
        axios
          .post(
            `${shared.base_url}/api/users/${this.user_data.userId}/blogs`,
            this.blog_data
          )
          .then((res) => {
            this.blogs.push(res.data);
            this.modal = false;
          });
      }
    },
  },
};
</script>
<style scoped>
.blog-image {
  width: 270px;
  height: 180px;
  cursor: pointer;
}
.blog-inputs {
  margin-top: 20px;
}
</style>