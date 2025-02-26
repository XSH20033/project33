import { _decorator,Node, UITransform, Label, sys, Prefab, instantiate, labelAssembler, find, v3} from 'cc';
import { GameBase } from "./utils/GameBase";
import { GameState } from './utils/GameManager';
const { ccclass, property } = _decorator;

@ccclass('GameShop')
export class GameShop extends GameBase {

    roleData: number[] = [1, 1, 0];
    prizeType: number[] = [1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0];
    prize_tip_type: number[] = [2, 4, 3, 4, 3, 2, 3, 4, 3, 4, 1, 4, 3, 4, 3, 2, 1];
    prizeValue: number[] = [1000, 100, 500, 100, 500, 1000, 500, 100, 500, 100, 5000, 100, 500, 100, 500, 1000, 5000];
    shopValue: number = 1000;

    content_width: number = 1188;
    bFire: boolean = false;
    card_pos_arr: number[] = [-210, -140, -70, 0, 70, 140, 210, 280, 350, 420, 490, 560, 630, 700, 770, 840, 910];

    moveDis: number = 0;
    moveSpeed: number = 5;
    bAddSpeed: boolean = true;
    randomIndex: number = 0;

    start() {
        this.roleData = this.manager.getRoleData();
        this.updateShopView();
    }

    updateShopView(){
        let bHave = this.roleData[2];
        let cur_item = this.node.getChildByName("bg").getChildByName("box").getChildByName("shop_view").getChildByName("item0");
        let type0 = cur_item.getChildByName("type0");
        let type1 = cur_item.getChildByName("type1");
        type0.active = false;
        type1.active = false;
        if(bHave == 0){
            type0.active = true;
        }else{
            type1.active = true;
        }
        //
        let gameGold = this.manager.getGameGold();
        let gameMoney = this.manager.getGameMoney();
        let gold_lab = this.node.getChildByName("bg").getChildByName("gold").getChildByName("num").getComponent(Label);
        let money_lab = this.node.getChildByName("bg").getChildByName("money").getChildByName("num").getComponent(Label);
        gold_lab.string = gameGold.toString();
        money_lab.string = gameMoney.toString();
    }

    update(deltaTime){
        if(this.bFire){
            let lastX = this.moveDis;
            this.moveDis -= this.moveSpeed;
            if(this.moveDis <= 0){
                this.bFire = false;
                this.getRewardPrize();
            }else{
                lastX = this.moveSpeed;
            }
            for(let i = 0; i < 17; i++){
                let cur_item = this.node.getChildByName("bg").getChildByName("box").getChildByName("shop_view").getChildByName("item" + i);
                let pos = cur_item.position;
                let moveX = pos.x - lastX;
                let moveY = pos.y;
                if(moveX < -500){
                    moveX += this.content_width;
                }
                cur_item.position = v3(moveX, moveY);
            }
            //
            if(this.bAddSpeed){
                if(this.moveSpeed < 20){
                    this.moveSpeed += 0.1;
                }else{
                    if(this.moveDis < 2000){
                        this.bAddSpeed = false;
                    }
                }
            }else{
                if(this.moveSpeed > 3){
                    this.moveSpeed -= 0.1;
                }
            }
        }
    }

    getRewardPrize(){
        let prize_type = this.prizeType[this.randomIndex];
        let prize_value = this.prizeValue[this.randomIndex];
        //
        let game_gold = this.manager.getGameGold();
        let game_money = this.manager.getGameMoney();
        let bHave = this.roleData[2];
        let tip_index = this.prize_tip_type[this.randomIndex];
        if(this.randomIndex == 0 && bHave == 0){
            this.roleData[2] = 1;
            this.manager.setRoleData(this.roleData);
            this.eventCenter.dispatchEvent("OnCreateTip",0);
            sys.localStorage.setItem("RoleData0920",JSON.stringify(this.roleData));
            return;
        }
        if(prize_type == 0){
            let gold = game_gold + prize_value;
            this.manager.setGameGold(gold);
            sys.localStorage.setItem("GameGold0920", gold.toString());
        }else{
            let money = game_money + prize_value;
            this.manager.setGameMoney(money);
            sys.localStorage.setItem("GameMoney0920", money.toString());
        }
        this.updateShopView();
        this.eventCenter.dispatchEvent("UpdateGoldView",null);
        this.eventCenter.dispatchEvent("OnCreateTip",tip_index);
    }

    onFireBtn(){
        this.soundMrg.playEffect("click");
        if(this.bFire){
            return;
        }
        let gold = this.manager.getGameGold();
        if(gold < this.shopValue){
            this.eventCenter.dispatchEvent("OnCreateTip",6);
            return;
        }
        //
        let gameGold = gold - this.shopValue;
        this.manager.setGameGold(gameGold);
        sys.localStorage.setItem("GameGold0920", gameGold.toString());
        //
        let i = Math.floor(Math.random() * 16);
        console.log("" + i);
        this.randomIndex = i;
        let posX = this.card_pos_arr[i];
        this.moveDis = posX + this.content_width * 6 + 34;
        this.resetCardPos();
        this.bFire = true;
        this.bAddSpeed = true;
        this.moveSpeed = 5;
        //
        this.updateShopView();
        this.eventCenter.dispatchEvent("UpdateGoldView",null);
    }

    resetCardPos(){
        let bHave = this.roleData[2];
        for(let i = 0; i < this.card_pos_arr.length; i++){
            let cur_pos = this.card_pos_arr[i];
            let cur_item = this.node.getChildByName("bg").getChildByName("box").getChildByName("shop_view").getChildByName("item" + i);
            cur_item.position = v3(cur_pos, 0);
            //
            if(i == 0){
                let type0 = cur_item.getChildByName("type0");
                let type1 = cur_item.getChildByName("type1");
                type0.active = false;
                type1.active = false;
                if(bHave == 0){
                    type0.active = true;
                }else{
                    type1.active = true;
                }
            }
        }
    }

    onBackBtn(){
        if(this.bFire){
            return;
        }
        this.node.destroy();
        this.soundMrg.playEffect("click");
        this.manager.setGameState(GameState.GAME_MAIN);
    }
}


