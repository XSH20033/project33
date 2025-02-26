import { _decorator, sys, Vec3, v3 } from 'cc';
const { ccclass, property } = _decorator;

export enum GameState{
    GAME_LOAD,
    GAME_START,
    GAME_MAIN,
    GAME_SET,
    GAME_LEVEL,
    GAME_RANK,
    GAME_ROLE,
    GAME_SHOP,
    GAME_HELP,
    GAME_FIGHT,
    GAME_WIN,
    GAME_LOSE,
    GAME_OVER,
}

@ccclass('GameManager')
export class GameManager {
    private static _instance: GameManager;// 
    /***/
    public static get Instance() {
        if (this._instance) {
            return this._instance;
        }
        this._instance = new GameManager();
        return this._instance;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // 
    gameState: GameState = GameState.GAME_LOAD;

    //  
    roleType: number = 0;

    // 
    fightType: number = 0;

    // 
    gameTime: number = 180;

    // 
    gameGold: number = 10000;
    gameMoney: number = 0;

    // 
    gameLevel: number = 0;

    // 
    gameScore: number = 0;

    getGameState(){
        return this.gameState;
    }

    setGameState(state){
        this.gameState = state;
    }

    getGameScore(){
        return this.gameScore;
    }

    setGameScore(score){
        this.gameScore = score;
    }

    addGameScore(score){
        this.gameScore += score;
    }

    getGameGold(){
        return this.gameGold;
    }

    setGameGold(gold){
        this.gameGold = gold;
    }

    addGameGold(gold){
        this.gameGold += gold;
    }

    getGameMoney(){
        return this.gameMoney;
    }

    setGameMoney(money){
        this.gameMoney = money;
    }

    addGameMoney(gold){
        this.gameMoney += gold;
    }

    getGameLevel(){
        return this.gameLevel;
    }

    setGameLevel(lv){
        this.gameLevel = lv;
    }

    getGameTime(){
        return this.gameTime;
    }

    getRoleType(){
        return this.roleType;
    }

    setRoleType(type){
        this.roleType = type;
    }

    getFightType(){
        return this.fightType;
    }

    setFightType(type){
        this.fightType = type;
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    gameFirstTime: number[] = [2023, 8, 14];
    bFirstTime: number = 0;

    getGameFirst(){
        return this.bFirstTime;
    }

    setGameFirst(time){
        this.bFirstTime = time;
    }

    getGameFirstTime(){
        return this.gameFirstTime;
    }

    setGameFirstTime(time){
        this.gameFirstTime = time;
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    roleData: number[] = [1, 1, 0];
    roleLvData: number[] = [1, 1, 1];

    getRoleData(){
        return this.roleData;
    }

    setRoleData(data){
        this.roleData = data;
    }

    getRoleLvData(){
        return this.roleLvData;
    }

    setRoleLvData(data){
        this.roleLvData = data;
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    rolePos: Vec3[] = [v3(-350, 25), v3(-350, -20), v3(-350, -65)];
    enemyPos: Vec3[] = [v3(350, 25), v3(350, -20), v3(350, -65)];
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    ResetGameData(){
        this.gameScore = 0;
    }
}

