import { _decorator, find,  Label, Prefab, Node, instantiate, sys, v3 } from 'cc';
import { GameStart } from './GameStart';
import { GameBase } from "./utils/GameBase";
import { GameState } from './utils/GameManager';
const { ccclass, property } = _decorator;

@ccclass('GameSettle')
export class GameSettle extends GameBase {
    @property(Prefab)
    mainPanel: Prefab = null;

    goldValue: number[] = [500, 500, 500, 500, 500];
    moneyValue: number[] = [50, 100, 150, 200, 250];

    start() {
        this.updateSettleView();
    }

    updateSettleView(){
        let gameState = this.manager.getGameState();
        let fightType = this.manager.getFightType();
        let gold = this.goldValue[fightType];
        let money = this.moneyValue[fightType];
        let goldLab = this.node.getChildByName("gold").getChildByName("num").getComponent(Label);
        let moneyLab = this.node.getChildByName("prop").getChildByName("num").getComponent(Label);
        goldLab.string = gold.toString();
        moneyLab.string = money.toString();
        //
        this.node.getChildByName("gold").active = gameState == GameState.GAME_WIN ? true : false;
        this.node.getChildByName("prop").active = gameState == GameState.GAME_WIN ? true : false;
        this.node.getChildByName("victory").active = gameState == GameState.GAME_WIN ? true : false;
        this.node.getChildByName("defeat").active = gameState == GameState.GAME_LOSE ? true : false;
        //
        let role_type = this.manager.getRoleType();
        for(let i = 0; i < 3; i++){
            let cur_role = this.node.getChildByName("role_view").getChildByName("role" + i);
            cur_role.active = false;
            if(role_type == i){
                cur_role.active = true;
            }
        }

        this.saveGameData();
    }

    onBackBtn(){
        let fightNode = find("Canvas/panel/fight");
        if(fightNode){
            fightNode.destroy();
        }
        this.node.destroy();
        this.soundMrg.playEffect("click");
        this.soundMrg.playMusic("bg", true);
        //
        this.manager.ResetGameData();
        let panel: Node = find("Canvas/panel");
        panel.addChild(instantiate(this.mainPanel));
        
        this.manager.setGameState(GameState.GAME_MAIN);
    }

    onRestartBtn(){
        this.node.destroy();
        this.soundMrg.playEffect("click");
        
        this.eventCenter.dispatchEvent("RestartGame",null);
        this.manager.setGameState(GameState.GAME_FIGHT);
    }

    onNextBtn(){
        this.node.destroy();
        this.soundMrg.playEffect("click");
        // 
        let curLv = this.manager.getFightType();
        if(curLv < 7){
            this.manager.setFightType(curLv + 1);
        }
        this.eventCenter.dispatchEvent("RestartGame",null);
        this.manager.setGameState(GameState.GAME_FIGHT);
    }

    saveGameData(){
        let state = this.manager.getGameState();
        let fightType = this.manager.getFightType();
        let gold = this.goldValue[fightType];
        let money = this.moneyValue[fightType];
        if(state == GameState.GAME_LOSE){
            return;
        }
        let gameGold = this.manager.getGameGold();
        let gameMoney = this.manager.getGameMoney();
        let num = gameGold + gold;
        let new_money = gameMoney + money;
        this.manager.addGameGold(gold);
        this.manager.setGameMoney(new_money)
        sys.localStorage.setItem("GameGold0920", num.toString());
        sys.localStorage.setItem("GameMoney0920", new_money.toString());
    }
}


