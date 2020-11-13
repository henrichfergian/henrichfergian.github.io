document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const idParam = Number(urlParams.get("id"));
  const isFromFav = urlParams.get("fav");
  const btnFav = document.querySelectorAll(".btn-fav");
  const navBack = document.querySelector(".nav-back");
  const preloaderElm = document.querySelector(".preloader");
  let playerData;

  navBack.onclick = () => {
    window.history.back();
  };

  if (isFromFav) {
    getFavPlayerById(idParam).then((response) => {
      playerData = response;
      preloaderElm.classList.add("hide");
    });
  } else {
    getPlayerById(idParam).then((response) => {
      playerData = response;
      isLoadDone = true;
      preloaderElm.classList.add("hide");
    });
  }

  getDbPlayerById(idParam).then((team) => {
    btnFav.forEach((btn) => {
      if (team) {
        btn.firstElementChild.innerHTML = "favorite";
      } else {
        btn.firstElementChild.innerHTML = "favorite_border";
      }
    });
  });

  btnFav.forEach(btn => {
    btn.onclick = async () => {
      console.log("button is clicked");
      const isSaved = await getDbPlayerById(idParam);

      if (!isSaved) {
        btnFav.forEach(button => {
          button.firstElementChild.innerHTML = "favorite";
        });
        console.log("add fav");
        addDbPlayer(playerData);
      } else {
        btnFav.forEach(button => {
          button.firstElementChild.innerHTML = "favorite_border";
        });
        console.log("deleted item");
        delDbPlayerById(idParam);
      }
    };
  });
});