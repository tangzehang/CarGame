var Game;
(function (Game) {
    /**
     *
     * @author
     *
     */
    var Warning = (function (_super) {
        __extends(Warning, _super);
        function Warning() {
            _super.call(this);
            this.skinName = "Game.WarningSkin";
        }
        var d = __define,c=Warning,p=c.prototype;
        p.childrenCreated = function () {
            _super.prototype.childrenCreated.call(this);
            this.Confirm.name = "warning";
            //this.Confirm.addEventListener(egret.TouchEvent.TOUCH_TAP,this.confirmFunction,this);
        };
        p.confirmFunction = function () {
            this.parent.removeChild(this);
        };
        return Warning;
    }(eui.Component));
    Game.Warning = Warning;
    egret.registerClass(Warning,'Game.Warning');
})(Game || (Game = {}));
//# sourceMappingURL=Warning.js.map