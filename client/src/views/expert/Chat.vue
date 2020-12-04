<template>
  <div class="container main-body">
    <div class="chat-body">
      <div class="row">
        <div class="col-4 exp-list">
          <div v-for="conversation in conversations" :key="conversation.id">
            <router-link :to="`/chat/${conversation.id}`" class="route-active">
            <chat-message-list :user_id="
              user_data.userId === conversation.user_1 ? conversation.user_2 : conversation.user_1
            " class="chat-list-item" />
            </router-link>
          </div>
        </div>
        <div class="col-8">
          <router-view />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import ChatMessageList from "../../components/ChatMessageList";
import axios from "axios";
import * as shared from "../../utils/shared";
import io from "socket.io-client";
// import UserService from '../../services/userService';
export default {
  components: {
    ChatMessageList,
  },
  data() {
    return {
      message: "",
      num: 0,
      socket: io("localhost:3000"),
      user_data: JSON.parse(localStorage.getItem("user_data")),
      conversations: []
    };
  },
  mounted() {
    this.socket.on(`/Conversation/${this.user_data.userId}`, (data) => {
      (this.num = this.num + 1), console.log(data);
    });
    this.init();
  },
  methods: {
    init() {
      axios
        .get(
          `${shared.base_url}/api/conversations/get/${this.user_data.userId}`
        )
        .then((res) => {
          this.conversations = res.data.data;
        });
    },
    test() {
      alert("sending...");
    },
    send() {
      axios.post(`${shared.base_url}/api/messages/chat`, {
        message: "last message2222",
        from: "5f8f59aca28e3e2e338a5478",
        to: "5f88b9042746b242b0f499d4",
      });
    },
  },
};
</script>
<style scoped>
.chat-body {
  width: 80%;
  height: 500px;
  background-color: rgb(236, 235, 235);
  margin: auto;
  position: relative;
  top: 50px;
  border-radius: 10px;
}
.exp-list {
  width: 90%;
  height: 500px;
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
  background-color: lightgrey;
  padding: 10px 0px;
  overflow-x: hidden;
}
.chat-list-item {
  margin-top: 10px;
}


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


.router-link-exact-active {
   color: gray;
 }
</style>