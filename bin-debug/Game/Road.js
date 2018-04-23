var Game;
(function (Game) {
    /**
     *
     * @author
     *
     */
    var Road = (function (_super) {
        __extends(Road, _super);
        function Road() {
            _super.call(this);
            this.skinName = "Game.RoadSkin";
        }
        var d = __define,c=Road,p=c.prototype;
        p.changeBackGround = function (type) {
            this.background.source = "background" + type;
        };
        return Road;
    }(eui.Component));
    Game.Road = Road;
    egret.registerClass(Road,'Game.Road');
})(Game || (Game = {}));
//# sourceMappingURL=Road.js.map