"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const AppSettingSchema = new mongoose_1.Schema({
    name: { required: true, unique: true, type: String },
    value: { required: true, type: mongoose_1.Schema.Types.Mixed },
    readonly: { required: true, type: Boolean, default: false }
});
exports.AppSetting = mongoose_1.model("AppSetting", AppSettingSchema);
var SETTINGS;
(function (SETTINGS) {
    SETTINGS["Version"] = "version";
    SETTINGS["DefaultRedirect"] = "default-redirect";
})(SETTINGS = exports.SETTINGS || (exports.SETTINGS = {}));
function getSettings() {
    return __awaiter(this, void 0, void 0, function* () {
        let configs = yield exports.AppSetting.find();
        let result = {};
        for (let config of configs) {
            result[config.name] = config.value;
        }
        return result;
    });
}
exports.getSettings = getSettings;
function initialiseSettings() {
    return __awaiter(this, void 0, void 0, function* () {
        function createSettingIfNotExists(name, defaultValue) {
            return __awaiter(this, void 0, void 0, function* () {
                let setting = yield exports.AppSetting.findOne({ name });
                if (!setting) {
                    setting = new exports.AppSetting({ name, value: defaultValue });
                    yield setting.save();
                }
            });
        }
        yield createSettingIfNotExists(SETTINGS.DefaultRedirect, "madmin");
    });
}
exports.initialiseSettings = initialiseSettings;
//# sourceMappingURL=d:/Documents/Projects/js/madmin/server/dist/models/app-setting.js.map