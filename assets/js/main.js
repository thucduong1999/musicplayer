const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = 'MEDIAPLAYER';

const heading = $('.header h2');
const cdThumb = $('.cd-thumb img');
const audio = $('#audio');
const cd = $('.cd');
const playlist = $('.playlist');
const playBtn = $('.btn-toggle-play');
const player = $('#player');
const iconPlays = $$('.btn-toggle-play i');
const progress = $('#progress');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs: [
        {
            name: 'Có Chắc Yêu Là Đây',
            singer: 'Sơn Tùng MTP',
            path: 'assets/music/song1.mp3',
            image: 'assets/img/CCYLD.png'
        },
        {
            name: 'Thiên Đàng',
            singer: 'Wowy ft JoliPoli',
            path: 'assets/music/song2.mp3',
            image: 'assets/img/thiendang.jpg'
        },
        {
            name: 'Không Trọn Vẹn Nữa',
            singer: 'Châu Khải Phong',
            path: 'assets/music/song3.mp3',
            image: 'assets/img/ktvn.jpg'
        },
        {
            name: 'Người Lạ Thoáng Qua',
            singer: 'Đinh Tùng Huy',
            path: 'assets/music/song4.mp3',
            image: 'assets/img/nglathoangqua.jpg'
        },
        {
            name: 'Người Lạ Thoáng Qua',
            singer: 'Đinh Tùng Huy',
            path: 'assets/music/song4.mp3',
            image: 'assets/img/nglathoangqua.jpg'
        },
        {
            name: 'Người Lạ Thoáng Qua',
            singer: 'Đinh Tùng Huy',
            path: 'assets/music/song4.mp3',
            image: 'assets/img/nglathoangqua.jpg'
        },
        {
            name: 'Người Lạ Thoáng Qua',
            singer: 'Đinh Tùng Huy',
            path: 'assets/music/song4.mp3',
            image: 'assets/img/nglathoangqua.jpg'
        },
        {
            name: 'Người Lạ Thoáng Qua',
            singer: 'Đinh Tùng Huy',
            path: 'assets/music/song4.mp3',
            image: 'assets/img/nglathoangqua.jpg'
        },
        {
            name: 'Không Trọn Vẹn Nữa',
            singer: 'Châu Khải Phong',
            path: 'assets/music/song3.mp3',
            image: 'assets/img/ktvn.jpg'
        }
    ],

    setConfig: function(key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    },

    render: function () {
        const htmls = this.songs.map((song, index) => {
            return `
                <div class="song ${index === this.currentIndex ? 'active-song' : ''}" data-index=${index}>
                    <div class="thumb">
                        <img src="${song.image}" alt="">
                    </div>
                    <div class="body">
                        <div class="title">${song.name}</div>
                        <div class="author">${song.singer}</div>
                    </div>
                    <div class="option">
                        <i class="fa-solid fa-ellipsis"></i>
                    </div>
                </div>
            `
        })
        playlist.innerHTML = htmls.join('');
    },

    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex];
            }
        })
    },

    handleEvent: function() {
        const _this = this;
        const cdWidth = cd.offsetWidth;

        const playlist = $('.playlist');
        const mtPlaylist = playlist.offsetTop;

        // Xử lý CD quay
        const cdThumbAnimate = cdThumb.animate([
            { transform: 'rotate(360deg)'}
        ], {
            duration: 10000, //10sec
            iterations: Infinity
        })

        cdThumbAnimate.pause();

        // xử lý phóng to thu nhỏ CD
        document.onscroll = function() {
            const scrollTop = window.scrollY;
            const newCdWidth = cdWidth - scrollTop;

            console.log(newCdWidth)
            
            const newMtPlaylist = mtPlaylist + scrollTop/3.2;

            playlist.style.marginTop = newMtPlaylist + 'px';

            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
            cd.style.opacity = newCdWidth / cdWidth;
        }

        // khi được play
        audio.onplay = function() {
            _this.isPlaying = true;
            player.classList.add('playing');
            cdThumbAnimate.play();
        }

        //Khi bị pause
        audio.onpause = function() {
            _this.isPlaying = false;
            player.classList.remove('playing');
            cdThumbAnimate.pause();
        }

        // Xử lý khi click play 
        playBtn.onclick = function() {
            if (_this.isPlaying) {
                audio.pause();

            } else {
                audio.play();
            }
        }

        // Tiến độ bài hát thay đổi 
        audio.ontimeupdate = function() {
            if(audio.duration) {
                const progressPer = Math.floor(audio.currentTime / audio.duration * 100);
                progress.value = progressPer;
            }
        }

        // Xử lý khi tua 
        progress.onchange = function(e) {
            const seekTime = e.target.value * audio.duration / 100;
            audio.currentTime = seekTime;
        }

        // khi next bài hát
        nextBtn.onclick = function() {
            if(_this.isRandom) {
                _this.playRandomSong();
            } else {
                _this.nextSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        }

        // Khi prev bài hát
        prevBtn.onclick = function() {
            if(_this.isRandom) {
                _this.playRandomSong();
            } else {
                _this.prevSong();
            }
            console.log(audio.volume());
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        }

        // Khi random bài hát
        randomBtn.onclick = function(e) {
            _this.isRandom = !_this.isRandom;
            _this.setConfig('isRandom', _this.isRandom);
            randomBtn.classList.toggle('active', _this.isRandom);
        }

        //Xử lý phát lại 1 bài hát
        repeatBtn.onclick = function() {
            _this.isRepeat = !_this.isRepeat;
            _this.setConfig('isRepeat', _this.isRepeat);
            repeatBtn.classList.toggle('active', _this.isRepeat);
        }

        // Xử lý khi audio end
        audio.onended = function() {
            if(_this.isRepeat) {
                audio.play();
            } else {
                if(_this.isRandom) {
                    _this.playRandomSong();
                } else {
                    _this.prevSong();
                }
                audio.play();
            }
        }

        // Click vào playlist
        playlist.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.active-song)');
            if(songNode || e.target.closest('.option')) {
                // Xử lý khi click vào bài hát
                if(songNode) {
                    _this.currentIndex = Number(songNode.dataset.index);
                    _this.loadCurrentSong();
                    _this.render();
                    audio.play();

                }

                // Xử lý khi click vào option
            }
        }

        iconPlays.forEach((iconPlay) => {
            iconPlay.onclick = function() {
                $('.fa-solid.icon').classList.remove('icon');

                this.classList.add('icon');
            }
        })
    },

    scrollToActiveSong: function() {
        if(this.currentIndex === 0) {
            setTimeout(()=> {
                $('.song.active-song').scrollIntoView({
                    behavior: 'smooth',
                    block: 'end',
                });
            }, 300)
        } 
        else if (this.currentIndex === this.songs.length - 1) {
            setTimeout(()=> {
                $('.song.active-song').scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                });
            }, 300)
        } 
        else {
            setTimeout(()=> {
                $('.song.active-song').scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                });
            }, 300)
        }
    },

    loadCurrentSong: function() {
        heading.textContent = this.currentSong.name;
        cdThumb.src = this.currentSong.image;
        audio.src = this.currentSong.path;
    },

    loadConfig: function() {
        this.isRandom = this.config.isRandom;
        this.isRepeat = this.config.isRepeat;
    },

    nextSong: function() {
        this.currentIndex++;
        if(this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong()
    },

    prevSong: function() {
        this.currentIndex--;
        if(this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong()
    },

    playRandomSong: function() {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        } while (newIndex === this.currentIndex)
        
        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },

    start: function () {

        // Gán cấu hình từ config
        // this.loadConfig();

        // Định nghĩa các thuộc tính cho object
        this.defineProperties();

        // Lắng nghe và xử lý các sự kiện (DOM Events)
        this.handleEvent();

        // Tải bài hát đầu tiên vào UI
        this.loadCurrentSong();

        // Render Playlist
        this.render();

        this.callApiPlayList();
        
        // Hiển thị trạng thái ban đầu của repeat và random
        // randomBtn.classList.toggle('active', this.isRandom);
        // repeatBtn.classList.toggle('active', this.isRepeat);
    },

    callApiPlayList: function() {
        // var xhr = new XMLHttpRequest();
        // var url = "https://zingmp3.vn/api/v2/page/get/playlist?id=ZWZB969E&ctime=1650721198&version=1.6.21&sig=d72e08d6ad429df224987bbcda23e8b12823b7b75767d22b2b6d5cbe52830b52a57367a0d3d5ebb6d96658661f99fbcf426b9d71317f159bcbe0224c1dce4f23&apiKey=88265e23d4284f25963e6eedac8fbfa3";
        // xhr.open('GET', url, true);
        // xhr.setRequestHeader("Access-Control-Allow-Origin", "https://zingmp3.vn");
        // xhr.responseType = "json";
        // xhr.send(null);
        // console.log(xhr.response);
        fetch('https://zingmp3.vn/api/v2/page/get/playlist?id=ZWZB969E&ctime=1650721198&version=1.6.21&sig=d72e08d6ad429df224987bbcda23e8b12823b7b75767d22b2b6d5cbe52830b52a57367a0d3d5ebb6d96658661f99fbcf426b9d71317f159bcbe0224c1dce4f23&apiKey=88265e23d4284f25963e6eedac8fbfa3', {
            method: 'GET',
            headers: { 'Access-Control-Allow-Origin': 'https://zingmp3.vn'}
        })
            .then(response => response.json())
            .then(function(musics) {
                console.log(musics);
            })
    }
}


app.start();
