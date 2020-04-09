import { Injectable } from '@angular/core';
import { Md5 } from 'ts-md5';
import * as CryptoJS from 'crypto-js';

declare const Buffer;

const fillKey = (key) => {
  const filledKey = Buffer.alloc(128 / 8);
  const keys = Buffer.from(key);
  let index = 0;
  while (index < filledKey.length) {
    filledKey[index] = keys[index];
    index += 1;
  }

  return filledKey;
};

@Injectable()
export class Utils {

  static params: any = null;
  /**
   * 获取地址栏参数
   * @param name 参数名字
   * @returns 返回
   */
  static getQueryString(name): string {
    if (!this.params) {
      const encrypted = this._getQueryString('key');

      if (encrypted) {
        const result = this.aesDecrypt(encrypted, 'HN_GroupAES_2018');
        this.params = JSON.parse(result);
      }
      // console.log('解析参数');
    } else {
      // console.info('params:', this.params);
      // console.log('参数已经解析');
    }

    if (!this.params) {
      return this._getQueryString(name);
    }

    return this.params[name];
  }

  // 一个去重函数
  static unique(arr) {
    return Array.from(new Set(arr));
  }
  // 根据对象的某个属性去重
  static unique_manid(arr) {
    const res = new Map();
    return arr.filter((a) => !res.has(a.manid) && res.set(a.manid, 1));
  }
  // 根据对象的某个属性去重
  static unique_conid(arr) {
    const res = new Map();
    return arr.filter((a) => !res.has(a.conid) && res.set(a.conid, 1));
  }
  // 根据对象的某个属性去重
  static unique_roomname(arr) {
    const res = new Map();
    return arr.filter((a) => !res.has(a.roomname) && res.set(a.roomname, 1));
  }
  static getManID(): string {
    return this._getQueryString('manid') || '1692252'; // 217  1380
  }
  static getManName(): string {
    return localStorage.getItem('manname');
  }
  static _getQueryString(name): string {
    const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    const url = decodeURIComponent(window.location.search);
    // let r = window.location.search.substr(1).match(reg);
    const r = url.substr(1).match(reg);
    if (r != null) {
      return r[2]; // 解码参数值
    }
    return '';
  }

