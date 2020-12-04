<template>
    <div class="container">
        <div class="row">
            <div class="col-1"></div>
            <div class="col-10">

         <div v-html="service.decription" class="ql-editor"></div>
            </div>
            <div class="col-1"></div>
        </div>
    </div>
</template>
<script>
export default {
    props: ["service"]
}
</script>

<style scoped>
@import url('../../assets/style.css');
</style>