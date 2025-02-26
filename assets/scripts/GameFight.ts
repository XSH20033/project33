import { _decorator, UITransform, Node, find, instantiate, sys, Animation, v3, Collider2D, PhysicsSystem2D, Contact2DType, Vec3, EPhysics2DDrawFlags, Prefab, CameraComponent, tween, Label, IPhysics2DContact, Color, RigidBody2D, Vec2, PolygonCollider2D, BoxCollider2D, ProgressBar, Slider, math, View, Size, director, Director, CircleCollider2D, RigidBody, v2, Button, EventHandler, LabelComponent, game, animation, random, Sprite } from 'cc';
import { GameBase } from "./utils/GameBase";
import { GameState } from './utils/GameManager';
const { ccclass, property } = _decorator;

@ccclass('GameFight')
export class GameFight extends GameBase {
    /***/
    @property(Prefab)
    mainPanel: Prefab = null;
    /***/
    @property(Prefab)
    settlePanel: Prefab = null;
    /***/
    @property(Prefab)
    helpPanel: Prefab = null;

    @property(Prefab)
    rolePre0: Prefab = null;
    @property(Prefab)
    rolePre1: Prefab = null;
    @property(Prefab)
    rolePre2: Prefab = null;
    @property(Prefab)
    enemyPre0: Prefab = null;
    @property(Prefab)
    enemyPre1: Prefab = null;
    @property(Prefab)
    enemyPre2: Prefab = null;

    @property(Prefab)
    bulletPre0: Prefab = null;
    @property(Prefab)
    bulletPre1: Prefab = null;
    @property(Prefab)
    bulletPre2: Prefab = null;
    @property(Prefab)
    bulletPre3: Prefab = null;
    @property(Prefab)
    bulletPre4: Prefab = null;
    @property(Prefab)
    bulletPre5: Prefab = null;

    @property(Prefab)
    roleResume: Prefab = null;
    @property(Prefab)
    homeResume: Prefab = null;
    @property(Prefab)
    shieldPre: Prefab = null;
    @property(Prefab)
    homeHurt: Prefab = null;
    @property(Prefab)
    bossHurt: Prefab = null;
    @property(Prefab)
    roleAtk0: Prefab = null;
    @property(Prefab)
    roleAtk1: Prefab = null;

    camera: CameraComponent = null;

    effectPanel: Node = null;
    enemyPanel: Node = null;
    rolePanel: Node = null;
    fightType: number = 0;
    //
    fight_gold: number = 0;
    card_pos: Vec3[] = [v3(-210, 0), v3(-70, 0), v3(70, 0), v3(210, 0)];
    fight_gold_arr: number[] = [100, 100, 100, 100, 100, 100, 100, 100, 100, 100]
    card_prize: number[] = [1, 3, 5, 1, 3, 5, 1, 3, 5, 1, 3, 5];
    refresh_prize: number = 2;
    //
    bossLifeArr: number[] = [100, 200, 300, 400, 500]
    curHomeLife: number = 0;
    maxHomeLife: number = 0;
    curBossLife: number = 0;
    maxBossLife: number = 0;
    homeLife: ProgressBar = null;
    bossLife: ProgressBar = null;

    wave_lv: number = 0;
    enemy_life: number = 10;
    //
    home_resume: number = 0;
    role_resume: number = 0;
    skill_role_atk: number = 0;
    skill_boss_atk: number = 0;
    skill_shield_time: number = 0;

