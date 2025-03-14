const db = "./db.json";
const playerSection = document.querySelector(".player-section");
const modalMenu = document.querySelector(".menu");
const modalArea = document.querySelector(".modal-area");
const modalList = document.querySelector(".modal-lists");

fetch(db)
  .then((res) => res.json())
  .then((data) => {
    const dbLists = {
      data: data.data.map((item) => ({ ...item })),
    };

    const createList = (list) => {
      const { id } = list;
      const article = document.createElement("article");

      article.innerHTML = `
        <div class="inner">
        <div class="pic">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="100%"
                height="100%"
                viewBox="0 0 600 600"
                fill="none"
              >
                <defs>
                  <mask id="albumcover">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M300 600C465.685 600 600 465.685 600 300C600 134.315 465.685 0 300 0C134.315 0 0 134.315 0 300C0 465.685 134.315 600 300 600ZM300 323C312.703 323 323 312.703 323 300C323 287.297 312.703 277 300 277C287.297 277 277 287.297 277 300C277 312.703 287.297 323 300 323Z" fill="white"/>
                  </mask>
                </defs>

                <image
                  mask="url(#albumcover)"
                  xlink:href="${list.albumCover}"
                  width="100%"
                />
              </svg>
              <div class="recordbar">
              <img src="./imgs/recordbar.svg" />
              </div>
            </div>
          
          <div class="txt">
            <div class="tit">
              <h2>${list.title}</h2>
              <p>${list.singer}</p>
            </div>
            <div class="progressbar">
                <div class="progress">
                  <div class="cir"></div>
                </div>
              </div>
            <ul class="btns">
              <li class="pause">
                <img src="./imgs/stop.svg" />
              </li>
              <li class="play">
                <i class="fas fa-play"></i>
              </li>
              <li class="load">
                <img src="./imgs/refresh.svg" />
              </li>
            </ul>
            <audio src="${list.audio}"></audio>
          </div>
        </div>`;

      article.className = "player";
      article.classList.add(id);
      playerSection.appendChild(article);
    };

    // modal
    const createModal = (list) => {
      const { id } = list;
      const li = document.createElement("li");
      li.innerHTML = `
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="100%"
                height="100%"
                viewBox="0 0 600 600"
                fill="none"
              >
                <defs>
                  <mask id="albumcover">
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M300 600C465.685 600 600 465.685 600 300C600 134.315 465.685 0 300 0C134.315 0 0 134.315 0 300C0 465.685 134.315 600 300 600ZM300 323C312.703 323 323 312.703 323 300C323 287.297 312.703 277 300 277C287.297 277 277 287.297 277 300C277 312.703 287.297 323 300 323Z"
                      fill="white"
                    />
                  </mask>
                </defs>

                <image
                  mask="url(#albumcover)"
                  xlink:href="${list.albumCover}"
                  width="100%"
                />
              </svg>
              <div class="cover">
                <h5>${list.title}</h5>
                <p>${list.singer}</p>
              </div>
            </div>`;

      li.classList.add(id);
      modalList.appendChild(li);
    };

    const importData = () => {
      dbLists.data.slice(0, 8).map((list) => {
        createList(list);
        createModal(list);
      });
    };
    importData();

    //  player rotation
    const players = document.querySelectorAll(".player");
    const audios = playerSection.querySelectorAll("audio");
    const prev = document.querySelector(".btnPrev");
    const next = document.querySelector(".btnNext");
    const deg = 45;
    let i = 0;

    players.forEach((player) => {
      const play = player.querySelector(".play");
      const pause = player.querySelector(".pause");
      const load = player.querySelector(".load");

      const progressbar = player.querySelector(".progressbar");
      const progress = progressbar.querySelector(".progress");
      const cir = progress.querySelector(".cir");
      const audio = player.querySelector("audio");

      player.style.transform = `rotate(${i * deg}deg) translateY(-185%)`;
      i++;

      let audioDuration = 0;
      let audioCurrent = audio.currentTime;

      // audio progress & point
      const updateProgress = () => {
        audioDuration = audio.duration;
        audioCurrent = audio.currentTime;
        const percent = (audioCurrent / audioDuration) * 100;
        progress.style.width = `${percent}%`;

        const progressbarWidth = progressbar.clientWidth;
        const newPosition = (audioCurrent / audioDuration) * progressbarWidth;

        cir.style.left = `${newPosition}px`;
      };

      const audioPoint = (e) => {
        const mouseX = e.pageX - progressbar.getBoundingClientRect().x;
        const progressbarWidth = progressbar.getBoundingClientRect().width;
        audioDuration = audio.duration;
        const clickTime = (mouseX / progressbarWidth) * audioDuration;
        audio.currentTime = clickTime;
      };

      audio.addEventListener("timeupdate", updateProgress);
      progressbar.addEventListener("click", audioPoint);

      // audio event
      play.addEventListener("click", (e) => {
        const isActive = e.currentTarget
          .closest("article")
          .classList.contains("on");

        if (isActive) {
          const activePic = e.currentTarget
            .closest("article")
            .querySelector(".pic");

          activePic.classList.add("on");

          const activeAudio = e.currentTarget
            .closest("article")
            .querySelector("audio");

          activeAudio.play();

          activeAudio.addEventListener("ended", () => {
            activePic.classList.remove("on");
          });
        }
      });

      pause.addEventListener("click", (e) => {
        const isActive = e.currentTarget
          .closest("article")
          .classList.contains("on");

        if (isActive) {
          const activePic = e.currentTarget
            .closest("article")
            .querySelector(".pic");

          activePic.classList.remove("on");

          const activeAudio = e.currentTarget
            .closest("article")
            .querySelector("audio");

          activeAudio.pause();
        }
      });

      load.addEventListener("click", (e) => {
        const isActive = e.currentTarget
          .closest("article")
          .classList.contains("on");

        if (isActive) {
          e.currentTarget
            .closest("article")
            .querySelector(".pic")
            .classList.add("on");

          e.currentTarget.closest("article").querySelector("audio").load();
          e.currentTarget.closest("article").querySelector("audio").play();
        }
      });
    });

    // button event
    let num = 0;
    // article list에 on 클래스
    let active = 0;
    const len = players.length - 1;

    players[0].classList.add("on");

    const activation = (index, lists) => {
      lists.forEach((list) => {
        list.classList.remove("on");
      });
      lists[index].classList.add("on");
    };

    // 다음으로 넘어가면 초기화하기
    const initMusic = () => {
      audios.forEach((audio) => {
        audio.pause();
        audio.load();
        audio.parentElement.previousElementSibling.classList.remove("on");
      });
    };

    //btn click event
    let isClicked = false;
    const prevBtnClick = () => {
      if (isClicked) return;
      isClicked = true;

      initMusic();
      num++;

      if (num === 8) {
        playerSection.style.transform = `translateX(-50%) rotate(${
          deg * num
        }deg)`;
        setTimeout(() => {
          playerSection.style.transition = `none`;
          num = 0;
          playerSection.style.transform = `translateX(-50%) rotate(0deg)`;
        }, 900);
        playerSection.style.transition = `transform 0.9s`;
      } else {
        playerSection.style.transition = `transform 0.9s`;
        playerSection.style.transform = `translateX(-50%) rotate(${
          deg * num
        }deg)`;
      }

      active === 0 ? (active = len) : active--;
      activation(active, players);

      setTimeout(() => {
        isClicked = false;
      }, 900);
    };

    const nextBtnClick = () => {
      if (isClicked) return;
      isClicked = true;

      initMusic();
      num--;

      if (num === -8) {
        playerSection.style.transform = `translateX(-50%) rotate(${
          deg * num
        }deg)`;
        setTimeout(() => {
          playerSection.style.transition = `none`;
          num = 0;
          playerSection.style.transform = `translateX(-50%) rotate(0deg)`;
        }, 900);
        playerSection.style.transition = `transform 0.9s`;
      } else {
        playerSection.style.transition = `transform 0.9s`;
        playerSection.style.transform = `translateX(-50%) rotate(${
          deg * num
        }deg)`;
      }

      active === len ? (active = 0) : active++;
      activation(active, players);

      setTimeout(() => {
        isClicked = false;
      }, 900);
    };

    prev.addEventListener("click", prevBtnClick);
    next.addEventListener("click", nextBtnClick);

    //modal click event
    const modalAlbums = modalList.querySelectorAll("li");
    modalAlbums.forEach((album) => {
      album.addEventListener("click", () => {
        initMusic();
        num = -(album.className - 1);

        playerSection.style.transform = `translateX(-50%) rotate(${
          deg * num
        }deg)`;

        active = album.className - 1;
        activation(active, players);

        modalArea.classList.remove("active");
      });
    });
  });

//modal click event
modalMenu.addEventListener("click", () => {
  modalArea.classList.toggle("active");
});
