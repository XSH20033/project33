import { _decorator, Prefab, find, instantiate, Node, Animation, v3, sys, Vec3, game, Label} from 'cc';
import { GameBase } from "./utils/GameBase";
import { GameState } from './utils/GameManager';
const { ccclass, property } = _decorator;

@ccclass('GamePlayer')
export class GamePlayer extends GameBase {

    roleData: number[] = [1, 0, 0];
    roleLvData: number[] = [1, 1, 1];

    selectIndex: number = 0;
    buyValue: number[] = [500, 500, 500];
    forceNum: number = 180;
    atkValue: number[] = [1, 2, 3];
    hpValue: number[] = [10, 40, 70];
    addAtk: number = 1;
    addHp: number = 10;

    upValue: number = 100;

    start() {
        // 
        this.roleData = this.manager.getRoleData();
        this.roleLvData = this.manager.getRoleLvData();
        this.selectIndex = this.manager.getRoleType();

        this.updateRoleView();
        this.updateSeleceView();
    }

    updateRoleView(){
        for(let i = 0; i < this.roleData.length; i++){
            let value = this.roleData[i];
            let curRole = this.node.getChildByName("role_view").getChildByName("role" + i);
            let curInfo = this.node.getChildByName("box").getChildByName("info_view").getChildByName("role" + i);
            curRole.active = false;
            curInfo.active = false;
            if(this.selectIndex == i){
                curRole.active = true;
                curInfo.active = true;
            }
        }
        //
        let atkLab0 = this.node.getChildByName("box").getChildByName("atkLab0").getComponent(Label);
        let hpLab0 = this.node.getChildByName("box").getChildByName("hpLab0").getComponent(Label);
        let atkLab1 = this.node.getChildByName("box").getChildByName("atkLab1").getComponent(Label);
        let hpLab1 = this.node.getChildByName("box").getChildByName("hpLab1").getComponent(Label);
        //
        let roleLv = this.roleLvData[this.selectIndex];
        let roleNextLv = roleLv + 1;
        let atk0 = this.atkValue[this.selectIndex] + roleLv * this.addAtk;
        let hp0 = this.hpValue[this.selectIndex] + roleLv * this.addHp;
        let atk1 = this.atkValue[this.selectIndex] + roleNextLv * this.addAtk;
        let hp1 = this.hpValue[this.selectIndex] + roleNextLv * this.addHp;
        //
        atkLab0.string = atk0.toString();
        hpLab0.string = hp0.toString();
        atkLab1.string = atk1.toString();
        hpLab1.string = hp1.toString();
        //
        let prize_lab = this.node.getChildByName("box").getChildByName("prize").getChildByName("num").getComponent(Label);
        let value = this.upValue * roleLv;
        prize_lab.string = value.toString();
        //
        let lv_lab = this.node.getChildByName("lv").getChildByName("num").getComponent(Label);
        lv_lab.string = roleLv.toString();
    }

    updateSeleceView(){
        let roleType = this.manager.getRoleType();
        let selectBtn = this.node.getChildByName("select_btn");
        let selected = this.node.getChildByName("selected");
        selectBtn.active = false;
        selected.active = false;
        if(this.roleData[this.selectIndex] == 1){
            if(this.selectIndex == roleType){
                selected.active = true;
            }else{
                selectBtn.active = true;
            }
        }
    }

    onBackBtn(){
        this.node.destroy();
        this.soundMrg.playEffect("click");
        
        this.manager.setGameState(GameState.GAME_MAIN);
    }

    onLeftBtn(){
        // 
        this.soundMrg.playEffect("click");
        //
        this.selectIndex--;
        if(this.selectIndex < 0){
            this.selectIndex = 2;
        }
        //
        this.updateRoleView();
        this.updateSeleceView();
    }

    onRightBtn(){
        // 
        this.soundMrg.playEffect("click");
        //
        this.selectIndex++;
        if(this.selectIndex > 2){
            this.selectIndex = 0;
        }
        //
        this.updateRoleView();
        this.updateSeleceView();
    }

    onFightBtn(){
        // 
        this.soundMrg.playEffect("click");
        //
        if(this.roleData[this.selectIndex] != 1){
            return;
        }
        let roleType = this.manager.getRoleType();
        if(this.selectIndex == roleType){
            return;
        }
        this.manager.setRoleType(this.selectIndex);
        //
        this.updateSeleceView();
        this.eventCenter.dispatchEvent("UpdateRoleView", null);
        //
        this.eventCenter.dispatchEvent("OnCreateTip",8);
    }

    onUpBtn(){
        let index = Number(this.selectIndex);
        let roleLv = this.roleLvData[index];
        let value = roleLv * this.upValue;
        let game_money = this.manager.getGameMoney();
        if(game_money < value){
            this.eventCenter.dispatchEvent("OnCreateTip",5);
            return;
        }
        //
        let gameMoney = game_money - value;
        this.manager.setGameMoney(gameMoney);
        sys.localStorage.setItem("GameMoney0920", gameMoney.toString());
        //
        this.roleLvData[index] += 1;
        this.manager.setRoleLvData(this.roleLvData);
        sys.localStorage.setItem("RoleLvData0920",JSON.stringify(this.roleLvData));
        //
        this.updateRoleView();
        this.updateSeleceView();
        this.eventCenter.dispatchEvent("UpdateGoldView",null);
        this.eventCenter.dispatchEvent("UpdateRoleView",null);
        this.eventCenter.dispatchEvent("OnCreateTip",7);
    }
}


