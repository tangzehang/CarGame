var Game;
(function (Game) {
    /**
     *
     * @author
     *
     */
    var Car = (function (_super) {
        __extends(Car, _super);
        function Car() {
            _super.call(this);
            this.skinName = "Game.CarSkin";
        }
        var d = __define,c=Car,p=c.prototype;
        p.childrenCreated = function () {
            _super.prototype.childrenCreated.call(this);
            this.allGroup.y = -150;
        };
        p.changeWay = function (leftFlag) {
            if (leftFlag) {
                this.allGroup.x = 0;
            }
            else {
                this.allGroup.x = -70;
            }
        };
        return Car;
    }(eui.Component));
    Game.Car = Car;
    egret.registerClass(Car,'Game.Car');
})(Game || (Game = {}));
//# sourceMappingURL=Car.js.map