document.addEventListener("DOMContentLoaded", () => {
  const collapsElm = document.querySelectorAll(".collapsible");
  M.Collapsible.init(collapsElm, {});

  const urlParams = new URLSearchParams(window.location.search);
  const idParam = Number(urlParams.get("id"));
  const isFromFav = urlParams.get("fav");
  const btnFavElm = document.querySelectorAll(".btn-fav");
  const navBackElm = document.querySelector(".nav-back");
  const preloaderElm = document.querySelector(".preloader")
  let teamData;

  navBackElm.onclick = () => {
    window.history.back();
  };

  if (isFromFav) {
    getFavTeamById(idParam).then((response) => {
      teamData = response;
      preloaderElm.classList.add("hide");
    });
  } else {
    getTeamById(idParam).then((response) => {
      teamData = response;
      preloaderElm.classList.add("hide");
    });
  }

  getDbTeamById(idParam).then((team) => {
    btnFavElm.forEach((btn) => {
      if (team) {
        btn.firstElementChild.innerHTML = "favorite";
      } else {
        btn.firstElementChild.innerHTML = "favorite_border";
      }
    });
  });

  btnFavElm.forEach(btn => {
    btn.onclick = async () => {
      const isSaved = await getDbTeamById(idParam);

      if (!isSaved) {
        btnFavElm.forEach(button => {
          button.firstElementChild.innerHTML = "favorite";
        });
        console.log("add fav");
        addDbTeam(teamData);
      } else {
        btnFavElm.forEach(button => {
          button.firstElementChild.innerHTML = "favorite_border";
        });
        console.log("deleted item");
        delDbTeamById(idParam);
      }
    };
  });
});