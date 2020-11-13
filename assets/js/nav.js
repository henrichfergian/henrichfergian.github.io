document.addEventListener("DOMContentLoaded", () => {
  let page = window.location.hash.substr(1);
  if (page === "") {
    page = "home";
  }

  const loadPage = () => {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      if (this.readyState === 4) {
        const content = document.getElementById("body-content");

        switch (page) {
          case "home":
            getStandings(2001);
            break;
          case "teams":
            getTeams(2001);
            break;
          case "favorite":
            getFavItems();
            break;
        }
        const preloaderElm = document.querySelector(".preloader");
        preloaderElm.classList.add("hide");

        if (this.status === 200) {
          content.innerHTML = xhr.responseText;
          const selElm = document.querySelectorAll("select");
          const tabsElm = document.querySelectorAll(".tabs");

          M.FormSelect.init(selElm, {});
          M.Tabs.init(tabsElm, {});

          selElm.forEach((elm) => {
            $(elm).on("change", updateAction);
          });

          function updateAction() {
            const selection = $(this).val();
            console.log("competition selected is: ", selection);
            if (page === "home") {
              getStandings(selection);
            } else {
              getTeams(selection);
            }
          }
        } else if (this.status === 404) {
          content.innerHTML = `<p class="center-align">Page Not Found 404</p>`;
        } else {
          content.innerHTML = "<p>Oopss... Something went wrong</p>";
          M.toast({
            html: "Can't connect to network!"
          });
        }
      }
    };
    xhr.open("GET", `/assets/pages/${page}.html`, true);
    xhr.send();
  };

  const loadNav = () => {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      if (this.readyState === 4) {
        if (this.status !== 200) {
          return;
        }
        document.querySelectorAll(".topnav, .sidenav").forEach((elems) => {
          elems.innerHTML = xhr.responseText;
        });
        document.querySelectorAll(".sidenav a, .topnav a, .brand-logo").forEach((elems) => {
          elems.addEventListener("click", (event) => {
            const sidenavElm = document.querySelector(".sidenav");
            const preloaderElm = document.querySelector(".preloader");
            M.Sidenav.getInstance(sidenavElm).close();
            preloaderElm.classList.remove("hide");
            page = event.target.getAttribute("href");
            page = page.substr(1);
            loadPage(page);
          });
        });
      }
    };
    xhr.open("GET", "nav.html", true);
    xhr.send();
  };

  const sidenav = document.querySelectorAll(".sidenav");
  M.Sidenav.init(sidenav);
  loadNav();
  loadPage(page);
});