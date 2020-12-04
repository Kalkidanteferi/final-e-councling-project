<template>
  <div>
    <button class="d-flex btn btn-primary btn-sm" @click="modal = true">
      <i class="fa fa-plus"></i> Add
    </button>
    <mdb-modal :show="modal" @close="modal = false">
      <ValidationObserver v-slot="{ handleSubmit }">
        <form @submit.prevent="handleSubmit(onSubmit)">
          <mdb-modal-header>
            <mdb-modal-title>New Discussion Forum</mdb-modal-title>
          </mdb-modal-header>
          <mdb-modal-body>
            <ValidationProvider
              name="Title"
              rules="required"
              v-slot="{ errors }"
            >
              <div class="modal-content"></div>
              <input
                type="text"
                v-model="forumData.title"
                placeholder="Title"
                class="form-control form-control-sm"
              />
              <span class="errors">{{ errors[0] }}</span>
            </ValidationProvider>
            <div style="height: 20px"></div>
            <ValidationProvider
              name="Description"
              rules="required"
              v-slot="{ errors }"
            >
              <textarea
                placeholder="Say something..."
                class="md-textarea form-control"
                v-model="forumData.description"
                rows="3"
              ></textarea>
              <span class="errors">{{ errors[0] }}</span>
            </ValidationProvider>
            <div style="height: 20px"></div>
          </mdb-modal-body>
          <mdb-modal-footer>
            <button class="btn btn-primary btn-sm" type="submit">submit</button>
          </mdb-modal-footer>
        </form>
      </ValidationObserver>
    </mdb-modal>
    <div class="row">
      <div class="col-6" v-for="i in forums" :key="i.id">
        <discussion-forum-compo
          style="margin: 30px"
          :forum="i"
          @deleted="onDeleted()"
        ></discussion-forum-compo>
      </div>
    </div>
  </div>
</template>
<script>
import DiscussionForumCompo from "../../components/DiscussionForumCompo";
import axios from 'axios'
import * as shared from '../../utils/shared'
import {
  mdbModal,
  mdbModalHeader,
  mdbModalTitle,
  mdbModalBody,
  mdbModalFooter,
} from "mdbvue";
export default {
  name: "DiscussionForum",
  components: {
    DiscussionForumCompo,
    mdbModal,
    mdbModalHeader,
    mdbModalTitle,
    mdbModalBody,
    mdbModalFooter,
  },
  data() {
    return {
      modal: false,
      user_data: JSON.parse(localStorage.getItem("user_data")),
      forumData: {
        title: "",
        description: "",
      },
      forums: []
    };
  },
  mounted() {
    this.init()
  },
  methods: {
    init(){
      axios.get(`${shared.base_url}/api/forums`).then(res => {
        this.forums = res.data;
        this.forums.reverse()
      })
    },
    onSubmit() {
      axios.post(`${shared.base_url}/api/users/${this.user_data.userId}/forums`, this.forumData)
      .then(() => {
        this.modal = false
        this.init()
      })
    },
     onDeleted () {
        this.init()
      }
  },
};
</script>

<style scoped>
.modal-content {
  margin: 20px 0;
}
</style>