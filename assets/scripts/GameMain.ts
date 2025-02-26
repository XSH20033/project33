import { _decorator, Animation, Node, Prefab, find, instantiate, sys, Label, ProgressBar, Vec3, v3, tween, ScrollView, v2, ValueType } from 'cc';
import { GameBase } from "./utils/GameBase";
import { GameState } from './utils/GameManager';
const { ccclass, property } = _decorator;

@ccclass('GameMain')
export class GameMain extends GameBase {
    /***/
    @property(Prefab)
    levelPanel: Prefab = null;
    /***/
    @property(Prefab)
    shopPanel: Prefab = null;
    /***/
    @property(Prefab)
    setPanel: Prefab = null;
    /***/
    @property(Prefab)
    rolePanel: Prefab = null;
    
    start () {
        // (init event)
        this.eventCenter.AddListener("UpdateRoleView",this.updateRoleView,this);
        this.eventCenter.AddListener("UpdateGoldView",this.updateGoldView,this);
        this.updateMainView();
        this.updateRoleView();
        this.updateGoldView();
    }

    updateMainView(){
        
    }

    updateRoleView(){
        let role_type = this.manager.getRoleType();
        let roleLvData = this.manager.getRoleLvData();
        let role_lv = roleLvData[role_type];
        for(let i = 0; i < 3; i++){
            let cur_role = this.node.getChildByName("role_view").getChildByName("role" + i);
            cur_role.active = false;
            if(role_type == i){
                cur_role.active = true;
            }
        }
        //
        let lv_lab = this.node.getChildByName("lv").getChildByName("num").getComponent(Label);
        lv_lab.string = role_lv.toString();
    }

    updateGoldView(){
        let gameGold = this.manager.getGameGold();
        let gameMoney = this.manager.getGameMoney();
        let gold_lab = this.node.getChildByName("gold").getChildByName("num").getComponent(Label);
        let money_lab = this.node.getChildByName("money").getChildByName("num").getComponent(Label);
        gold_lab.string = gameGold.toString();
        money_lab.string = gameMoney.toString();
    }

    onDestroy(){
        // (remove event)
        this.eventCenter.RemoveListener("UpdateRoleView",this.updateRoleView,this);
        this.eventCenter.RemoveListener("UpdateGoldView",this.updateGoldView,this);
    }

    onRoleBtn() {
        // 
        this.soundMrg.playEffect("click");
        // 
        let panel: Node = find("Canvas/panel");
        panel.addChild(instantiate(this.rolePanel));
        // 
        this.manager.setGameState(GameState.GAME_ROLE);
    }

    onSetBtn() {
        // 
        this.soundMrg.playEffect("click");
        //
        let panel: Node = find("Canvas/panel");
        panel.addChild(instantiate(this.setPanel));
        // 
        this.manager.setGameState(GameState.GAME_SET);
    }

    onBackBtn(){
        // 
        this.node.destroy();
        // 
        this.soundMrg.playEffect("click");
        // 
        let startNode: Node = find("Canvas/start");
        startNode.active = true;
        // 
        this.manager.setGameState(GameState.GAME_START);
    }

    onShopBtn(){
        // 
        this.soundMrg.playEffect("click");
        // 
        let panel: Node = find("Canvas/panel");
        panel.addChild(instantiate(this.shopPanel));
        // 
        this.manager.setGameState(GameState.GAME_SHOP);
    }

    onLevelBtn() {
        // 
        this.node.destroy();
        // 
        this.soundMrg.playEffect("click");
        // 
        let panel: Node = find("Canvas/panel");
        panel.addChild(instantiate(this.levelPanel));
        // 
        this.manager.setGameState(GameState.GAME_LEVEL);
    }
}


