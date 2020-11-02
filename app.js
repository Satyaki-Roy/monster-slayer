function getRandomValue(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

const app = Vue.createApp({
  data() {
    return {
      playerHealth: 100,
      monsterHealth: 100,
      currentRound: 0,
      winner: null,
      logger: [],
    };
  },
  watch: {
    playerHealth(newValue) {
      if (newValue <= 0 && this.monsterHealth <= 0) {
        this.winner = "draw";
      } else if (newValue <= 0) {
        this.winner = "monster";
      }
    },
    monsterHealth(newValue) {
      if (newValue <= 0 && this.playerHealth <= 0) {
        this.winner = "draw";
      } else if (newValue <= 0) {
        this.winner = "player";
      }
    },
  },
  computed: {
    monsterBarStyle() {
      return {
        width: this.monsterHealth < 0 ? `0%` : `${this.monsterHealth}%`,
      };
    },
    playerBarStyle() {
      return { width: this.playerHealth < 0 ? `0%` : `${this.playerHealth}%` };
    },
    enableSpecialAttackButton() {
      if (this.currentRound === 0) {
        return true;
      }
      return this.currentRound % 3 !== 0;
    },
  },
  methods: {
    startGame() {
      this.playerHealth = 100;
      this.monsterHealth = 100;
      this.currentRound = 0;
      this.winner = null;
    },
    attackMonster() {
      this.currentRound++;
      const damageValue = getRandomValue(5, 12);
      this.monsterHealth -= damageValue;
      this.logging("Player", "attacked", damageValue);
      this.attackPlayer();
    },
    attackPlayer() {
      const damageValue = getRandomValue(8, 12);
      this.playerHealth -= damageValue;
      this.logging("Monster", "attacked", damageValue);
    },
    specialAttackMonster() {
      this.currentRound++;
      const damageValue = getRandomValue(12, 25);
      this.monsterHealth -= damageValue;
      this.logging("Player", "special attacked", damageValue);
      this.attackPlayer();
    },
    healPlayer() {
      this.currentRound++;
      const healingValue = getRandomValue(10, 25);
      if (this.playerHealth + healingValue > 100) {
        this.playerHealth = 100;
      } else {
        this.playerHealth += healingValue;
      }
      this.logging("Player", "healing", healingValue);
      this.attackPlayer();
    },
    surrender() {
      this.winner = "monster";
    },
    logging(who, what, value) {
      this.logger.unshift(`${who} ${what}: ${value}`);
    },
  },
});

app.mount("#game");
