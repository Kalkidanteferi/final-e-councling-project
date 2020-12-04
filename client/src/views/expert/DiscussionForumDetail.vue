<template>
  <div class="container">
    <div class="row">
      <div class="col-2"></div>
      <div class="col-8">
        <discussion-forum-compo
          style="margin: 30px"
          :forum="forum_data"
          :detail="true"
        ></discussion-forum-compo>
      </div>
      <div class="col-2"></div>
    </div>
    <div class="row">
      <div class="col-3"></div>
      <div class="col-6">
        <ValidationObserver v-slot="{ handleSubmit }">
          <form @submit.prevent="handleSubmit(onSubmit)">
            <ValidationProvider
              name="Reply"
              rules="required"
              v-slot="{ errors }"
            >
              <input
                type="text"
                v-model="reply_data.content"
                placeholder="Reply"
                class="form-control form-control-sm"
              />
              <span class="errors">{{ errors[0] }}</span>
            </ValidationProvider>
          </form>
        </ValidationObserver>
      </div>
      <div class="col-3"></div>
    </div>
    <div class="row">
      <div class="col-3"></div>
      <div class="col-6">
        <comment
          v-for="reply in replies"
          :key="reply.id"
          :reply="reply"
          @deleted="onDeleted()"
        />
      </div>
      <div class="col-3"></div>
    </div>
  </div>
</template>
<script>
import DiscussionForumCompo from "../../components/DiscussionForumCompo";
import Comment from "../../components/Comment";
import axios from "axios";
import * as shared from "../../utils/shared";
import io from "socket.io-client";
export default {
  props: ["id"],
  components: {
    DiscussionForumCompo,
    Comment,
  },
  data() {
    return {
      user_data: JSON.parse(localStorage.getItem("user_data")),
      forum_data: {},
      reply: "",
      socket: io("localhost:3000"),
      replies: [],
      reply_data: {
        content: "",
        forum_id: this.id,
      },
    };
  },
  mounted() {
    this.getForum();
    this.socket.on(`/Reply/${this.id}`, (data) => {
      this.replies.push(data.data);
    });

    this.socket.on(`/Reply/remove/${this.id}`, (data) => {
      for (let index = 0; index < this.replies.length; index++) {
        if (this.replies[index].id === data) {
          this.replies.splice(index, 1);
        }
      }
    });
  },
  methods: {
    getForum() {
      let filter = {
        include: ["replies"],
      };
      axios
        .get(
          `${shared.base_url}/api/forums/${this.id}?filter=${JSON.stringify(
            filter
          )}`
        )
        .then((res) => {
          this.forum_data = res.data;
          this.replies = res.data.replies;
          // this.replies.reverse();
        });
    },
    onSubmit() {
      axios
        .post(
          `${shared.base_url}/api/users/${this.user_data.userId}/replies`,
          this.reply_data
        )
        .then(() => {
          //   this.reply_data.content = '';
        });
    },
    onDeleted() {
      this.getForum();
    },
  },
};
</script>