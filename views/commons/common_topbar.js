export default {
  data() {
    return {
      currentPath: this.$route.path
    };
  },
  watch: {
    $route(to) {
      this.currentPath = to.path;
    }
  },
  template: `
   
  `
};
