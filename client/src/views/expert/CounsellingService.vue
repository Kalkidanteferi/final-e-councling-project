<template>
  <div>
    <button
      class="d-flex btn btn-primary btn-sm"
      @click="modal = true"
      v-if="user_data.user_type === 2"
    >
      <i class="fa fa-plus"></i> Add
    </button>
    <div class="row">
      <div
        class="col-3"
        v-for="(item, index) in counselling_contents"
        :key="index"
      >
        <div class="services">
          <h2 @click="detail(item)">{{ item.type }}</h2>
          <div class="actions" v-if="user_data.user_type === 2">
            <span @click="launchEdit(item)"
              ><i class="fa fa-pen text-warning ml-3"></i
            ></span>
            <span @click="confirm= true, delete_id = item.id"><i class="fa fa-trash text-danger ml-3"></i></span>
          </div>
        </div>
      </div>
    </div>
    <mdb-modal :show="modal" @close="onClose()" size="lg">
      <ValidationObserver v-slot="{ handleSubmit }">
        <form @submit.prevent="handleSubmit(onSubmit)">
          <mdb-modal-header>
            <mdb-modal-title>
              {{
                editing
                  ? "Editing Counselling Service"
                  : "Adding new Counselling Service"
              }}
            </mdb-modal-title>
          </mdb-modal-header>
          <mdb-modal-body style="padding-bottom: 20px">
            <ValidationProvider
              name="Type"
              rules="required"
              v-slot="{ errors }"
            >
              <input
                type="text"
                v-model="service_data.type"
                placeholder="Type"
                class="form-control blog-inputs form-control-sm"
              />
              <span class="errors">{{ errors[0] }}</span>
            </ValidationProvider>

            <ValidationProvider
              name="Description"
              rules="required"
              v-slot="{ errors }"
            >
              <vue-editor
                v-model="service_data.decription"
                class="blog-inputs"
                :editorToolbar="customToolbar"
              />
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
import { VueEditor } from "vue2-editor";
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
  components: {
    VueEditor,
    mdbModal,
    mdbModalHeader,
    mdbModalTitle,
    mdbModalBody,
    mdbModalFooter,
  },

  data: () => ({
    modal: false,
    editing: false,
    user_data: JSON.parse(localStorage.getItem("user_data")),
    service_data: {
      type: "",
      decription: "",
    },
    confirm: false,
    edit_id: null,
    delete_id: null,
    counselling_contents: [],
    customToolbar: [
      [{ header: [false, 1, 2, 3, 4, 5, 6] }],
      ["bold", "italic", "underline"],
      [
        { align: "" },
        { align: "center" },
        { align: "right" },
        { align: "justify" },
      ],
      [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
      ["link", "code-block"],
      [{ color: [] }, { background: [] }],
    ],
  }),
  mounted() {
    this.init();
  },
  methods: {
    init() {
      if (this.user_data.user_type === 2) {
        axios
          .get(
            `${shared.base_url}/api/users/${this.user_data.userId}/counselling-contents`
          )
          .then((res) => {
            this.counselling_contents = res.data;
          });
      } else {
        axios.get(`${shared.base_url}/api/counselling-contents`).then((res) => {
          this.counselling_contents = res.data;
        });
      }
    },
    onSubmit() {
      if (this.editing) {
        axios
          .patch(
            `${shared.base_url}/api/counselling-contents/${this.edit_id}`,
            this.service_data
          )
          .then(() => {
            this.init();
            this.modal = false;
          });
      } else {
        axios
          .post(
            `${shared.base_url}/api/users/${this.user_data.userId}/counselling-contents`,
            this.service_data
          )
          .then((res) => {
            this.counselling_contents.push(res.data);
            this.modal = false;
          });
      }
    },
    launchEdit(data) {
      this.editing = true;
      this.service_data = data;
      this.modal = true;
      this.edit_id = data.id;
    },
    remove() {
      axios
        .delete(`${shared.base_url}/api/counselling-contents/${this.delete_id}`)
        .then(() => {
          this.init();
          this.confirm = false;
        });
    },
    detail(service) {
      this.$router.push({
        name: "ServiceDetail",
        params: { service: service },
      });
    },
    onClose() {
      this.modal = false;
      this.editing = false;
      this.service_data = {
        type: "",
        decription: "",
      };
    },
  },
};
</script>

<style scoped>
.blog-inputs {
  margin-top: 20px;
}
.services {
  width: 200px;
  height: 200px;
  background-color: lightgray;
  color: black;
  border-radius: 10px;
  position: relative;
  margin: 10px 0;
  padding-top: 30%;
  cursor: pointer;
}

.services h2 {
  margin: auto;
}
.actions {
  position: absolute;
  bottom: 2px;
  left: 4px;
  z-index: 3;
}
.actions i:hover {
  opacity: 0.5;
}
</style>