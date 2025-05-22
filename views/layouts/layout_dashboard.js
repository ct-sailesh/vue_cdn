const [Header, Sidebar, Footer] = await importComponent(
  ['/views/commons/common_header.js', '/views/commons/common_sidebar.js', '/views/commons/common_footer.js'],
);

export default {
  components: {
    Header,
    Sidebar,
    Footer
  },
  data() {
    return {
      userName: 'Example',
    };
  },
  template: `
    <div class="login-layout">
    <Header></Header>
    <Sidebar></Sidebar>
    <Footer></Footer
    >

    <!-- <Login :name="userName" /> -->
    </div>
  `,
};