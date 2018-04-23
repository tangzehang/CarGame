//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var Main = (function (_super) {
    __extends(Main, _super);
    function Main() {
        _super.apply(this, arguments);
        this.isThemeLoadEnd = false;
        this.isResourceLoadEnd = false;
        /**
         * 创建场景界面
         * Create scene interface
         */
        this.level = 1;
        this.OldRot = 0;
        this.TimeLimit = 101;
        this.Turns = 0;
        this.TurnsLimit = 0.04;
        this.DetectTime = 30;
        this.TurnTimeLimit = 30;
        this.SpeedTimeLimit = 30;
        this.MoveTime = 100;
        this.Speed = 0;
        this.MaxSpeed = 10;
        this.SpeedAdd = 0.08;
        this.collision = 0;
        this.TurnInterval = null;
        this.SpeedInterval = null;
        this.MoveInterval = null;
        this.TurnParams = 420;
        this.StageWidth = 480;
        this.StageHeight = 800;
        this.DetectInterval = null;
        this.CarLenth = 150;
        this.CarMinLenth = 16;
        this.CarWidth = 70;
        this.WheelDis = 25;
        this.R = 0;
        this.LeftFlag = true;
        this.AddRotation = 4.5;
        this.IsCrash = false;
        this.LevelTitle = ["垂直车位停车", "平行车位停车", "S弯驾驶", "直角转弯"];
    }
    var d = __define,c=Main,p=c.prototype;
    p.createChildren = function () {
        _super.prototype.createChildren.call(this);
        //inject the custom material parser
        //注入自定义的素材解析器
        var assetAdapter = new AssetAdapter();
        this.stage.registerImplementation("eui.IAssetAdapter", assetAdapter);
        this.stage.registerImplementation("eui.IThemeAdapter", new ThemeAdapter());
        //Config loading process interface
        //设置加载进度界面
        //        this.loadingView = new LoadingUI();
        //        this.stage.addChild(this.loadingView);
        // initialize the Resource loading library
        //初始化Resource资源加载库
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.loadConfig("resource/default.res.json", "resource/");
    };
    /**
     * 配置文件加载完成,开始预加载皮肤主题资源和preload资源组。
     * Loading of configuration file is complete, start to pre-load the theme configuration file and the preload resource group
     */
    p.onConfigComplete = function (event) {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        // load skin theme configuration file, you can manually modify the file. And replace the default skin.
        //加载皮肤主题配置文件,可以手动修改这个文件。替换默认皮肤。
        var theme = new eui.Theme("resource/loading.thm.json", this.stage);
        theme.addEventListener(eui.UIEvent.COMPLETE, this.onThemeLoadCompleteLoading, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
    };
    /**
     * 主题文件加载完成,开始预加载
     * Loading of theme configuration file is complete, start to pre-load the
     */
    p.onThemeLoadCompleteLoading = function () {
        RES.loadGroup("loading");
        var theme = new eui.Theme("resource/default.thm.json", this.stage);
        theme.addEventListener(eui.UIEvent.COMPLETE, this.onThemeLoadComplete, this);
    };
    /**
    * 主题文件加载完成,开始预加载
    * Loading of theme configuration file is complete, start to pre-load the
    */
    p.onThemeLoadComplete = function () {
        this.isThemeLoadEnd = true;
        this.createScene();
    };
    /**
     * preload资源组加载完成
     * preload resource group is loaded
     */
    p.onResourceLoadComplete = function (event) {
        var _this = this;
        if (event.groupName == "loading") {
            var data = RES.getRes("bloom_json");
            var texture = RES.getRes("bloom_png");
            var mcFactory = new egret.MovieClipDataFactory(data, texture);
            this.loadingMovie = new egret.MovieClip(mcFactory.generateMovieClipData("mc_name1"));
            this.loadingView = new Game.Loading();
            this.addChild(this.loadingView);
            this.loadingMovie.addEventListener(egret.Event.COMPLETE, function (e) {
                _this.removeChild(_this.loadingView);
                _this.system.stop();
                _this.removeChild(_this.system);
                _this.startCreateScene();
            }, this);
            this.loadingView.addMovie(this.loadingMovie);
            var texture = RES.getRes("newParticle_png");
            var config = RES.getRes("newParticle_json");
            this.system = new particle.GravityParticleSystem(texture, config);
            this.system.start();
            this.addChild(this.system);
            this.loadingMovie.gotoAndPlay("action", -1);
            RES.loadGroup("preload");
        }
        if (event.groupName == "preload") {
            //this.stage.removeChild(this.loadingView);
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
            this.isResourceLoadEnd = true;
            this.createScene();
        }
    };
    p.createScene = function () {
        if (this.isThemeLoadEnd && this.isResourceLoadEnd) {
            this.loadingMovie.gotoAndPlay(this.loadingMovie.currentFrame, 1);
        }
    };
    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    p.onItemLoadError = function (event) {
        console.warn("Url:" + event.resItem.url + " has failed to load");
    };
    /**
     * 资源组加载出错
     * Resource group loading failed
     */
    p.onResourceLoadError = function (event) {
        //TODO
        console.warn("Group:" + event.groupName + " has failed to load");
        //忽略加载失败的项目
        //ignore loading failed projects
        this.onResourceLoadComplete(event);
    };
    /**
     * preload资源组加载进度
     * loading process of preload resource
     */
    p.onResourceProgress = function (event) {
        if (event.groupName == "preload") {
            this.loadingView.setProcess(event.itemsLoaded, event.itemsTotal);
        }
    };
    p.initGame = function () {
        document.title = this.LevelTitle[this.level - 1];
        this.Speed = 0;
        this.Car.rotation = 0;
        this.Steering.Rot = -1;
        this.TurnCalculate(this);
        this.Car.leftWheel.rotation = 0;
        this.Car.rightWheel.rotation = 0;
        this.Steering.Rot = 0;
        this.TurnCalculate(this);
        this.Steering.Steering.rotation = 0;
        this.StartTime = new Date().getTime();
        switch (this.level) {
            case 1:
                this.collision = 0;
                this.finalStarttime = new Date().getTime();
                this.Car.x = 120;
                this.Car.y = 310;
                break;
            case 2:
                this.Car.x = 120;
                this.Car.y = 310;
                break;
            case 3:
                this.Car.x = this.StageWidth - 100;
                this.Car.y = this.StageHeight - 50;
                break;
            case 4:
                this.Car.x = 50;
                this.Car.y = this.StageHeight - 50;
                break;
            default:
                break;
        }
        this.road.changeBackGround(this.level);
    };
    p.drawCar = function () {
        var c = new Game.Car();
        c.x = 50;
        c.y = this.StageHeight - 50;
        c.height = -this.CarLenth;
        c.changeWay(true);
        this.addChild(c);
        this.Car = c;
    };
    p.drawButton = function () {
        this.ForwardButton = new eui.Button();
        this.ForwardButton.skinName = "Game.ForwardButtonSkin";
        this.ForwardButton.name = "forward";
        this.ForwardButton.x = this.StageWidth - 135 - 85;
        this.ForwardButton.y = 485;
        this.ForwardButton.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.SpeedFunction, this);
        this.ForwardButton.addEventListener(egret.TouchEvent.TOUCH_END, this.StopSpeedFunction, this);
        this.ForwardButton.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.StopSpeedFunction, this);
        this.addChild(this.ForwardButton);
        this.LeftButton = new eui.Button();
        this.LeftButton.skinName = "Game.ForwardButtonSkin";
        this.LeftButton.rotation = -90;
        this.LeftButton.x = this.StageWidth - 335;
        this.LeftButton.y = 680;
        this.LeftButton.name = "left";
        this.LeftButton.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.TurnFunction, this);
        this.LeftButton.addEventListener(egret.TouchEvent.TOUCH_END, this.StopTurnFunction, this);
        this.LeftButton.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.StopTurnFunction, this);
        this.addChild(this.LeftButton);
        this.RightButton = new eui.Button;
        this.RightButton.skinName = "Game.ForwardButtonSkin";
        this.RightButton.rotation = 90;
        this.RightButton.y = 595;
        this.RightButton.x = this.StageWidth - 20;
        this.RightButton.name = "right";
        this.RightButton.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.TurnFunction, this);
        this.RightButton.addEventListener(egret.TouchEvent.TOUCH_END, this.StopTurnFunction, this);
        this.RightButton.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.StopTurnFunction, this);
        this.addChild(this.RightButton);
        this.BackButton = new eui.Button();
        this.BackButton.skinName = "Game.ForwardButtonSkin";
        this.BackButton.name = "back";
        this.BackButton.rotation = 180;
        this.BackButton.x = this.StageWidth - 220 + 85;
        this.BackButton.y = 790;
        this.BackButton.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.SpeedFunction, this);
        this.BackButton.addEventListener(egret.TouchEvent.TOUCH_END, this.StopSpeedFunction, this);
        this.BackButton.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.StopSpeedFunction, this);
        this.addChild(this.BackButton);
        this.StopButton = new eui.Button();
        this.StopButton.skinName = "Game.StopButtonSkin";
        this.StopButton.x = this.StageWidth - 135 - 85;
        this.StopButton.y = 595;
        this.StopButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.Stop, this);
        this.addChild(this.StopButton);
        this.Steering = new Game.Steering();
        this.Steering.x = this.StageWidth - 5 - 100;
        this.Steering.y = this.StageHeight - 290;
        this.addChild(this.Steering);
    };
    p.startCreateScene = function () {
        this.WarnPanel = new Game.Warning();
        this.WarnPanel.Confirm.addEventListener(egret.TouchEvent.TOUCH_TAP, this.hidePannel, this);
        this.SuccessPanel = new Game.Success();
        this.SuccessPanel.Confirm.addEventListener(egret.TouchEvent.TOUCH_TAP, this.hidePannel, this);
        this.road = new Game.Road();
        this.addChild(this.road);
        this.road.changeBackGround(1);
        this.drawCar();
        this.drawButton();
        this.initGame();
        this.MoveInterval = setInterval(this.MoveFunction, this.TimeLimit, this);
        this.DetectInterval = setInterval(this.detectOut, this.DetectTime, this);
        this.StartTime = new Date().getTime();
    };
    p.SpeedFunction = function (e) {
        if (this.SpeedInterval) {
            clearInterval(this.SpeedInterval);
        }
        this.SpeedInterval = setInterval(this.MoveOperate, this.SpeedTimeLimit, e.target.name, this);
    };
    p.MoveOperate = function (name, self) {
        if (name == "forward") {
            if (self.Speed < self.MaxSpeed) {
                self.Speed += self.SpeedAdd;
            }
        }
        else {
            if (self.Speed > -self.MaxSpeed) {
                self.Speed -= self.SpeedAdd;
            }
        }
    };
    p.StopSpeedFunction = function (e) {
        if (this.SpeedInterval) {
            clearInterval(this.SpeedInterval);
            this.SpeedInterval = null;
        }
    };
    p.Stop = function (e) {
        this.Speed = 0;
        this.ForwardButton.enabled = true;
        this.BackButton.enabled = true;
    };
    p.TurnFunction = function (e) {
        if (this.TurnInterval) {
            clearInterval(this.TurnInterval);
        }
        this.TurnInterval = setInterval(this.TurnOperate, this.TurnTimeLimit, e.target.name, this);
    };
    p.TurnOperate = function (name, self) {
        if (name == "left") {
            self.Steering.addRot(true, self.Turns);
        }
        else {
            self.Steering.addRot(false, self.Turns);
        }
        if (self.Turns <= 2)
            self.Turns += self.TurnsLimit;
        //self.TurnCalculate(self);
    };
    p.StopTurnFunction = function (e) {
        this.Turns = 0;
        if (this.TurnInterval) {
            clearInterval(this.TurnInterval);
            this.TurnInterval = null;
        }
        this.OldRot = this.Steering.Rot;
    };
    p.TurnCalculate = function (self) {
        if (self.Steering.Rot == 0) {
            self.R = 0;
            self.Car.leftWheel.rotation = 0;
            self.Car.rightWheel.rotation = 0;
            return;
        }
        var xita = self.Steering.Rot / 45 * self.AddRotation * 10;
        self.Car.leftWheel.rotation = xita;
        self.Car.rightWheel.rotation = xita;
        self.R = (self.CarLenth - self.WheelDis) / Math.tan(xita / 180 * Math.PI);
        if (self.Steering.Rot > 0) {
            if (self.LeftFlag) {
                if (self.MoveInterval) {
                    clearInterval(self.MoveInterval);
                }
                egret.Tween.removeTweens(self.Car);
                self.LeftFlag = false;
                var Rotation = self.Car.rotation;
                self.Car.width = -self.CarWidth;
                self.Car.x += self.CarWidth * Math.cos(Rotation / 180 * Math.PI);
                self.Car.y += self.CarWidth * Math.sin(Rotation / 180 * Math.PI);
                self.Car.changeWay(false);
                self.MoveInterval = setInterval(self.MoveFunction, self.TimeLimit, self);
            }
            self.LeftFlag = false;
        }
        if (self.Steering.Rot < 0) {
            if (!self.LeftFlag) {
                if (self.MoveInterval) {
                    clearInterval(self.MoveInterval);
                }
                egret.Tween.removeTweens(self.Car);
                self.LeftFlag = true;
                var Rotation = self.Car.rotation;
                self.Car.width = self.CarWidth;
                self.Car.x -= self.CarWidth * Math.cos(Rotation / 180 * Math.PI);
                self.Car.y -= self.CarWidth * Math.sin(Rotation / 180 * Math.PI);
                self.Car.changeWay(true);
                self.MoveInterval = setInterval(self.MoveFunction, self.TimeLimit, self);
            }
            self.LeftFlag = true;
        }
    };
    p.MoveFunction = function (self) {
        if (self.OldRot != self.Steering.Rot) {
            self.TurnCalculate(self);
        }
        if (self.Speed == 0) {
            return;
        }
        var v = (self.Speed * 5);
        var r = (v / self.R);
        var xx;
        var yy;
        var rot = self.Car.rotation % 360;
        var x = self.Car.x;
        var y = self.Car.y;
        var x1;
        var y1;
        var tween = egret.Tween.get(self.Car);
        if (self.R == 0) {
            x1 = x + v * Math.sin(rot / 180 * Math.PI);
            y1 = y - v * Math.cos(rot / 180 * Math.PI);
            tween.to({ "x": x1, "y": y1 }, self.MoveTime);
            self.IsCrash = false;
            return;
        }
        xx = x + self.R * Math.cos(rot / 180 * Math.PI);
        yy = y + self.R * Math.sin(rot / 180 * Math.PI);
        x1 = (x - xx) * Math.cos(-r) + (y - yy) * Math.sin(-r) + xx;
        y1 = -(x - xx) * Math.sin(-r) + (y - yy) * Math.cos(-r) + yy;
        tween.to({ "x": x1, "y": y1, "rotation": rot + r / Math.PI * 180 }, self.MoveTime);
        self.IsCrash = false;
    };
    p.detectOut = function (self) {
        if (self.IsCrash) {
            return;
        }
        var x = self.Car.x;
        var y = self.Car.y;
        var re = 3;
        switch (self.level) {
            case 1:
                re = self.testResult1(x, y);
                break;
            case 2:
                re = self.testResult2(x, y);
                break;
            case 3:
                re = self.testResult3(x, y);
                break;
            case 4:
                re = self.testResult4(x, y);
                break;
            default:
                break;
        }
        if (re == 1) {
            //console.log("撞墙了~");
            self.collision += 1;
            //self.showPannel(false);
            egret.Tween.removeTweens(self.Car);
            self.Speed = -self.Speed;
            self.MoveFunction(self);
            self.Speed = 0;
            self.IsCrash = true;
        }
        if (re == 2) {
            //console.log("入库成功~");
            self.showPannel(true);
            var time = new Date().getTime();
            var Mtime = Math.round((time - self.StartTime) / 1000);
            //console.log("start_Time:"+self.StartTime+",now:"+time+",mTime:"+Mtime);
            self.SuccessPanel.setTimeLabel(Mtime);
            self.SuccessPanel.setCollision(self.collision);
            self.SuccessPanel.setLabelText(self.LevelTitle[self.level - 1]);
            self.Speed = 0;
            egret.Tween.removeTweens(self.Car);
            self.IsCrash = true;
            document.title = "我通过花了" + Mtime + "秒,碰撞" + self.collision + "次";
        }
    };
    p.showPannel = function (isSuccess) {
        if (isSuccess) {
            this.addChild(this.SuccessPanel);
        }
        else {
            this.addChild(this.WarnPanel);
        }
    };
    p.hidePannel = function (e) {
        if (e.target.name == "warning") {
            this.removeChild(this.WarnPanel);
        }
        else {
            this.removeChild(this.SuccessPanel);
            this.level = this.level % 4 + 1;
            this.initGame();
        }
    };
    p.testResult1 = function (x, y) {
        var rot = this.Car.rotation;
        var lfx;
        var lfy;
        var rfx;
        var rfy;
        var lbx;
        var lby;
        var rbx;
        var rby;
        var llfx;
        var llfy;
        var rrfx;
        var rrfy;
        var llbx;
        var llby;
        var rrbx;
        var rrby;
        if (this.LeftFlag) {
            lbx = x;
            lby = y;
            rbx = x + this.CarWidth * Math.cos(rot / 180 * Math.PI);
            rby = y + this.CarWidth * Math.sin(rot / 180 * Math.PI);
            lfx = x + this.CarLenth * Math.sin(rot / 180 * Math.PI);
            lfy = y - this.CarLenth * Math.cos(rot / 180 * Math.PI);
            rfx = x + this.CarWidth * Math.cos(rot / 180 * Math.PI) + this.CarLenth * Math.sin(rot / 180 * Math.PI);
            rfy = y + this.CarWidth * Math.sin(rot / 180 * Math.PI) - this.CarLenth * Math.cos(rot / 180 * Math.PI);
        }
        else {
            lbx = x - this.CarWidth * Math.cos(rot / 180 * Math.PI);
            lby = y - this.CarWidth * Math.sin(rot / 180 * Math.PI);
            rbx = x;
            rby = y;
            rfx = x + this.CarLenth * Math.sin(rot / 180 * Math.PI);
            rfy = y - this.CarLenth * Math.cos(rot / 180 * Math.PI);
            lfx = x - this.CarWidth * Math.cos(rot / 180 * Math.PI) + this.CarLenth * Math.sin(rot / 180 * Math.PI);
            lfy = y - this.CarWidth * Math.sin(rot / 180 * Math.PI) - this.CarLenth * Math.cos(rot / 180 * Math.PI);
        }
        if (lbx <= 0 || rbx <= 0 || lfx <= 0 || rfx <= 0 || lbx >= this.StageWidth - 10 || rbx >= this.StageWidth - 10 || lfx >= this.StageWidth - 10 || rfx >= this.StageWidth - 10) {
            //console.log("lbx=" + lbx + ",lby=" + lby + ",rbx="+rbx+",rby"+rby+",lfx="+lfx+",lfy="+lfy+",rfx="+rfx+",rfy="+rfy+",width:"+this.StageWidth);
            return 1;
        }
        if (lby <= 0 || rby <= 0 || lfy <= 0 || rfy <= 0 || lby >= this.StageHeight || rby >= this.StageHeight || lfy >= this.StageHeight || rfy >= this.StageHeight) {
            //console.log("lbx=" + lbx + ",lby=" + lby + ",rbx=" + rbx + ",rby" + rby + ",lfx=" + lfx + ",lfy=" + lfy + ",rfx=" + rfx + ",rfy=" + rfy + ",width:"+this.StageWidth);
            return 1;
        }
        if ((lbx >= 295 && (lby <= 326 || lby >= 502)) || (rbx >= 295 && (rby <= 326 || rby >= 502)) || (lfx >= 295 && (lfy <= 326 || lfy >= 502)) || (rfx >= 295 && (rfy <= 326 || rfy >= 502))) {
            //console.log("lbx=" + lbx + ",lby=" + lby + ",rbx=" + rbx + ",rby" + rby + ",lfx=" + lfx + ",lfy=" + lfy + ",rfx=" + rfx + ",rfy=" + rfy + ",width:" + this.StageWidth);
            return 1;
        }
        if (lbx - lfx == 0 || lby - lfy == 0) {
            return 3;
        }
        llbx = lbx - 295;
        llby = lby - 326;
        llfx = lfx - 295;
        llfy = lfy - 326;
        rrbx = rbx - 295;
        rrby = rby - 326;
        rrfx = rfx - 295;
        rrfy = rfy - 326;
        var line11 = ((llbx - llfx) / (llby - llfy) * (-llfy)) + llfx;
        var line12 = ((llby - llfy) / (llbx - llfx) * (-llfx)) + llfy;
        var line21 = ((llbx - rrbx) / (llby - rrby) * (-rrby)) + rrbx;
        var line22 = ((llby - rrby) / (llbx - rrbx) * (-rrbx)) + rrby;
        var line31 = ((llfx - rrfx) / (llfy - rrfy) * (-rrfy)) + rrfx;
        var line32 = ((llfy - rrfy) / (llfx - rrfx) * (-rrfx)) + rrfy;
        var line41 = ((rrfx - rrbx) / (rrfy - rrby) * (-rrby)) + rrbx;
        var line42 = ((rrfy - rrby) / (rrfx - rrbx) * (-rrbx)) + rrby;
        if ((llbx * llfx < 0 && line11 >= 0 && line12 <= 0) || (llbx * rrbx < 0 && line21 >= 0 && line22 <= 0) || (llfx * rrfx < 0 && line31 >= 0 && line32 <= 0) || (rrfx * rrbx < 0 && line41 >= 0 && line42 <= 0)) {
            //console.log("up" + " line11" + line11 + " line12:" + line12 + " line21" + line21 + " line22:" + line22 + " line31" + line31 + " line32:" + line32 + " line41" + line41 + " line42:" + line42);
            return 1;
        }
        llby = lby - 502;
        llfy = lfy - 502;
        rrby = rby - 502;
        rrfy = rfy - 502;
        var line11 = ((llbx - llfx) / (llby - llfy) * (-llfy)) + llfx;
        var line12 = ((llby - llfy) / (llbx - llfx) * (-llfx)) + llfy;
        var line21 = ((llbx - rrbx) / (llby - rrby) * (-rrby)) + rrbx;
        var line22 = ((llby - rrby) / (llbx - rrbx) * (-rrbx)) + rrby;
        var line31 = ((llfx - rrfx) / (llfy - rrfy) * (-rrfy)) + rrfx;
        var line32 = ((llfy - rrfy) / (llfx - rrfx) * (-rrfx)) + rrfy;
        var line41 = ((rrfx - rrbx) / (rrfy - rrby) * (-rrby)) + rrbx;
        var line42 = ((rrfy - rrby) / (rrfx - rrbx) * (-rrbx)) + rrby;
        if ((llby * llfy < 0 && line11 >= 0 && line12 >= 0) || (llby * rrby < 0 && line21 >= 0 && line22 >= 0) || (llfy * rrfy < 0 && line31 >= 0 && line32 >= 0) || (rrfy * rrby < 0 && line41 >= 0 && line42 >= 0)) {
            //console.log("down" + " line11" + line11 + " line12:" + line12 + " line21" + line21 + " line22:" + line22 + " line31" + line31 + " line32:" + line32 + " line41" + line41 + " line42:" + line42);
            return 1;
        }
        if (this.Speed == 0 && lbx > 286 && lby > 355 && lby < 465 && rbx > 286 && rby > 355 && rby < 465 && lfx > 286 && lfy > 355 && lfy < 465 && rfx > 286 && rfy > 355 && rfy < 465) {
            return 2;
        }
        return 3;
    };
    p.testResult2 = function (x, y) {
        var rot = this.Car.rotation;
        var lfx;
        var lfy;
        var rfx;
        var rfy;
        var lbx;
        var lby;
        var rbx;
        var rby;
        var llfx;
        var llfy;
        var rrfx;
        var rrfy;
        var llbx;
        var llby;
        var rrbx;
        var rrby;
        //计算出车4个顶点位置
        if (this.LeftFlag) {
            lbx = x;
            lby = y;
            rbx = x + this.CarWidth * Math.cos(rot / 180 * Math.PI);
            rby = y + this.CarWidth * Math.sin(rot / 180 * Math.PI);
            lfx = x + this.CarLenth * Math.sin(rot / 180 * Math.PI);
            lfy = y - this.CarLenth * Math.cos(rot / 180 * Math.PI);
            rfx = x + this.CarWidth * Math.cos(rot / 180 * Math.PI) + this.CarLenth * Math.sin(rot / 180 * Math.PI);
            rfy = y + this.CarWidth * Math.sin(rot / 180 * Math.PI) - this.CarLenth * Math.cos(rot / 180 * Math.PI);
        }
        else {
            lbx = x - this.CarWidth * Math.cos(rot / 180 * Math.PI);
            lby = y - this.CarWidth * Math.sin(rot / 180 * Math.PI);
            rbx = x;
            rby = y;
            rfx = x + this.CarLenth * Math.sin(rot / 180 * Math.PI);
            rfy = y - this.CarLenth * Math.cos(rot / 180 * Math.PI);
            lfx = x - this.CarWidth * Math.cos(rot / 180 * Math.PI) + this.CarLenth * Math.sin(rot / 180 * Math.PI);
            lfy = y - this.CarWidth * Math.sin(rot / 180 * Math.PI) - this.CarLenth * Math.cos(rot / 180 * Math.PI);
        }
        //边界碰撞检测
        if (lbx <= 0 || rbx <= 0 || lfx <= 0 || rfx <= 0 || lbx >= this.StageWidth - 10 || rbx >= this.StageWidth - 10 || lfx >= this.StageWidth - 10 || rfx >= this.StageWidth - 10) {
            //console.log("lbx=" + lbx + ",lby=" + lby + ",rbx="+rbx+",rby"+rby+",lfx="+lfx+",lfy="+lfy+",rfx="+rfx+",rfy="+rfy+",width:"+this.StageWidth);
            return 1;
        }
        if (lby <= 0 || rby <= 0 || lfy <= 0 || rfy <= 0 || lby >= this.StageHeight || rby >= this.StageHeight || lfy >= this.StageHeight || rfy >= this.StageHeight) {
            //console.log("lbx=" + lbx + ",lby=" + lby + ",rbx=" + rbx + ",rby" + rby + ",lfx=" + lfx + ",lfy=" + lfy + ",rfx=" + rfx + ",rfy=" + rfy + ",width:"+this.StageWidth);
            return 1;
        }
        if ((lbx >= 373 && ((lby >= 31 && lby <= 182) || (lby >= 427 && lby <= 574) || (lby >= 623 && lby <= 779)))
            || (rbx >= 373 && ((rby >= 31 && rby <= 182) || (rby >= 427 && rby <= 574) || (rby >= 623 && rby <= 779)))
            || (lfx >= 373 && ((lfy >= 31 && lfy <= 182) || (lfy >= 427 && lfy <= 574) || (lfy >= 623 && lfy <= 779)))
            || (rfx >= 373 && ((rfy >= 31 && rfy <= 182) || (rfy >= 427 && rfy <= 574) || (rfy >= 623 && rfy <= 779)))) {
            //console.log("lbx=" + lbx + ",lby=" + lby + ",rbx=" + rbx + ",rby" + rby + ",lfx=" + lfx + ",lfy=" + lfy + ",rfx=" + rfx + ",rfy=" + rfy + ",width:" + this.StageWidth);
            return 1;
        }
        //如果车没有倾斜..不用进行直线判断
        if (lbx - lfx == 0 || lby - lfy == 0) {
            return 3;
        }
        //平移计算并且计算出车的4条边与平移后左边轴的交点.以此来推断出目前的线是否已经经过第N象限
        llbx = lbx - 373;
        llby = lby - 182;
        llfx = lfx - 373;
        llfy = lfy - 182;
        rrbx = rbx - 373;
        rrby = rby - 182;
        rrfx = rfx - 373;
        rrfy = rfy - 182;
        var line11 = ((llbx - llfx) / (llby - llfy) * (-llfy)) + llfx;
        var line12 = ((llby - llfy) / (llbx - llfx) * (-llfx)) + llfy;
        var line21 = ((llbx - rrbx) / (llby - rrby) * (-rrby)) + rrbx;
        var line22 = ((llby - rrby) / (llbx - rrbx) * (-rrbx)) + rrby;
        var line31 = ((llfx - rrfx) / (llfy - rrfy) * (-rrfy)) + rrfx;
        var line32 = ((llfy - rrfy) / (llfx - rrfx) * (-rrfx)) + rrfy;
        var line41 = ((rrfx - rrbx) / (rrfy - rrby) * (-rrby)) + rrbx;
        var line42 = ((rrfy - rrby) / (rrfx - rrbx) * (-rrbx)) + rrby;
        if ((llbx * llfx < 0 && line11 >= 0 && line12 <= 0) || (llbx * rrbx < 0 && line21 >= 0 && line22 <= 0) || (llfx * rrfx < 0 && line31 >= 0 && line32 <= 0) || (rrfx * rrbx < 0 && line41 >= 0 && line42 <= 0)) {
            //console.log("up" + " line11" + line11 + " line12:" + line12 + " line21" + line21 + " line22:" + line22 + " line31" + line31 + " line32:" + line32 + " line41" + line41 + " line42:" + line42);
            return 1;
        }
        llby = lby - 427;
        llfy = lfy - 427;
        rrby = rby - 427;
        rrfy = rfy - 427;
        var line11 = ((llbx - llfx) / (llby - llfy) * (-llfy)) + llfx;
        var line12 = ((llby - llfy) / (llbx - llfx) * (-llfx)) + llfy;
        var line21 = ((llbx - rrbx) / (llby - rrby) * (-rrby)) + rrbx;
        var line22 = ((llby - rrby) / (llbx - rrbx) * (-rrbx)) + rrby;
        var line31 = ((llfx - rrfx) / (llfy - rrfy) * (-rrfy)) + rrfx;
        var line32 = ((llfy - rrfy) / (llfx - rrfx) * (-rrfx)) + rrfy;
        var line41 = ((rrfx - rrbx) / (rrfy - rrby) * (-rrby)) + rrbx;
        var line42 = ((rrfy - rrby) / (rrfx - rrbx) * (-rrbx)) + rrby;
        if ((llby * llfy < 0 && line11 >= 0 && line12 >= 0) || (llby * rrby < 0 && line21 >= 0 && line22 >= 0) || (llfy * rrfy < 0 && line31 >= 0 && line32 >= 0) || (rrfy * rrby < 0 && line41 >= 0 && line42 >= 0)) {
            //console.log("down" + " line11" + line11 + " line12:" + line12 + " line21" + line21 + " line22:" + line22 + " line31" + line31 + " line32:" + line32 + " line41" + line41 + " line42:" + line42);
            return 1;
        }
        //是否入库
        if (this.Speed == 0
            && lbx > 358 && lby > 223 && lby < 399 && lbx < 460
            && rbx > 358 && rby > 223 && rby < 399 && rbx < 460
            && lfx > 358 && lfy > 223 && lfy < 399 && lfx < 460
            && rfx > 358 && rfy > 223 && rfy < 399 && rfx < 460) {
            return 2;
        }
        return 3;
    };
    p.testResult3 = function (x, y) {
        var rot = this.Car.rotation;
        var p1 = { x: 0, y: 0 };
        var p2 = { x: 0, y: 0 };
        var p3 = { x: 0, y: 0 };
        var p4 = { x: 0, y: 0 };
        //计算出车4个顶点位置
        x = x;
        y = y - 5;
        if (this.LeftFlag) {
            p2.x = x;
            p2.y = y;
            p3.x = x + this.CarWidth * Math.cos(rot / 180 * Math.PI);
            p3.y = y + this.CarWidth * Math.sin(rot / 180 * Math.PI);
            p1.x = x + (this.CarLenth - this.CarMinLenth) * Math.sin(rot / 180 * Math.PI);
            p1.y = y - (this.CarLenth - this.CarMinLenth) * Math.cos(rot / 180 * Math.PI);
            p4.x = x + this.CarWidth * Math.cos(rot / 180 * Math.PI) + (this.CarLenth - this.CarMinLenth) * Math.sin(rot / 180 * Math.PI);
            p4.y = y + this.CarWidth * Math.sin(rot / 180 * Math.PI) - (this.CarLenth - this.CarMinLenth) * Math.cos(rot / 180 * Math.PI);
        }
        else {
            p2.x = x - this.CarWidth * Math.cos(rot / 180 * Math.PI);
            p2.y = y - this.CarWidth * Math.sin(rot / 180 * Math.PI);
            p3.x = x;
            p3.y = y;
            p4.x = x + (this.CarLenth - this.CarMinLenth) * Math.sin(rot / 180 * Math.PI);
            p4.y = y - (this.CarLenth - this.CarMinLenth) * Math.cos(rot / 180 * Math.PI);
            p1.x = x - this.CarWidth * Math.cos(rot / 180 * Math.PI) + (this.CarLenth - this.CarMinLenth) * Math.sin(rot / 180 * Math.PI);
            p1.y = y - this.CarWidth * Math.sin(rot / 180 * Math.PI) - (this.CarLenth - this.CarMinLenth) * Math.cos(rot / 180 * Math.PI);
        }
        //边界碰撞检测
        if (p1.x <= 0 || p2.x <= 0 || p3.x <= 0 || p4.x <= 0 || p1.x >= this.StageWidth - 10 || p2.x >= this.StageWidth - 10 || p3.x >= this.StageWidth - 10 || p4.x >= this.StageWidth - 10) {
            //console.log("lbx=" + lbx + ",lby=" + lby + ",rbx="+rbx+",rby"+rby+",lfx="+lfx+",lfy="+lfy+",rfx="+rfx+",rfy="+rfy+",width:"+this.StageWidth);
            return 1;
        }
        if (p1.y <= 0 || p2.y <= 0 || p3.y <= 0 || p4.y <= 0 || p1.y >= this.StageHeight || p2.y >= this.StageHeight || p3.y >= this.StageHeight || p4.y >= this.StageHeight) {
            //console.log("lbx=" + lbx + ",lby=" + lby + ",rbx=" + rbx + ",rby" + rby + ",lfx=" + lfx + ",lfy=" + lfy + ",rfx=" + rfx + ",rfy=" + rfy + ",width:"+this.StageWidth);
            return 1;
        }
        var p5 = { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };
        var p6 = { x: (p2.x + p3.x) / 2, y: (p2.y + p3.y) / 2 };
        var p7 = { x: (p3.x + p4.x) / 2, y: (p3.y + p4.y) / 2 };
        var p8 = { x: (p4.x + p1.x) / 2, y: (p4.y + p1.y) / 2 - 15 };
        var p9 = { x: (p1.x + p5.x) / 2, y: (p1.y + p5.y) / 2 };
        var p10 = { x: (p2.x + p5.x) / 2, y: (p2.y + p5.y) / 2 };
        var p11 = { x: (p6.x + p2.x) / 2, y: (p6.y + p2.y) / 2 };
        var p12 = { x: (p6.x + p3.x) / 2, y: (p6.y + p3.y) / 2 };
        var p13 = { x: (p7.x + p3.x) / 2, y: (p7.y + p3.y) / 2 };
        var p14 = { x: (p7.x + p4.x) / 2, y: (p7.y + p4.y) / 2 };
        var p15 = { x: (p8.x + p4.x) / 2, y: (p8.y + p4.y) / 2 };
        var p16 = { x: (p8.x + p5.x) / 2, y: (p8.y + p5.y) / 2 };
        var all = [p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, p12, p13, p14, p15, p16];
        for (var i = 0; i < 16; i++) {
            if (this.testCircle(all[i])) {
                return 1;
            }
        }
        for (var i = 0; i < 4; i++) {
            if (all[i].y > 239) {
                return 3;
            }
        }
        return 2;
    };
    p.testCircle = function (p) {
        var x = p.x - 240;
        var y = p.y - 238;
        var y2 = p.y - 559;
        if (x < 0 && y > 0 && y2 < 0) {
            var value = Math.pow(x, 2) + Math.pow(y, 2);
            if ((value <= 90 * 90 && value >= 80 * 80) || (value >= 231 * 231 && value <= 240 * 240)) {
                return true;
            }
        }
        if (x > 0 && y2 < 0 && y > 0) {
            var value = Math.pow(x, 2) + Math.pow(y2, 2);
            if ((value <= 90 * 90 && value >= 80 * 80) || (value >= 231 * 231 && value <= 240 * 240)) {
                return true;
            }
        }
        return false;
    };
    //1碰撞,2成功.3继续
    p.testResult4 = function (x, y) {
        var rot = this.Car.rotation;
        var p1 = { x: 0, y: 0 };
        var p2 = { x: 0, y: 0 };
        var p3 = { x: 0, y: 0 };
        var p4 = { x: 0, y: 0 };
        //计算出车4个顶点位置
        x = x;
        y = y - 5;
        if (this.LeftFlag) {
            p2.x = x;
            p2.y = y;
            p3.x = x + this.CarWidth * Math.cos(rot / 180 * Math.PI);
            p3.y = y + this.CarWidth * Math.sin(rot / 180 * Math.PI);
            p1.x = x + (this.CarLenth - this.CarMinLenth) * Math.sin(rot / 180 * Math.PI);
            p1.y = y - (this.CarLenth - this.CarMinLenth) * Math.cos(rot / 180 * Math.PI);
            p4.x = x + this.CarWidth * Math.cos(rot / 180 * Math.PI) + (this.CarLenth - this.CarMinLenth) * Math.sin(rot / 180 * Math.PI);
            p4.y = y + this.CarWidth * Math.sin(rot / 180 * Math.PI) - (this.CarLenth - this.CarMinLenth) * Math.cos(rot / 180 * Math.PI);
        }
        else {
            p2.x = x - this.CarWidth * Math.cos(rot / 180 * Math.PI);
            p2.y = y - this.CarWidth * Math.sin(rot / 180 * Math.PI);
            p3.x = x;
            p3.y = y;
            p4.x = x + (this.CarLenth - this.CarMinLenth) * Math.sin(rot / 180 * Math.PI);
            p4.y = y - (this.CarLenth - this.CarMinLenth) * Math.cos(rot / 180 * Math.PI);
            p1.x = x - this.CarWidth * Math.cos(rot / 180 * Math.PI) + (this.CarLenth - this.CarMinLenth) * Math.sin(rot / 180 * Math.PI);
            p1.y = y - this.CarWidth * Math.sin(rot / 180 * Math.PI) - (this.CarLenth - this.CarMinLenth) * Math.cos(rot / 180 * Math.PI);
        }
        //边界碰撞检测
        if (p1.x <= 0 || p2.x <= 0 || p3.x <= 0 || p4.x <= 0 || p1.x >= this.StageWidth - 10 || p2.x >= this.StageWidth - 10 || p3.x >= this.StageWidth - 10 || p4.x >= this.StageWidth - 10) {
            //console.log("lbx=" + lbx + ",lby=" + lby + ",rbx="+rbx+",rby"+rby+",lfx="+lfx+",lfy="+lfy+",rfx="+rfx+",rfy="+rfy+",width:"+this.StageWidth);
            return 1;
        }
        if (p1.y <= 0 || p2.y <= 0 || p3.y <= 0 || p4.y <= 0 || p1.y >= this.StageHeight || p2.y >= this.StageHeight || p3.y >= this.StageHeight || p4.y >= this.StageHeight) {
            //console.log("lbx=" + lbx + ",lby=" + lby + ",rbx=" + rbx + ",rby" + rby + ",lfx=" + lfx + ",lfy=" + lfy + ",rfx=" + rfx + ",rfy=" + rfy + ",width:"+this.StageWidth);
            return 1;
        }
        var p5 = { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };
        var p6 = { x: (p2.x + p3.x) / 2, y: (p2.y + p3.y) / 2 };
        var p7 = { x: (p3.x + p4.x) / 2, y: (p3.y + p4.y) / 2 };
        var p8 = { x: (p4.x + p1.x) / 2, y: (p4.y + p1.y) / 2 - 15 };
        var p9 = { x: (p1.x + p5.x) / 2, y: (p1.y + p5.y) / 2 };
        var p10 = { x: (p2.x + p5.x) / 2, y: (p2.y + p5.y) / 2 };
        var p11 = { x: (p6.x + p2.x) / 2, y: (p6.y + p2.y) / 2 };
        var p12 = { x: (p6.x + p3.x) / 2, y: (p6.y + p3.y) / 2 };
        var p13 = { x: (p7.x + p3.x) / 2, y: (p7.y + p3.y) / 2 };
        var p14 = { x: (p7.x + p4.x) / 2, y: (p7.y + p4.y) / 2 };
        var p15 = { x: (p8.x + p4.x) / 2, y: (p8.y + p4.y) / 2 };
        var p16 = { x: (p8.x + p5.x) / 2, y: (p8.y + p5.y) / 2 };
        var all = [p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, p12, p13, p14, p15, p16];
        for (var i = 0; i < 16; i++) {
            if (this.testangle(all[i])) {
                return 1;
            }
        }
        for (var i = 0; i < 4; i++) {
            if (all[i].x <= 305) {
                return 3;
            }
        }
        return 2;
    };
    p.testangle = function (p) {
        if ((p.x > 186 && p.y > 357 && p.x < 305) || p.x < 33 || (p.y < 225 && p.x < 305)) {
            var tmp = new egret.Shape();
            //            tmp.graphics.beginFill(0xFFFFFF);
            //            tmp.graphics.drawRect(0,0,10,10);
            //            tmp.graphics.endFill();
            //            tmp.x = p.x;
            //            tmp.y = p.y;
            this.addChild(tmp);
            return true;
        }
        return false;
    };
    return Main;
}(eui.UILayer));
egret.registerClass(Main,'Main');
//# sourceMappingURL=Main.js.map