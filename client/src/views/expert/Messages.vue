<template>
  <div>
    <div class="chat-with">
      <chat-message-list
        :user_id="
          user_data.userId === conversation.user_1
            ? conversation.user_2
            : conversation.user_1
        "
        class="chat-with-user"
      />
    </div>
    <div class="messages" id="message-container">
      <div v-for="message in messages" :key="message.id">
        <div
          v-if="message.from !== user_data.userId"
          class="animated zoomInLeft fast message-left"
        >
          {{ message.messages }}
        </div>
        <div
          v-if="message.from === user_data.userId"
          class="animated zoomInRight fast message-right"
        >
          {{ message.messages }}
        </div>
      </div>
    </div>
    <div class="md-form message-input input-with-post-icon">
      <input
        type="text"
        id="form1"
        class="form-control"
        placeholder="Your message"
        v-model="message"
      />
      <span
        class="float-right mr-4 send-btn"
        v-if="message !== ''"
        @click="sendMessage()"
      >
        <i class="fa fa-paper-plane fa-1x prefix text-primary"></i>
      </span>
    </div>
  </div>
</template>

<script>
import ChatMessageList from "../../components/ChatMessageList";
import axios from "axios";
import * as shared from "../../utils/shared";
import io from "socket.io-client";
export default {
  props: ["id"],
  components: {
    ChatMessageList,
  },
  data() {
    return {
      num: 20,
      user_data: JSON.parse(localStorage.getItem("user_data")),
      chat_with: null,
      messages: [],
      conversation: null,
      message: "",
      conversation_id: null,
      socket: io("localhost:3000"),
    };
  },
  mounted() {
    // this.chat_with = this.user_data.userId ===
    this.init(this.id);
    this.conversation_id = this.id;
    this.socket.on(`/Message/${this.conversation_id}`, (data) => {
      this.messages.push(data);
    });
  },
  methods: {
    init(id) {
      axios
        .get(`${shared.base_url}/api/conversations/${id}/messages`)
        .then((res) => {
          this.messages = res.data;
        });
      axios.get(`${shared.base_url}/api/conversations/${id}`).then((res) => {
        this.conversation = res.data;
      });
    },
    sendMessage() {
      axios.post(
        `${shared.base_url}/api/conversations/${this.conversation_id}/messages`,
        {
          messages: this.message,
          from: this.user_data.userId,
          to:
            this.user_data.userId === this.conversation.user_1
              ? this.conversation.user_2
              : this.conversation.user_1,
        }
      );
      this.message = ""
    },
  },
  watch: {
    id: function () {
      this.init(this.id);
      this.conversation_id = this.id;
    },
  },
};
</script>

<style scoped>
.chat-with {
  width: 97.7%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 3;
}
.chat-with-user {
  border-top-right-radius: 10px;
}
.messages {
  height: 390px;
  margin-top: 70px;
  overflow-x: hidden;
  position: relative;
}
.message-left {
  margin: 20px;
  width: 80%;
  background-color: white;
  padding: 5px 20px;
  border-radius: 20px;
  border-bottom-left-radius: 0;
  text-align: left;
}
.message-right {
  margin: 20px 0 20px 100px;
  width: 80%;
  background-color: lightgray;
  padding: 5px 20px;
  border-radius: 20px;
  border-bottom-right-radius: 0;
  text-align: left;
}
.message-input {
  width: 93%;
  position: absolute;
  bottom: -30px;
}
.send-btn {
  cursor: pointer;
}
</style>