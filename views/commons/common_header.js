
export default {
  template: `
    <div>
      <!-- Combined Header with Navigation -->
      <header class="navbar navbar-expand-lg navbar-dark bg-primary px-4">
        <span class="navbar-brand mb-0 h1">JLR</span>

        <!-- Horizontal Navigation Menu -->
        <ul class="navbar-nav ms-auto flex-row">
          <li class="nav-item mx-2">
            <router-link
              class="nav-link"
              to="/home"
              exact
              active-class="active"
            >Home</router-link>
          </li>
          <li class="nav-item mx-2">
            <router-link
              class="nav-link"
              to="/dashboard"
              exact
              active-class="active"
            >Dashboard</router-link>
          </li>
          <li class="nav-item mx-2">
            <router-link
              class="nav-link"
              to="/purchase-master"
              exact
              active-class="active"
            >Purchase Master</router-link>
          </li>
          <li class="nav-item mx-2">
            <router-link
              class="nav-link"
              to="/inventory"
              exact
              active-class="active"
            >Inventory</router-link>
          </li>
        </ul>
      </header>

    </div>
  `
};
