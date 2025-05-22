const [Login, Side] = await importComponent(
  ['/views/page_login.js', '/views/page_side.js'],
);

export default {
  components: {
    Login,
    Side
  },
  data() {
    return {
      userName: 'Example',
    };
  },
  template: `
    <div class="login-layout">
    <Side />
    <Login :name="userName" />
    </div>
  `,
};