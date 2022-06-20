<template>
  <div class="d-flex align-center">
    <v-tooltip bottom>
      <template #activator="{on, attrs}">
        <v-btn fab class="warning mr-4" @click="oncomment" small v-on="on" v-bind="attrs">
          <v-icon small>mdi-note</v-icon>
        </v-btn>
      </template>
      <i18n path="tt.vcomment" />
    </v-tooltip>
    <v-text-field
      v-if="commenton"
      ref="comment"
      class="ml-2 mr-4"
      :label="$t('fields.comment')"
      v-model="comment"
      @input="$emit('input', comment)"
      clearable
    ></v-text-field>
  </div>
</template>

<script>
export default {
  name: "VisitComment",
  props: ["value"],
  data() {
    return {
      commenton: false,
      comment: this.value,
    };
  },
  methods: {
    oncomment() {
      this.commenton = !this.commenton;
      if (this.commenton) {
        this.$nextTick(() => this.$refs.comment.focus());
      }
    },
  },
};
</script>

<style>
</style>