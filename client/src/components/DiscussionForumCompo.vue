<template>
  <div class="main-body">
    <div class="title-bar">
      <div class="date">
        <timeago :datetime="forum.createdAt" :auto-update="60"></timeago>
      </div>
      <div class="actions">
        <span class="action-icons" @click="replyModal()" v-if="!detail"><i class="fa fa-reply"></i></span>
        <span class="action-icons" @click="modal = true, recreating = true" v-if="!detail"><i class="fa fa-retweet"></i></span>
      </div>
    </div>

    <div class="content">
      <h3>{{ forum.title }}</h3>
      <p v-if="!detail" v-line-clamp:20="2">
        {{ forum.description }}
      </p>
      <p v-if="detail">
        {{ forum.description }}
      </p>
    </div>
    <div class="footer">
      <div class="left" v-if="user_data.userId === forum.user_id && !detail">
        <span @click="modal = true"
          ><i class="action-icons fa fa-pen amber-text"></i
        ></span>
        <span v-if="forum.show" @click="toggleShow()"><i class="action-icons fa fa-eye green-text"></i></span>
        <span v-if="!forum.show" @click="toggleShow()"><i class="action-icons fa fa-eye-slash grey-text"></i></span>
        <span @click="confirm = true"
          ><i class="action-icons fa fa-trash red-text"></i
        ></span>
      </div>
      <router-link :to="`/discussion/${forum.id}`" v-if="!detail">
        <div class="right">
          <h6 class="primary" v-if="forum.reply_count === 0">no replies</h6>
          <h6 class="primary" v-else-if="forum.reply_count === 1">1 reply</h6>
          <h6 class="primary" v-else>{{ forum.reply_count }} replies</h6>
        </div>
      </router-link>
    </div>

    <mdb-modal :show="modal" @close="closeModal()">
      <ValidationObserver v-slot="{ handleSubmit }">
        <form @submit.prevent="handleSubmit(onSubmit)">
          <mdb-modal-header>
            <mdb-modal-title>
              <span v-if="!recreating">
              {{replying ? `Replying to \'${forum.title}\'` : `Editing \'${forum.title}\'`}}
              </span>
              <span v-if="recreating">{{`Recreating \'${forum.title}\'`}}</span>

            </mdb-modal-title>
          </mdb-modal-header>
          <mdb-modal-body>
            <ValidationProvider
              name="Title"
              rules="required"
              v-if="!replying"
              v-slot="{ errors }"
            >
              <div class="modal-content"></div>
              <input
                type="text"
                v-model="title"
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
                 v-if="!replying"
                placeholder="Say ..."
                class="md-textarea form-control"
                v-model="description"
                rows="3"
              ></textarea>
               <textarea
                 v-if="replying"
                placeholder="Say something..."
                class="md-textarea form-control"
                v-model="reply_data.content"
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

    <mdb-modal
      :show="confirm"
      @close="confirm = false"
      size="sm"
      class="text-center"
      danger
    >
      <mdb-modal-header center :close="false">
        <p class="heading">Are you sure?</p>
      </mdb-modal-header>
      <mdb-modal-body>
        <mdb-icon icon="times" size="4x" class="animated rotateIn" />
      </mdb-modal-body>
      <mdb-modal-footer center>
        <mdb-btn outline="danger" @click="remove()">Yes</mdb-btn>
        <mdb-btn color="danger" @click="confirm = false">No</mdb-btn>
      </mdb-modal-footer>
    </mdb-modal>
  </div>
</template>

<script>
import axios from "axios";
import * as shared from "../utils/shared";
import {
  mdbModal,
  mdbModalHeader,
  mdbModalTitle,
  mdbModalBody,
  mdbModalFooter,
  mdbBtn,
  mdbIcon,
} from "mdbvue";
export default {
  props: ["forum", "detail"],
  data() {
    return {
      user_data: JSON.parse(localStorage.getItem("user_data")),
      modal: false,
      confirm: false,
      title:this.forum.title,
      description: this.forum.description,
      forum_data: {},
      reply_data : {
        content: '',
        forum_id: this.forum.id
      },
      replying: false,
      recreating: false
    };
  },
  components: {
    mdbModal,
    mdbModalHeader,
    mdbModalTitle,
    mdbModalBody,
    mdbModalFooter,
    mdbBtn,
    mdbIcon,
  },
  beforeMount() {
    this.forum
  },
  mounted() {
    this.title = this.forum.title;
    this.description = this.forum.description
  },
  methods: {
    onDeleted () {
      this.$emit('deleted',null)
    },
    onSubmit() {
      if (this.replying) {
        axios.post(`${shared.base_url}/api/users/${this.user_data.userId}/replies`, this.reply_data)
        .then(() => {
          this.reply_data.content = '';
          this.closeModal();
          this.onDeleted();
        })
      } else if (this.recreating) {
        let forum_data = {
          title: this.title,
          description: this.description
        }
        axios.post(`${shared.base_url}/api/users/${this.user_data.userId}/forums`, forum_data)
        .then(() => {
          this.reply_data.content = '';
          this.closeModal();
          this.onDeleted();
        })
      } else {
        axios
        .patch(
          `${shared.base_url}/api/forums/${this.forum.id}`,
          {
          title: this.title,
          description: this.description
        }
        )
        .then(() => {
          this.modal = false;
          this.onDeleted();
        });
      }
    },

    remove(){
      axios.delete(`${shared.base_url}/api/forums/${this.forum.id}`)
      .then(() => {
        this.onDeleted();
      })
    },
    toggleShow(){
       axios
        .patch(
          `${shared.base_url}/api/forums/${this.forum.id}`,
          {show: !this.forum_data.show}
        )
        .then((res) => {
          this.forum_data.show = res.data.show;
        });
    },

    replyModal(){
      this.modal = true;
      this.replying = true;
    },
    closeModal(){
      this.modal = false;
      this.replying = false;
      this.recreating = false;
    }
  },
};
</script>

<style scoped>
.title-bar {
  display: flex;
  width: 100%;
  height: 50px;
  background-color: #bed7ff;
  justify-content: space-between;
  padding: 12px 30px;
  border-top-right-radius: 12px;
  border-top-left-radius: 12px;
  color: white;
  font-weight: bold;
}
.main-body {
  /* border: 1px solid #78a8f7; */
  box-shadow: 5px 1px 10px 3px rgb(223, 223, 223);
  border-radius: 15px;
}
.content {
  padding: 10px 15px;
  max-width: 75ch;
  text-align: left;
}
.right {
  position: absolute;
  bottom: 25px;
  right: 25px;
  color: #78a8f7;
  cursor: pointer;
  margin-right: 30px;
}

.left {
  position: absolute;
  bottom: 30px;
  left: 40px;
  cursor: pointer;
}
.action-icons {
  margin-left: 15px;
  font-size: 15px;
  cursor: pointer;
}
</style>