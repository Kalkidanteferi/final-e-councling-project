<template>
  <div class="container">
    <img class="card-image" :src="blog_data.image" alt="" />
    <div class="align-left">
      <h3>{{ blog_data.title }}</h3>
      <timeago :datetime="blog_data.createdAt" :auto-update="60" class="small-txt"></timeago>
      <p>{{ blog_data.description }}</p>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import * as shared from "../../utils/shared";
export default {
  props: ["id"],
  data() {
    return {
      blog_data: {},
      image: null,
    };
  },
  mounted() {
    axios.get(`${shared.base_url}/api/blogs/${this.id}`).then((res) => {
      this.blog_data = res.data;
      this.blog_data.image = this.blog_data.image
        ? `${shared.base_url}/api/containers/images/download/${this.blog_data.image}`
        : require("../../assets/default.png");
    });
  },
};
</script>

<style scoped>
.card-image {
  width: 100%;
  height: 500px;
  object-fit: contain;
}
.align-left{
    text-align: left;
}
.small-txt{
    font-size: 12px;
}
</style>