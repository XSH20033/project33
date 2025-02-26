import { _decorator, sys, Node, find, ProgressBar, Label, Button, UITransform, v3 } from 'cc';
import { GameBase } from "./utils/GameBase";
import { GameState } from './utils/GameManager';
const { ccclass, property } = _decorator;

@ccclass('GameLoad')
export class GameLoad extends GameBase {
    loadLab: Label = null;
    loadDt: number = 0.01;
    loadNum: number = 0;

    start () {
        this.manager.setGameState(GameState.GAME_LOAD);
        // 
        let gameGoldValue = sys.localStorage.getItem("GameGold0920");
        if(gameGoldValue){
            let gameGold = Number(gameGoldValue);
            this.manager.setGameGold(gameGold);
        }
        let gameMoneyValue = sys.localStorage.getItem("GameMoney0920");
        if(gameMoneyValue){
            let gameMoney = Number(gameMoneyValue);
            this.manager.setGameMoney(gameMoney);
        }
        let timeJson = sys.localStorage.getItem("FirstTime0920");
        if(timeJson){
            let timeData = JSON.parse(timeJson);
            if(timeData){
                this.manager.setGameFirstTime(timeData);
            }
        }else{
            let date = new Date();
            let year = date.getFullYear();
            let month = date.getMonth();
            let day = date.getDate();
            let time: number[] = [year, month, day];
            this.manager.setGameFirstTime(time);
            sys.localStorage.setItem("FirstTime0920",JSON.stringify(time));
        }
        // 
        let roleJson = sys.localStorage.getItem("RoleData0920");
        if(roleJson){
            let roleData = JSON.parse(roleJson);
            if(roleData){
                this.manager.setRoleData(roleData);
            }
        }
        // 
        let roleLvJson = sys.localStorage.getItem("RoleLvData0920");
        if(roleLvJson){
            let roleLvData = JSON.parse(roleLvJson);
            if(roleLvData){
                this.manager.setRoleLvData(roleLvData);
            }
        }
        // 
        let gameLevelValue = sys.localStorage.getItem("GameLevel0920");
        if(gameLevelValue){
            let gameLevel = Number(gameLevelValue);
            this.manager.setGameLevel(gameLevel);
        }
        // 
        this.soundMrg.init();
        this.soundMrg.loadSounds();

        // (init music)
        let volumeStr = sys.localStorage.getItem("SoundVolume0920");
        let bOpen = sys.localStorage.getItem("SoundMute0920");
        if(bOpen){
            if(bOpen == "0"){
                this.soundMrg.setSoundMute(true);
                let volume = volumeStr ? Number(volumeStr) : 1;
                this.soundMrg.setSoundVolume(volume);
            }else{
                this.soundMrg.setSoundMute(false);
                let volume = volumeStr ? Number(volumeStr) : 0;
                this.soundMrg.setSoundVolume(volume);
            }
        }else{
            this.soundMrg.setSoundMute(true);
            this.soundMrg.setSoundVolume(1);
        }

        this.loadLab = this.node.getChildByName("load").getComponent(Label);
        this.loadLab.string = this.loadNum.toString();
    }

    update(deltaTime: number) {
        if(this.manager.getGameState() == GameState.GAME_LOAD && this.loadNum >= 100){
            this.lodaingFinish();
            return;
        }

        this.loadDt -= deltaTime;
        if(this.loadDt <= 0){
            this.loadDt = 0.04;
            this.loadNum += 2;
            // update
            this.loadLab.string = this.loadNum.toString();
        }
    }

    lodaingFinish() {
        // 
        let start: Node = find("Canvas/start");
        start.active = true;

        this.node.active = false;
        this.manager.setGameState(GameState.GAME_START);
        //
        let bOpen = sys.localStorage.getItem("SoundMute0920");
        if(bOpen){
            let mute = bOpen == "0" ? true : false;
            this.soundMrg.setSoundMute(mute);
            let volumeStr = sys.localStorage.getItem("SoundVolume0920");
            if(volumeStr){
                let volume = volumeStr ? Number(volumeStr) : 1;
                this.soundMrg.setSoundVolume(volume);
            }
        }
    }
}

