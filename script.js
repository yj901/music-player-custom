const db = "./db.json";
const playerSection = document.querySelector(".player-section");

fetch(db)
  .then((res) => res.json())
  .then((data) => {
    const dbLists = {
      data: data.data.map((item) => ({ ...item })),
    };

    const createList = (list) => {
      const article = document.createElement("article");

      article.innerHTML = `
        <div class="inner">
        <div class="pic">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="100%"
                height="100%"
                viewBox="0 0 600 592"
                fill="none"
              >
                <defs>
                  <mask id="albumcover">
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M300 592C465.686 592 600 459.476 600 296C600 132.524 465.686 0 300 0C134.315 0 0 132.524 0 296C0 459.476 134.315 592 300 592ZM300 318C312.15 318 322 308.15 322 296C322 283.85 312.15 274 300 274C287.85 274 278 283.85 278 296C278 308.15 287.85 318 300 318Z"
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
                <i class="fas fa-pause"></i>
              </li>
              <li class="play">
                <i class="fas fa-play"></i>
              </li>
              <li class="load">
                <i class="fas fa-repeat"></i>
              </li>
            </ul>
            <audio src="${list.audio}"></audio>
          </div>
        </div>`;

      article.className = "player";
      playerSection.appendChild(article);
    };

    const importData = () => {
      dbLists.data.slice(0, 8).map((list) => {
        createList(list);
      });
    };
    importData();

    //  player rotation
    const deg = 45;
    let i = 0;

    const players = document.querySelectorAll(".player");
    const audios = playerSection.querySelectorAll("audio");
    const prev = document.querySelector(".btnPrev");
    const next = document.querySelector(".btnNext");

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

    prev.addEventListener("click", () => {
      initMusic();
      num++;
      playerSection.style.transform = ` translateX(-50%)rotate(${
        deg * num
      }deg)`;

      active === 0 ? (active = len) : active--;
      activation(active, players);
    });

    next.addEventListener("click", () => {
      initMusic();
      num--;
      playerSection.style.transform = `translateX(-50%) rotate(${
        deg * num
      }deg)`;

      active === len ? (active = 0) : active++;
      activation(active, players);
    });
  });

/*
// 이전 코드 참고용
const frame = document.querySelector("section");
const lists = frame.querySelectorAll("article");
const audios = frame.querySelectorAll("audio");
const prev = document.querySelector(".btnPrev");
const next = document.querySelector(".btnNext");

//article rotation
const deg = 45;
let i = 0;

lists.forEach((list) => {
  const pic = list.querySelector(".pic");
  const play = list.querySelector(".play");
  const pause = list.querySelector(".pause");
  const load = list.querySelector(".load");

  list.style.transform = `rotate(${i * deg}deg) translateY(-100vh)`;

  pic.style.backgroundImage = `url("./img/member${i + 1}.jpg")`;
  i++;

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

      activePic.remove("on");

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
const len = lists.length - 1;

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

prev.addEventListener("click", () => {
  initMusic();
  num++;
  frame.style.transform = `rotate(${deg * num}deg)`;

  active === 0 ? (active = len) : active--;
  activation(active, lists);
});

next.addEventListener("click", () => {
  initMusic();
  num--;
  frame.style.transform = `rotate(${deg * num}deg)`;

  active === len ? (active = 0) : active++;
  activation(active, lists);
});
*/
