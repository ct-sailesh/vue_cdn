<?php $ver = date('YmdHis'); ?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <title>JLR-DMS</title>
  <link rel="shortcut icon" type="image/x-icon" href="/favicon.ico">
  <meta name="theme-color" content="#ffffff">
  <!-- Bootstrap CSS -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.3/css/bootstrap.min.css?v=<?=$ver?>">
  <!-- Custom CSS -->
  <link rel="stylesheet" href="/assets/css/styles.css?v=<?=$ver?>">
  <!-- jQuery (optional) -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js?v=<?=$ver?>"></script>
  <!-- Vue 3 Global -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/vue/3.5.13/vue.global.min.js?v=<?=$ver?>"></script>
   <!-- Vue Router Global -->
   <script src="https://cdnjs.cloudflare.com/ajax/libs/vue-router/4.5.0/vue-router.global.min.js?v=<?=$ver?>"></script>
</head>
<body>
  
<div id="app">
  <!-- <auth-component></auth-component> -->
  <router-view></router-view>
</div>
  
  <script type="module">

  // Function to load and initialize the Vue app
  async function initializeApp() {
    try {
      // Import Vue and Pinia
      const { createApp } = Vue;

      // Create a Vue app instance
      const app = createApp();

      // Define the global properties in an object
      globalThis.ver = '<?=$ver?>';
      const g = {
        $ver: ver,
        $base_url: "<?=$base_url?>",
        $base_url_api: "https://check.airland.one"
      };

      // Loop through the globalProperties object and set them
      Object.keys(g).forEach(k => {
        app.config.globalProperties[k] = g[k];
      });

      // Dynamically import required modules in parallel
      const [{ httpService, importComponent }, { globalMixin }, { default: router }, { AuthComponent }] = await Promise.all([
        import(`/views/components/lib/http-service.js?v=${ver}`),
        import(`/views/components/lib/global-mixin.js?v=${ver}`),
        import(`/views/router.js?v=${ver}`),
        import(`/views/components/models/auth.js?v=${ver}`)
      ]);

      // Global mixin for shared functionality across components
      app.mixin(globalMixin);
      app.mixin(httpService);

      // GlobalThis for js shared functions across components
      globalThis.importComponent = importComponent;

      // Set up the router for navigation
      app.use(router);

      // Register the AuthComponent globally
      // app.component('auth-component', AuthComponent);
 
      // Mount the Vue app to the DOM element with ID 'app'
      app.mount('#app');

    } catch (error) {
      // Catch any errors that happen during dynamic import
      console.error('Error loading modules:', error);
    }
  }
  initializeApp();
</script>
  <!-- Bootstrap JS (Bundle with Popper) -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.3/js/bootstrap.bundle.min.js"></script>
</body>
</html>