  static getRandomString(len): string {
    len = len || 32;
    const $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
    const maxPos = $chars.length;
    let pwd = '';
    for (let i = 0; i < len; i++) {
      pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
  }

  static md5(str: string): string {
    return Md5.hashStr(str, false).toString();
  }

  static isWeiXin(): boolean {
    const ua = window.navigator.userAgent.toLowerCase();
    const results: RegExpMatchArray = ua.match(/MicroMessenger/i);
    if (results && results.toString() === 'micromessenger') {
      return true;
    } else {
      return false;
    }
  }

  /**
   * 日期对象转为日期字符串
   * @param date 需要格式化的日期对象
   * @param sFormat 输出格式,默认为yyyy-MM-dd                        年：y，月：M，日：d，时：h，分：m，秒：s
   * @example  dateFormat(new Date())                               "2017-02-28"
   * @example  dateFormat(new Date(),'yyyy-MM-dd')                  "2017-02-28"
   * @example  dateFormat(new Date(),'yyyy-MM-dd HH:mm:ss')         "2017-02-28 13:24:00"   ps:HH:24小时制
   * @example  dateFormat(new Date(),'yyyy-MM-dd hh:mm:ss')         "2017-02-28 01:24:00"   ps:hh:12小时制
   * @example  dateFormat(new Date(),'hh:mm')                       "09:24"
   * @example  dateFormat(new Date(),'yyyy-MM-ddTHH:mm:ss+08:00')   "2017-02-28T13:24:00+08:00"
   * @example  dateFormat(new Date('2017-02-28 13:24:00'),'yyyy-MM-ddTHH:mm:ss+08:00')   "2017-02-28T13:24:00+08:00"
   * @returns 返回
   */
  static dateFormat(date: Date, sFormat: string = 'yyyy-MM-dd'): string {
    const time = {
      Year: 0,
      TYear: '0',
      Month: 0,
      TMonth: '0',
      Day: 0,
      TDay: '0',
      Hour: 0,
      THour: '0',
      hour: 0,
      Thour: '0',
      Minute: 0,
      TMinute: '0',
      Second: 0,
      TSecond: '0',
      Millisecond: 0
    };
    time.Year = date.getFullYear();
    time.TYear = String(time.Year).substr(2);
    time.Month = date.getMonth() + 1;
    time.TMonth = time.Month < 10 ? '0' + time.Month : String(time.Month);
    time.Day = date.getDate();
    time.TDay = time.Day < 10 ? '0' + time.Day : String(time.Day);
    time.Hour = date.getHours();
    time.THour = time.Hour < 10 ? '0' + time.Hour : String(time.Hour);
    time.hour = time.Hour < 13 ? time.Hour : time.Hour - 12;
    time.Thour = time.hour < 10 ? '0' + time.hour : String(time.hour);
    time.Minute = date.getMinutes();
    time.TMinute = time.Minute < 10 ? '0' + time.Minute : String(time.Minute);
    time.Second = date.getSeconds();
    time.TSecond = time.Second < 10 ? '0' + time.Second : String(time.Second);
    time.Millisecond = date.getMilliseconds();

    return sFormat.replace(/yyyy/ig, String(time.Year))
      .replace(/yyy/ig, String(time.Year))
      .replace(/yy/ig, time.TYear)
      .replace(/y/ig, time.TYear)
      .replace(/MM/g, time.TMonth)
      .replace(/M/g, String(time.Month))
      .replace(/dd/ig, time.TDay)
      .replace(/d/ig, String(time.Day))
      .replace(/HH/g, time.THour)
      .replace(/H/g, String(time.Hour))
      .replace(/hh/g, time.Thour)
      .replace(/h/g, String(time.hour))
      .replace(/mm/g, time.TMinute)
      .replace(/m/g, String(time.Minute))
      .replace(/ss/ig, time.TSecond)
      .replace(/s/ig, String(time.Second))
      .replace(/fff/ig, String(time.Millisecond));
  }

  static dateDiff(date) {// di作为一个变量传进来
    // 如果时间格式是正确的，那下面这一步转化时间格式就可以不用了
    const dateBegin = new Date(date.replace(/-/g, '/')); // 将-转化为/，使用new Date
    const dateEnd = new Date(); // 获取当前时间
    const dateDiff = dateBegin.getTime() - dateEnd.getTime(); // 时间差的毫秒数
    const dayDiff = Math.floor(dateDiff / (24 * 3600 * 1000)); // 计算出相差天数
    const leave1 = dateDiff % (24 * 3600 * 1000);    // 计算天数后剩余的毫秒数
    const hours = Math.floor(leave1 / (3600 * 1000)); // 计算出小时数
    // 计算相差分钟数
    const leave2 = leave1 % (3600 * 1000);    // 计算小时数后剩余的毫秒数
    const minutes = Math.floor(leave2 / (60 * 1000)); // 计算相差分钟数
    // 计算相差秒数
    const leave3 = leave2 % (60 * 1000);      // 计算分钟数后剩余的毫秒数
    const seconds = Math.round(leave3 / 1000);
    return { days: dayDiff, hours, minutes, seconds, mseconds: dateDiff };
  }

  static formatMoney(money) {
    if (money && money != null) {
      money = String(money);
      const left = money.split('.')[0];
      let right = money.split('.')[1];
      right = right ? (right.length >= 2 ? '.' + right.substr(0, 2) : '.' + right + '0') : '.00';
      const temp = left.split('').reverse().join('').match(/(\d{1,3})/g);
      return (Number(money) < 0 ? '-' : '') + temp.join(',').split('').reverse().join('') + right;
    } else if (money === 0) {   // 注意===在这里的使用，如果传入的money为0,if中会将其判定为boolean类型，故而要另外做===判断
      return '0.00';
    } else {
      return '';
    }
  }

  static aesEncrypt(str: string, key) {
    if (!str || !key) { return null; }
    key = CryptoJS.enc.Utf8.parse(fillKey(key));
    return CryptoJS.AES.encrypt(str, key, {
      iv: '',
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    }).ciphertext.toString();
  }

  static aesDecrypt(str: string, key) {
    if (!str || !key) { return null; }
    // console.log(CryptoJS.enc);
    key = CryptoJS.enc.Utf8.parse(fillKey(key));
    const bytes = CryptoJS.AES.decrypt(CryptoJS.enc.Base64.stringify(CryptoJS.enc.Hex.parse(str)), key, {
      iv: '',
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    });
    return bytes.toString(CryptoJS.enc.Utf8);
  }
  static getNowFormatDate() {//获取当前时间  精确到分
    const date = new Date();
    let seperator1 = '-';
    let seperator2 = ':';
    let month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
    let strDate = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    let currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
      + ' ' + date.getHours() + seperator2 + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
    // + seperator2 + date.getSeconds();
    return currentdate;
  }
  // 判断字符是否为空的方法
  static isEmpty(obj) {
    if (typeof obj === undefined || obj === null || obj === '') {
      return true;
    } else {
      return false;
    }
  }
}
