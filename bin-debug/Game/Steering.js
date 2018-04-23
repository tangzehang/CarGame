var Game;
(function (Game) {
    /**
     *
     * @author
     *
     */
    var Steering = (function (_super) {
        __extends(Steering, _super);
        function Steering() {
            _super.call(this);
            this.PreX = 0;
            this.PreY = 0;
            this.Rot = 0;
            this.PreRotation = 0;
            this.CircleX = 100;
            this.CireclY = 100;
            this.AddRot = 5;
            this.skinName = "Game.CarSteeringSkin";
            this.width = 100;
            this.height = 100;
        }
        var d = __define,c=Steering,p=c.prototype;
        p.childrenCreated = function () {
            _super.prototype.childrenCreated.call(this);
            this.Steering.removeChildren();
            //            this.addEventListener(egret.TouchEvent.TOUCH_BEGIN,this.touchDown,this);
            //            this.addEventListener(egret.TouchEvent.TOUCH_MOVE,this.touchMove,this);
            //            this.addEventListener(egret.TouchEvent.TOUCH_END,this.touchUp,this);
            //            this.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE,this.touchUpOut,this);
        };
        p.touchDown = function (e) {
            console.log("down:" + e.localX + " " + e.localY);
            var x = e.stageX - this.CircleX - this.x;
            var y = e.stageY - this.CireclY - this.y;
            this.PreX = x / Math.sqrt(x * x + y * y);
            this.PreY = y / Math.sqrt(x * x + y * y);
            this.PreRotation = this.calculateRotation(x, y);
            console.log("now rotation:" + this.PreRotation);
        };
        p.touchMove = function (e) {
            if (e.touchDown) {
                console.log("move:" + e.localX + " " + e.localY);
            }
            var x = e.stageX - this.CircleX - this.x;
            var y = e.stageY - this.CireclY - this.y;
            this.PreX = x / Math.sqrt(x * x + y * y);
            this.PreY = y / Math.sqrt(x * x + y * y);
            var Rotation = this.calculateRotation(x, y);
            var resultRotation = Rotation - this.PreRotation;
            this.PreRotation = Rotation;
            this.Rot += resultRotation;
            if (this.Rot <= -45) {
                this.Steering.rotation = -45;
                this.Rot = -45;
            }
            else if (this.Rot >= 45) {
                this.Steering.rotation = 45;
                this.Rot = 45;
            }
            else {
                this.Steering.rotation += resultRotation;
            }
            console.log("now rotation:" + this.Rot + " ;and resultRotation:" + resultRotation);
        };
        p.addRot = function (left, Turns) {
            if (left) {
                var tmp_Rot = this.Rot;
                this.Rot -= (1 + Turns) * this.AddRot;
                if (this.Rot <= -45) {
                    this.Rot = -45;
                }
                if (tmp_Rot > 0 && this.Rot < 0) {
                    this.Rot = 0;
                }
            }
            else {
                var tmp_Rot = this.Rot;
                this.Rot += (1 + Turns) * this.AddRot;
                if (this.Rot >= 45) {
                    this.Rot = 45;
                }
                if (this.Rot > 0 && tmp_Rot < 0) {
                    this.Rot = 0;
                }
            }
            this.Steering.rotation = this.Rot;
        };
        p.touchUp = function (e) {
            console.log("up:" + e.localX + " " + e.localY);
            this.PreX = 0;
            this.PreY = 0;
            this.PreRotation = 0;
        };
        p.touchUpOut = function (e) {
            console.log("out:" + e.localX + " " + e.localY);
            this.PreX = 0;
            this.PreY = 0;
            this.PreRotation = 0;
        };
        p.calculateRotation = function (x, y) {
            var R = Math.floor(this.PreRotation / 360);
            var Y = this.PreRotation % 360;
            if (R < 0 && Y != 0) {
                R += 1;
            }
            if (x == 0) {
                if (y > 0) {
                    if (Y < 0) {
                        return R * 360 - 270;
                    }
                    else {
                        return R * 360 + 90;
                    }
                }
                else {
                    if (Y < 0) {
                        return R * 360 - 90;
                    }
                    else {
                        return R * 360 + 270;
                    }
                }
            }
            if (y == 0) {
                if (x >= 0) {
                    if (Y > 270) {
                        return R * 360 + 360;
                    }
                    else if (Y < -270) {
                        return R * 360 - 360;
                    }
                    else {
                        return R * 360;
                    }
                }
                else {
                    if (Y > 0) {
                        return R * 360 + 180;
                    }
                    else {
                        return R * 360 - 180;
                    }
                }
            }
            var tanX = y / x;
            var xita = Math.atan(tanX) / Math.PI * 180;
            if (xita > 0) {
                if (Y >= -10 && Y < 100) {
                    return R * 360 + xita;
                }
                else if (Y >= 170 && Y < 280) {
                    return R * 360 + 180 + xita;
                }
                else if (Y > -190 && Y < -80) {
                    return R * 360 - 180 + xita;
                }
                else {
                    return R * 360 - 360 + xita;
                }
            }
            else {
                if (Y > 80 && Y < 190) {
                    return R * 360 + 180 + xita;
                }
                else if (Y > -280 && Y < -170) {
                    return R * 360 - 180 + xita;
                }
                else if ((Y > 260 && Y < 360) || (Y > 0 && Y < 10 && R >= 1)) {
                    return R * 360 + 360 + xita;
                }
                else {
                    return R * 360 + xita;
                }
            }
        };
        return Steering;
    }(eui.Component));
    Game.Steering = Steering;
    egret.registerClass(Steering,'Game.Steering');
})(Game || (Game = {}));
//# sourceMappingURL=Steering.js.map