    start() {
        // 
        this.camera = find("Canvas/Camera").getComponent(CameraComponent);
        this.effectPanel = this.node.getChildByName("effect");
        this.enemyPanel = this.node.getChildByName("enemy");
        this.rolePanel = this.node.getChildByName("role");
        this.homeLife = this.node.getChildByName("home").getChildByName("homeLife").getComponent(ProgressBar);
        this.bossLife = this.node.getChildByName("boss").getChildByName("bossLife").getComponent(ProgressBar);
        // (init event)
        this.eventCenter.AddListener("AddFightGold",this.addFightGold,this);
        this.eventCenter.AddListener("OnCreateEnemyAtk",this.onCreateEnemyAtk,this);
        this.eventCenter.AddListener("OnCreateRoleAtk",this.onCreateRoleAtk,this);
        this.eventCenter.AddListener("UpdateGameWin",this.updateGameWin,this);
        this.eventCenter.AddListener("UpdateGameLose",this.updateGameLose,this);
        this.eventCenter.AddListener("RestartGame",this.restartGame,this);
        // 
        PhysicsSystem2D.instance.enable = true;
        // PhysicsSystem2D.instance.debugDrawFlags = EPhysics2DDrawFlags.Aabb |
        // EPhysics2DDrawFlags.Pair |
        // EPhysics2DDrawFlags.CenterOfMass |
        // EPhysics2DDrawFlags.Joint |
        // EPhysics2DDrawFlags.Shape;
        // 
        PhysicsSystem2D.instance.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        this.initGameStart();
    }

    update(deltaTime: number) {
        if(this.manager.getGameState() != GameState.GAME_FIGHT){
            return;
        }

        this.onCheckGameState();
    }

    onDestroy(){
        // 
        this.eventCenter.RemoveListener("AddFightGold",this.addFightGold,this);
        this.eventCenter.RemoveListener("OnCreateEnemyAtk",this.onCreateEnemyAtk,this);
        this.eventCenter.RemoveListener("OnCreateRoleAtk",this.onCreateRoleAtk,this);
        this.eventCenter.RemoveListener("UpdateGameWin",this.updateGameWin,this);
        this.eventCenter.RemoveListener("UpdateGameLose",this.updateGameLose,this);
        this.eventCenter.RemoveListener("RestartGame",this.restartGame,this);
    }

    initGameStart(){
        this.fightType = this.manager.getFightType();
        this.fight_gold = this.fight_gold_arr[this.fightType];
        //
        if(this.rolePanel.children.length > 0){
            this.rolePanel.removeAllChildren();
        }
        if(this.enemyPanel.children.length > 0){
            this.enemyPanel.removeAllChildren();
        }
        if(this.effectPanel.children.length > 0){
            this.effectPanel.removeAllChildren();
        }

        //
        this.initGameData();
        this.initBg();
        this.initEnemy();
        this.updateFightView();
        this.initRadomCard();
        this.updateFightGoldView();
    }

    initBg(){
        for(let i = 0; i < 5; i++){
            let curBg = this.node.getChildByName("bg" + i);
            curBg.active = false;
            if(this.fightType == i){
                curBg.active = true;
            }
        }
    }

    initEnemy(){
        for(let i = 0; i < 3; i++){
            this.onCreateRole(i);
        }
        for(let i = 0; i < 3; i++){
            this.onCreateEnemy(i);
        }
    }

    initRadomCard(){
        this.onRandomCard();
    }

    initGameData(){
        let roleType = this.manager.getRoleType();
        let roleLvData = this.manager.getRoleLvData();
        let roleLv = roleLvData[roleType];
        //
        this.curHomeLife = 50;
        this.maxHomeLife = 50;
        this.curBossLife = this.bossLifeArr[this.fightType];
        this.maxBossLife = this.bossLifeArr[this.fightType];
        this.homeLife.progress = 1;
        this.bossLife.progress = 1;
        //
        this.wave_lv = 0;
    }

    updateFightView(){
        let wave_lab = this.node.getChildByName("wave_lv").getComponent(Label);
        wave_lab.string = (this.wave_lv + 1).toString();
    }

    updateFightGoldView(){
        let gold_lab = this.node.getChildByName("gold").getComponent(Label);
        gold_lab.string = this.fight_gold.toString();
    }

    onCheckGameState(){
        if(this.enemyPanel.children.length <= 0){
            this.wave_lv ++;
            this.updateFightView();
            for(let i = 0; i < 3; i++){
                this.onCreateEnemy(i);
            }
        }
    }
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    onRefreshBtn(){
        if(this.fight_gold < this.refresh_prize){
            return;
        }
        //
        this.fight_gold -= this.refresh_prize;
        //
        this.onRandomCard();
        this.updateFightGoldView();
    }

