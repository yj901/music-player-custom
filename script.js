const db = "./db.json";
const playerSection = document.querySelector(".player-section");
// const players = playerSection.querySelector("article");

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
          <div class="pic" style="background-image: url('${list.albumCover}')">
            <div class="dot"></div>
          </div>
          <div class="txt">
            <h2>${list.title}</h2>
            <p>
              ${list.singer}
            </p>
            <ul>
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
      const pic = player.querySelector(".pic");
      const play = player.querySelector(".play");
      const pause = player.querySelector(".pause");
      const load = player.querySelector(".load");

      player.style.transform = `rotate(${i * deg}deg) translateY(-150%)`;
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
