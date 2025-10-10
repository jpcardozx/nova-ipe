"use strict";
/**
 * Testa o conversor HTML → Portable Text
 *
 * Pega 5 properties do Supabase e testa conversão do field_308
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
var supabase_js_1 = require("@supabase/supabase-js");
var html_to_portable_text_1 = require("../lib/utils/html-to-portable-text");
var supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
var supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
var supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey);
function testConverter() {
    return __awaiter(this, void 0, void 0, function () {
        var _a, data, error, _i, data_1, property, htmlDescription, wpId, portableText;
        var _b, _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    console.log('🧪 Testando HTML → Portable Text Converter\n');
                    return [4 /*yield*/, supabase
                            .from('wordpress_properties')
                            .select('id, wp_id, data')
                            .not('data->field_308', 'is', null)
                            .neq('data->field_308', '0')
                            .limit(5)];
                case 1:
                    _a = _f.sent(), data = _a.data, error = _a.error;
                    if (error) {
                        console.error('❌ Erro ao buscar properties:', error);
                        return [2 /*return*/];
                    }
                    if (!data || data.length === 0) {
                        console.log('⚠️  Nenhuma property encontrada');
                        return [2 /*return*/];
                    }
                    console.log("\u2705 ".concat(data.length, " properties encontradas\n"));
                    for (_i = 0, data_1 = data; _i < data_1.length; _i++) {
                        property = data_1[_i];
                        htmlDescription = property.data.field_308;
                        wpId = property.data.ID || property.wp_id;
                        console.log("\n".concat('='.repeat(80)));
                        console.log("\uD83D\uDCC4 Property WP ID: ".concat(wpId));
                        console.log("".concat('='.repeat(80)));
                        console.log('\n📝 HTML Original:');
                        console.log(htmlDescription.substring(0, 300) + (htmlDescription.length > 300 ? '...' : ''));
                        try {
                            portableText = (0, html_to_portable_text_1.convertHtmlToPortableText)(htmlDescription);
                            console.log('\n✅ Portable Text Convertido:');
                            console.log(JSON.stringify(portableText, null, 2).substring(0, 500) + '...');
                            // Estatísticas
                            console.log('\n📊 Estatísticas:');
                            console.log("   - HTML Length: ".concat(htmlDescription.length, " chars"));
                            console.log("   - Blocks: ".concat(portableText.length));
                            console.log("   - Primeiro block: ".concat(((_e = (_d = (_c = (_b = portableText[0]) === null || _b === void 0 ? void 0 : _b.children) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.text) === null || _e === void 0 ? void 0 : _e.substring(0, 100)) || 'N/A', "..."));
                        }
                        catch (error) {
                            console.error('\n❌ Erro na conversão:', error);
                        }
                    }
                    console.log('\n\n✅ Teste finalizado!');
                    return [2 /*return*/];
            }
        });
    });
}
testConverter()
    .then(function () { return process.exit(0); })
    .catch(function (error) {
    console.error('💥 Erro fatal:', error);
    process.exit(1);
});
