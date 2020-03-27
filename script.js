var app = new Vue({
  el: "#app",
  data: {
    words: [],
    selectedIndex: 0,
    wordInput: null,
    score: 0,
    scoreAddtion: 0,
    newRecord: false,
    highScore: localStorage.getItem("highScore") | 0,
    countdown: null,
    interval: null,
    playing: true
  },
  async created() {
    this.words = await this.getWords();
    this.countdown = this.selectedWord.length;
  },
  methods: {
    async getWords() {
      const res = await fetch(
        "https://saconway.github.io/word-beater/words.json"
      );
      const json = await res.json();
      return json.words;
    },
    checkMatch() {
      this.newRecord = false;

      if (this.wordInput === this.selectedWord) {
        this.setNewWord();
      }
    },
    setNewWord() {
      clearInterval(this.interval);

      this.scoreAddtion = this.selectedWord.length;
      this.score += this.selectedWord.length;
      this.selectedIndex++;
      this.wordInput = "";
      this.countdown = this.selectedWord.length;
      this.$refs.progressForeground.style.transitionDuration = "0s";
      this.$refs.progressForeground.style.strokeDashoffset = this.$refs.progressForeground.style.strokeDasharray;

      setTimeout(() => (this.scoreAddtion = 0), 1000);

      setTimeout(() => {
        this.$refs.progressForeground.style.transitionDuration = `${this.countdown}s`;
        this.$refs.progressForeground.style.strokeDashoffset = "0";

        this.interval = setInterval(() => this.updateCountdown(), 1000);
      }, 100);
    },
    updateCountdown() {
      if (--this.countdown <= 0) {
        this.gameOver();
      }
    },
    gameOver() {
      clearInterval(this.interval);

      this.newRecord = this.score > this.highScore;

      if (this.newRecord) {
        this.highScore = this.score;
        localStorage.setItem("highScore", this.score);
      } else {
        this.playing = false;
        setTimeout(() => (this.playing = true), 1);
      }

      this.score = 0;
      this.selectedIndex = 0;
      this.wordInput = "";
      this.countdown = this.selectedWord.length;
      this.$refs.progressForeground.style.transitionDuration = "0s";
      this.$refs.progressForeground.style.strokeDashoffset = this.$refs.progressForeground.style.strokeDasharray;
      this.$refs.wordInput.focus();
    }
  },
  computed: {
    selectedWord() {
      return this.words[this.selectedIndex];
    }
  }
});