    onRandomCard(){
        let all_card: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
        let card_list: number[] = [];
        for(let i = 0; i < 4; i++){
            let last_card = all_card.filter(function(number) {
                return card_list.indexOf(number) == -1;
            });
            let index = Math.floor(Math.random() * (last_card.length - 1));
            let card = last_card[index];
            // 
            card_list.push(card);
        }
        //
        console.log(" card_list: " + card_list);
        for(let i = 0; i < 12; i++){
            let cur_card = this.node.getChildByName("card_list").getChildByName("card" + i);
            cur_card.active = false;
        }
        for(let i = 0; i < card_list.length; i++){
            let value = card_list[i];
            let card_pos = this.card_pos[i];
            let cur_card = this.node.getChildByName("card_list").getChildByName("card" + value);
            cur_card.active = true;
            cur_card.position = card_pos;
        }
    }

    onClickCard(event, data){
        let index = Number(data);
        let target_prize = this.card_prize[index];
        if(this.fight_gold < target_prize){
            return;
        }
        //
        this.onShowCardSkill(index);
        let target = event.target;
        target.active = false;
        //
        this.fight_gold -= target_prize;
        this.updateFightGoldView();
    }

    onShowCardSkill(card_index){
        if(card_index == 0){
            this.home_resume = 5;
            this.onCreateHomeResume();
            this.onAddHomeLife(this.home_resume);
            //
            this.role_resume = 5;
            this.onResumeRole();
            this.eventCenter.dispatchEvent("OnAddRolelife", this.role_resume);
        }else if(card_index == 1){
            this.home_resume = 10;
            this.onCreateHomeResume();
            this.onAddHomeLife(this.home_resume);
            //
            this.role_resume = 10;
            this.onResumeRole();
            this.eventCenter.dispatchEvent("OnAddRolelife", this.role_resume);
        }else if(card_index == 2){
            this.home_resume = 20;
            this.onCreateHomeResume();
            this.onAddHomeLife(this.home_resume);
            //
            this.role_resume = 20;
            this.onResumeRole();
            this.eventCenter.dispatchEvent("OnAddRolelife", this.role_resume);
        }else if(card_index == 3){
            this.skill_shield_time = 1;
            this.onCreateShield();
        }else if(card_index == 4){
            this.skill_shield_time = 3;
            this.onCreateShield();
        }else if(card_index == 5){
            this.skill_shield_time = 5;
            this.onCreateShield();
        }else if(card_index == 6){
            this.skill_role_atk = 2;
            this.onCreateRoleAtk0();
        }else if(card_index == 7){
            this.skill_role_atk = 5;
            this.onCreateRoleAtk0();
        }else if(card_index == 8){
            this.skill_role_atk = 10;
            this.onCreateRoleAtk0();
        }else if(card_index == 9){
            this.skill_boss_atk = 5;
            this.onCreateBossHurt();
            this.onHurtBossLife(this.skill_boss_atk);
        }else if(card_index == 10){
            this.skill_boss_atk = 8;
            this.onCreateBossHurt();
            this.onHurtBossLife(this.skill_boss_atk);
        }else if(card_index == 11){
            this.skill_boss_atk = 10;
            this.onCreateBossHurt();
            this.onHurtBossLife(this.skill_boss_atk);
        }
    }

    onResumeRole(){
        for(let i = 0; i < this.rolePanel.children.length; i++){
            let curRole = this.rolePanel.children[i];
            let pos = curRole.position;
            this.onCreateRoleResume(pos);
        }
    }

    addFightGold(num){
        this.fight_gold += num;
        this.updateFightGoldView();
    }
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    onCloseBtn(){
        this.node.destroy();
        this.soundMrg.playEffect("click");
        this.soundMrg.playMusic("bg", true);
        let panel: Node = find("Canvas/panel");
        panel.addChild(instantiate(this.mainPanel));
        
        this.manager.ResetGameData();
        this.manager.setGameState(GameState.GAME_MAIN);
    }

    onHelpBtn(){
        this.soundMrg.playEffect("click");
        let panel: Node = find("Canvas/panel");
        panel.addChild(instantiate(this.helpPanel));
        
        this.manager.setGameState(GameState.GAME_HELP);
    }

