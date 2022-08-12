import Vue from "vue";
import dayjs from "dayjs";
// ロケールのインポート
import "dayjs/locale/ja";

dayjs.locale("ja");
Vue.prototype.$dayjs = dayjs;
export default dayjs;