    updateGameLose(){
        if(this.manager.getGameState() != GameState.GAME_FIGHT){
            return;
        }
        // 
        let panel: Node = find("Canvas/panel");
        panel.addChild(instantiate(this.settlePanel));
        // 
        this.manager.setGameState(GameState.GAME_LOSE);
    }

    updateGameWin(){
        if(this.manager.getGameState() != GameState.GAME_FIGHT){
            return;
        }
        let panel: Node = find("Canvas/panel");
        panel.addChild(instantiate(this.settlePanel));
        let level = this.fightType + 1;
        if(level > this.manager.getGameLevel()){
            this.manager.setGameLevel(level);
            sys.localStorage.setItem("GameLevel0920", level.toString());
        }
        this.manager.setGameState(GameState.GAME_WIN);
    }

    restartGame(){
        console.log("");
        this.manager.ResetGameData();
        this.initGameStart();
        // 
        this.eventCenter.dispatchEvent("ResetRoleData",null);
    }

    onAddHomeLife(life){
        this.curHomeLife += life;
        if(this.curHomeLife > this.maxHomeLife){
            this.curHomeLife = this.maxHomeLife
            this.homeLife.progress = 1;
        }else{
            let lifeRate = Number((this.curHomeLife / this.maxHomeLife).toFixed(2));
            this.homeLife.progress = lifeRate;
        }
    }

    onHurtHomeLife(life){
        this.curHomeLife -= life;
        if(this.curHomeLife <= 0){
            this.curHomeLife = 0
            this.homeLife.progress = 0;
            this.updateGameLose();
        }else{
            let lifeRate = Number((this.curHomeLife / this.maxHomeLife).toFixed(2));
            this.homeLife.progress = lifeRate;
        }
    }

    onHurtBossLife(life){
        this.curBossLife -= life;
        if(this.curBossLife <= 0){
            this.curBossLife = 0
            this.bossLife.progress = 0;
            this.updateGameWin();
        }else{
            let lifeRate = Number((this.curBossLife / this.maxBossLife).toFixed(2));
            this.bossLife.progress = lifeRate;
        }
    }
    // /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D) {
        if ((otherCollider.group == 2 && selfCollider.group == 16) || (otherCollider.group == 16 && selfCollider.group == 2)) {
            //
            this.onHurtHomeLife(999999);
        }

        if ((otherCollider.group == 32 && selfCollider.group == 16) || (otherCollider.group == 16 && selfCollider.group == 32)) {
            let role_atkCol = otherCollider.group == 32 ? otherCollider : selfCollider;
            let enemyCol = otherCollider.group == 16 ? otherCollider : selfCollider;
            //
            let atk_ctl: any = role_atkCol.node.getComponent("RoleAtk");
            let atk = atk_ctl.getRoleAtk();
            //
            let enemy_ctl: any = enemyCol.node.getComponent("GameEnemy");
            enemy_ctl.onHurtEnemyLife(atk);
            role_atkCol.node.destroy();
        }

        if ((otherCollider.group == 64 && selfCollider.group == 8) || (otherCollider.group == 8 && selfCollider.group == 64)) {
            let roleCol = otherCollider.group == 8 ? otherCollider : selfCollider;
            let enemy_atkCol = otherCollider.group == 64 ? otherCollider : selfCollider;
            //
            let atk_ctl: any = enemy_atkCol.node.getComponent("EnemyAtk");
            let atk = atk_ctl.getEnemyAtk();
            //
            let role_ctl: any = roleCol.node.getComponent("GameRole");
            role_ctl.onHurtRoleLife(atk);
            enemy_atkCol.node.destroy();
        }

        if ((otherCollider.group == 128 && selfCollider.group == 16) || (otherCollider.group == 16 && selfCollider.group == 128)) {
            let skill_atkCol = otherCollider.group == 128 ? otherCollider : selfCollider;
            //
            let skill_atk = skill_atkCol.node;
            let pos = skill_atk.position;
            //
            skill_atkCol.node.destroy();
            this.onCreateRoleAtk1(v3(pos.x + 20, pos.y));
            //
            this.eventCenter.dispatchEvent("OnHurtEnemyLife", this.skill_role_atk);
        }

        if ((otherCollider.group == 256 && selfCollider.group == 64) || (otherCollider.group == 64 && selfCollider.group == 256)) {
            let enemy_atkCol = otherCollider.group == 64 ? otherCollider : selfCollider;
            enemy_atkCol.node.destroy();
        }
    }

    onCreateRole(index){
        let rolePre = this.getRolePre();
        let role_pos_arr = this.manager.rolePos;
        let role_pos = role_pos_arr[index];
        let role = instantiate(rolePre);
        role.position = role_pos;
        this.rolePanel.addChild(role);
    }

    getRolePre(){
        let role_type = this.manager.getRoleType();
        let pre = this.rolePre0;
        if(role_type == 0){
            pre = this.rolePre0;
        }else if(role_type == 1){
            pre = this.rolePre1;
        }else if(role_type == 2){
            pre = this.rolePre2;
        }
        return pre;
    }

    onCreateEnemy(index){
        let enemy_pre = this.getEnemyPre();
        let enemy_pos_arr = this.manager.enemyPos;
        let enemy_pos = enemy_pos_arr[index];
        let enemy = instantiate(enemy_pre);
        enemy.position = enemy_pos;
        this.enemyPanel.addChild(enemy);
        //
        let curLife = this.enemy_life * (this.wave_lv + 1);
        let enemy_ctl: any = enemy.getComponent("GameEnemy");
        enemy_ctl.setEnemyLife(curLife)
    }

    getEnemyPre(){
        let pre = this.enemyPre0;
        let index = this.wave_lv % 3;
        if(index == 0){
            pre = this.enemyPre0;
        }else if(index == 1){
            pre = this.enemyPre1;
        }else if(index == 2){
            pre = this.enemyPre2;
        }
        return pre;
    }

    onCreateRoleAtk(data){
        let index = data[0];
        let pos = data[1];
        //
        let atkPre = this.getRoleAtkPre(index);
        let atk = instantiate(atkPre);
        atk.position = pos;
        this.effectPanel.addChild(atk);
    }

    getRoleAtkPre(index){
        let pre = this.bulletPre0;
        if(index == 0){
            pre = this.bulletPre0;
        }else if(index == 1){
            pre = this.bulletPre1;
        }else if(index == 2){
            pre = this.bulletPre2;
        }
        return pre;
    }

    onCreateEnemyAtk(data){
        let index = data[0];
        let pos = data[1];
        //
        let atkPre = this.getEnemyAtkPre(index);
        let atk = instantiate(atkPre);
        atk.position = pos;
        this.effectPanel.addChild(atk)
    }

    getEnemyAtkPre(index){
        let pre = this.bulletPre3;
        if(index == 0){
            pre = this.bulletPre3;
        }else if(index == 1){
            pre = this.bulletPre4;
        }else if(index == 2){
            pre = this.bulletPre5;
        }
        return pre;
    }
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    onCreateShield(){
        let shield = instantiate(this.shieldPre);
        this.effectPanel.addChild(shield);
        //
        let shield_ctl: any = shield.getComponent("SkillShield");
        shield_ctl.setLifeTime(this.skill_shield_time);
    }

    onCreateRoleResume(pos){
        let resume = instantiate(this.roleResume);
        resume.position = pos;
        this.effectPanel.addChild(resume);
    }

    onCreateHomeResume(){
        let resume = instantiate(this.homeResume);
        this.effectPanel.addChild(resume);
    }

    onCreateHomeHurt(){
        let hurt = instantiate(this.homeHurt);
        this.effectPanel.addChild(hurt);
    }

    onCreateBossHurt(){
        let hurt = instantiate(this.bossHurt);
        this.effectPanel.addChild(hurt);
    }

    onCreateRoleAtk0(){
        let roleAtk = instantiate(this.roleAtk0);
        this.effectPanel.addChild(roleAtk);
    }

    onCreateRoleAtk1(pos){
        let roleAtk = instantiate(this.roleAtk1);
        roleAtk.position = pos;
        this.effectPanel.addChild(roleAtk);
    }
}


