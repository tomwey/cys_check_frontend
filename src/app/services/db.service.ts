import { Injectable } from '@angular/core';
import { Utils } from './Utils';

@Injectable({
  providedIn: 'root'
})
export class DbService {

  db: any;
  hasCreatedDB = false;
  constructor() { }

  getDBName() {
    let dbname = localStorage.getItem('db.name');
    if (!dbname) {
      dbname = `qms_${+new Date()}`;
      localStorage.setItem('db.name', dbname);
    }
    return dbname;
  }

  createDB() {
    return new Promise((resolve, reject) => {
      if (this.db) {
        resolve(this.db);
        return;
      }

      const idb = window.indexedDB;

      if (!idb) {
        reject('暂不支持数据缓存');
        return;
      }

      // const version = localStorage.getItem('db.version') ? parseInt(localStorage.getItem('db.version')) + 1 : 1;
      console.log('open db');
      const request = idb.open(this.getDBName(), 3);
      request.onerror = (e) => {
        console.log(e);
        reject(e.target['error'].message);
      };

      request.onsuccess = (e) => {
        this.db = request.result;
        // console.log(1234);
        // localStorage.setItem('db.version', this.db.version);
        this.clearTable('check_itemlist');
        resolve(this.db);
      };

      request.onupgradeneeded = (e) => {
        console.log(2121);

        this.db = request.result;

        if (!this.db.objectStoreNames.contains('add_que')) {
          const table = this.db.createObjectStore('add_que', { keyPath: 'addque_id', autoIncrement: true });
          table.createIndex('check_limit', ['check_type', 'rect_limit'], { unique: false });
        }

        if (!this.db.objectStoreNames.contains('que_list')) {
          const table = this.db.createObjectStore('que_list', { keyPath: 'que_id', autoIncrement: true });
          // 一种条件
          table.createIndex('istate', 'istate', { unique: false }); // 状态
          table.createIndex('checkup_id', 'checkup_id', { unique: false }); // 检查类型
          table.createIndex('level_id', 'level_id', { unique: false }); // 紧急程度
          table.createIndex('time', 'reg_date', { unique: false }); // 抽查日期

          // // 两种条件
          // table.createIndex('check_state', ['checkup_id', 'istate'], { unique: false });
          // table.createIndex('check_level', ['checkup_id', 'level_id'], { unique: false });
          // table.createIndex('check_time', ['checkup_id', 'reg_date'], { unique: false });
          // table.createIndex('state_level', ['istate', 'level_id'], { unique: false });
          // table.createIndex('state_time', ['checkup_id', 'reg_date'], { unique: false });
          // table.createIndex('level_time', ['level_id', 'reg_date'], { unique: false });

          // // 三种条件
          // table.createIndex('check_state_level', ['checkup_id', 'istate', 'level_id'], { unique: false });
          // table.createIndex('check_state_time', ['checkup_id', 'istate', 'reg_date'], { unique: false });
          // table.createIndex('check_level_time', ['checkup_id', 'level_id', 'reg_date'], { unique: false });
          // table.createIndex('state_level_time', ['istate', 'level_id', 'reg_date'], { unique: false });

          // // 四种条件
          // table.createIndex('check_state_level_time', ['checkup_id', 'istate', 'level_id', 'reg_date'], { unique: false });
        }
        // 问题附件
        if (!this.db.objectStoreNames.contains('que_list_annexs')) {
          const table = this.db.createObjectStore('que_list_annexs', { keyPath: 'que_annex_id', autoIncrement: true });
          table.createIndex('IdAndType', ['problem_id', 'annex_type'], { unique: false });
          table.createIndex('TableAndType', ['table_id', 'annex_type'], { unique: false });
          table.createIndex('ID', 'annex_id', { unique: false });
        }
        // 问题处理记录
        if (!this.db.objectStoreNames.contains('que_list_record')) {
          const table = this.db.createObjectStore('que_list_record', { keyPath: 'que_record_id', autoIncrement: true });
          table.createIndex('problemId', 'problem_id', { unique: false });
        }
        // 问题合约类别
        if (!this.db.objectStoreNames.contains('que_list_contracttype')) {
          const table = this.db.createObjectStore('que_list_contracttype', { keyPath: 'que_contracttype_id', autoIncrement: true });
        }
        // 问题紧急程度
        if (!this.db.objectStoreNames.contains('que_level_list')) {
          const table = this.db.createObjectStore('que_level_list', { keyPath: 'que_level_id', autoIncrement: true });
        }

        // 大任务
        if (!this.db.objectStoreNames.contains('task_list_1')) {
          const table = this.db.createObjectStore('task_list_1', { keyPath: 'task_1_id', autoIncrement: true });
          table.createIndex('isUpdate', 'isupdate', { unique: false });
          table.createIndex('iscomplete', 'iscomplete', { unique: false });
          table.createIndex('type_complete', ['checkup_id', 'iscomplete'], { unique: false });
        }
        // 任务对象
        if (!this.db.objectStoreNames.contains('task_list_2')) {
          const table = this.db.createObjectStore('task_list_2', { keyPath: 'task_2_id', autoIncrement: true });
          table.createIndex('planMid', 'plan_mid', { unique: false });
          table.createIndex('isUpdate', 'isupdate', { unique: false });
          // table.createIndex('objectType', ['object_type'], { unique: false });
          // table.createIndex('parId', ['tree_parid'], { unique: false });
          table.createIndex('type_isfq', ['object_type', 'is_fq', 'plan_mid'], { unique: false });
          table.createIndex('parid_isfq', ['tree_parid', 'is_fq', 'plan_mid'], { unique: false });
        }
        // 任务检查项
        if (!this.db.objectStoreNames.contains('task_list_3')) {
          const table = this.db.createObjectStore('task_list_3', { keyPath: 'task_3_id', autoIncrement: true });
          table.createIndex('planDid', 'plan_did', { unique: false });
          table.createIndex('positionName', 'position_name', { unique: false });
          table.createIndex('isUpdate', 'isupdate', { unique: false });
        }
        // 该表就包含了楼栋或区域，单元，楼层，房间号或部位等
        if (!this.db.objectStoreNames.contains('project_tree')) {
          const table = this.db.createObjectStore('project_tree', { keyPath: 'tree_id', autoIncrement: true });
          // table.createIndex('objecttype', 'object_type', { unique: false });
          // table.createIndex('parid', 'tree_parid', { unique: false });
          table.createIndex('type_isfq', ['object_type', 'is_fq'], { unique: false });
          table.createIndex('parid_isfq', ['tree_parid', 'is_fq'], { unique: false });
          // table.createIndex('parid_isfq_check', ['tree_parid', 'is_fq', 'ischeck'], { unique: false });
        }

        // 该表到房间后的部位列表
        if (!this.db.objectStoreNames.contains('list_inhouse')) {
          const table = this.db.createObjectStore('list_inhouse', { keyPath: 'listinhouse_id', autoIncrement: true });
          table.createIndex('objtypename', 'objecttype_name', { unique: false });
        }

        // 检查项列表
        if (!this.db.objectStoreNames.contains('check_itemlist')) {
          const table = this.db.createObjectStore('check_itemlist', { keyPath: 'item_id', autoIncrement: true });
          // table.createIndex('checkup_position', ['checkup_id', 'position_id'], { unique: false });
          table.createIndex('checkup_position', ['checkup_id', 'pro_position_id'], { unique: false });
        }
        // 检查项列表_new
        if (!this.db.objectStoreNames.contains('check_itemlist_new')) {
          const table = this.db.createObjectStore('check_itemlist_new', { keyPath: 'item_new_id', autoIncrement: true });

          table.createIndex('checkup_position_type', ['checkup_id', 'position_id', 'template_type'], { unique: false });
        }

        // 检查类型列表
        if (!this.db.objectStoreNames.contains('check_typelist')) {
          this.db.createObjectStore('check_typelist', { keyPath: 'dic_id', autoIncrement: false });
        }
        // 问题分类及问题检查项表
        if (!this.db.objectStoreNames.contains('que_type_item')) {
          const table = this.db.createObjectStore('que_type_item', { keyPath: 'que_type_item_id', autoIncrement: true });
          table.createIndex('position_id', ['position_id'], { unique: false });
        }
        // 问题分类及问题检查项表
        if (!this.db.objectStoreNames.contains('que_type_item')) {
          const table = this.db.createObjectStore('que_type_item', { keyPath: 'que_type_item_id', autoIncrement: true });
          table.createIndex('position_id', ['position_id'], { unique: false });
        }
        // 账户人员表
        if (!this.db.objectStoreNames.contains('account_list')) {
          const table = this.db.createObjectStore('account_list', { keyPath: 'account_id', autoIncrement: true });
          table.createIndex('accountType', 'accounttype', { unique: false });
          table.createIndex('companyName', 'companyname', { unique: false });
          table.createIndex('contractTypeId', 'contracttypeid', { unique: false });
          table.createIndex('contractId', 'contractid', { unique: false });
        }
        // 账户类型表
        if (!this.db.objectStoreNames.contains('accounttype_list')) {
          const table = this.db.createObjectStore('accounttype_list', { keyPath: 'accounttype_id', autoIncrement: true });
        }
        // 问题原因
        if (!this.db.objectStoreNames.contains('que_reason_list')) {
          const table = this.db.createObjectStore('que_reason_list', { keyPath: 'que_reason_id', autoIncrement: true });
        }
        // 超期原因
        if (!this.db.objectStoreNames.contains('que_overdue_reason_list')) {
          const table = this.db.createObjectStore('que_overdue_reason_list', { keyPath: 'que_overdue_reason_id', autoIncrement: true });
        }
        // 整改登记表
        if (!this.db.objectStoreNames.contains('rect_register_list')) {
          const table = this.db.createObjectStore('rect_register_list', { keyPath: 'rect_register_id', autoIncrement: true });
        }
        // 整改反馈表
        if (!this.db.objectStoreNames.contains('rect_feedback_list')) {
          const table = this.db.createObjectStore('rect_feedback_list', { keyPath: 'rect_feedback_id', autoIncrement: true });
        }
        // 整改催办表
        if (!this.db.objectStoreNames.contains('rect_urge_list')) {
          const table = this.db.createObjectStore('rect_urge_list', { keyPath: 'rect_urge_id', autoIncrement: true });
        }
        // 整改验收表
        if (!this.db.objectStoreNames.contains('rect_accept_list')) {
          const table = this.db.createObjectStore('rect_accept_list', { keyPath: 'rect_accept_id', autoIncrement: true });
        }
        // 获取分类检查项
        if (!this.db.objectStoreNames.contains('check_type_list')) {
          const table = this.db.createObjectStore('check_type_list', { keyPath: 'check_type_id', autoIncrement: true });
          table.createIndex('parIdCheckType', ['tree_parid', 'checkup_id'], { unique: false });
        }
        // 问题清单登记人高级搜索
        if (!this.db.objectStoreNames.contains('search_que_man_list')) {
          const table = this.db.createObjectStore('search_que_man_list', { keyPath: 'search_que_man_id', autoIncrement: true });
          table.createIndex('manname', 'manname', { unique: false });
        }
        // 问题清单合约高级搜索
        if (!this.db.objectStoreNames.contains('search_que_con_list')) {
          const table = this.db.createObjectStore('search_que_con_list', { keyPath: 'search_que_con_id', autoIncrement: true });
          table.createIndex('conname', 'conname', { unique: false });
        }
        // 问题清单楼栋高级搜索
        if (!this.db.objectStoreNames.contains('search_que_building_list')) {
          const table = this.db.createObjectStore('search_que_building_list', { keyPath: 'search_que_building_name', autoIncrement: true });
          table.createIndex('roomname', 'roomname', { unique: false });
        }
        console.log(555);
      };
    });
  }

  initDB() {
    // if (this.db) {
    //   this.db.close();
    // }

    return this.createDB();
  }

  closeDB() {
    console.log('关闭数据库：' + this.db);
    if (this.db) {
      this.db.close();
    }
  }

  deleteDB() {
    console.log('删除数据库：', this.db);
    window.indexedDB.deleteDatabase(this.getDBName());
    localStorage.removeItem('db.name');
    this.db = null;
  }

  clearTable(tableName) {
    console.log('清除表：' + tableName);
    const table = this.db.transaction([tableName], 'readwrite')
      .objectStore(tableName);
    table.clear();
  }

  insert(tableName, values: Array<object>, callback, needClearTable = false) {
    const table = this.db.transaction([tableName], 'readwrite')
      .objectStore(tableName);
    if (needClearTable) {
      table.clear();
    }

    console.log('插入数据：' + tableName);

    // const temp = [];
    // const promises = []


    let con_list = [];
    let man_list = [];
    let build_list = [];

    // let con_set = new Set();
    // let man_set = new Set();
    // let build_set = new Set();
    let counter = 0;
    values.forEach(obj => {
      if (tableName === 'que_list') { // 如果是问题清单，则需要从中抽取楼栋、合同、登记人信息用于高级搜索
        const queBean = Object.assign({}, obj);
        con_list.push({ conid: queBean['contracttypeid'], conname: queBean['contracttypename'] });
        man_list.push({ manid: queBean['reg_manid'], manname: queBean['reg_manname'] });
        build_list.push({ roomname: queBean['roomname'] });
      }

      const result = table.add(obj);
      result.onsuccess = (e) => {
        // temp.push(obj);
        counter++;
        if (counter === values.length) {
          if (callback) {
            callback();
          }
        }
        // resolve();
      };
      result.onerror = (e) => {
        // reject();
        counter++;
        if (counter === values.length) {
          if (callback) {
            callback();
          }
        }
      };

      // promises.push(promise);
    });
    if (tableName === 'que_list') {
      console.log(con_list);
      console.log(man_list);
      console.log(build_list);
      const con_table = this.db.transaction('search_que_con_list', 'readwrite')
        .objectStore('search_que_con_list');
      con_table.clear();

      const man_table = this.db.transaction('search_que_man_list', 'readwrite')
        .objectStore('search_que_man_list');
      man_table.clear();

      const build_table = this.db.transaction('search_que_building_list', 'readwrite')
        .objectStore('search_que_building_list');
      build_table.clear();
      con_list.sort((a, b) => a.conname > b.conname ? 1 : -1);
      man_list.sort((a, b) => a.manname > b.manname ? 1 : -1);
      build_list.sort((a, b) => a.roomname > b.roomname ? 1 : -1);
      Utils.unique_conid(con_list).forEach(con => {
        con_table.add(con);
      });
      Utils.unique_manid(man_list).forEach(man => {
        man_table.add(man);
      });
      Utils.unique_roomname(build_list).forEach(build => {
        build_table.add(build);
      });
    }

    // Promise.all(promises).then(() => {
    //   if (callback) {
    //     callback(temp);
    //   }
    // });
  }

  delete(tableName, ids = [], callback) {

    const req = this.db.transaction([tableName], 'readwrite');
    const store = req.objectStore(tableName);

    const promises = [];
    const tempIDs = [];
    ids.forEach(id => {
      const result = store.delete(id);

      const promise = new Promise((resolve, reject) => {
        result.onsuccess = (e) => {
          tempIDs.push(id);
          // resolve();
        };
        result.onerror = (e) => {
          // reject();
        };
      });

      promises.push(promise);
    });

    Promise.all(promises).then(() => {
      if (callback) {
        callback(tempIDs);
      }
    });
  }

  update(tableName, objects = [], callback) {
    const table = this.db.transaction([tableName], 'readwrite')
      .objectStore(tableName);

    const temp = [];
    // const promises = [];

    let counter = 0;
    objects.forEach(obj => {
      const result = table.put(obj);
      result.onsuccess = (e) => {
        // console.log(1111);
        // temp.push(obj);
        counter++;
        if (counter === objects.length) {
          if (callback) {
            callback();
          }
        }
        // resolve();
      };
      result.onerror = (e) => {
        // reject();
      };
    });

    // console.log(promises);
    // Promise.all(promises).then(() => {
    //   console.log(234);
    //   if (callback) {
    //     callback(temp);
    //   }
    // }).catch(error => {
    //   console.log('ee');
    // });
  }

  // [{ k: 'name', op: '=', v: 'test' }, {}]
  select(tableName, condVals = [], orderVals = {}, callback = null) {
    // console.log(this.db);
    console.log(tableName);
    const table = this.db.transaction([tableName], 'readwrite')
      .objectStore(tableName);

    if (condVals.length === 0) {
      const temp = [];
      table.openCursor().onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          // console.log(cursor.value);
          temp.push(cursor.value);
          cursor.continue();
        } else {
          if (callback) {
            callback(temp);
          }
        }
      };
    } else {
      // IDBKeyRange.only(); { key: 'name', op: '', value: 123 }
      // const keyRange = IDBKeyRange.bound(condVals);

    }
  }

  // getProjectTree(type, treeMid = null, dataType = 0, callback) {
  //   // console.info(type, childType);
  //   if (type == '1') {
  //     if (dataType == 0) {
  //       this.getSingleCondData('project_tree', 'type_isfq', ['楼栋', '0'], callback);
  //     } else {
  //       this.getSingleCondData('project_tree', 'type_isfq', ['分区', '1'], callback);
  //     }

  //   } else {
  //     // console.log(1);
  //     if (dataType == 0) {
  //       this.getSingleCondData('project_tree', 'parid_isfq', [treeMid, dataType.toString()], callback);
  //     } else {
  //       // 分区
  //       // console.log(121);
  //       // console.log(childType);
  //       this.getSingleCondData('project_tree', 'type_isfq', ['部位分类', dataType.toString()], callback);
  //     }
  //   }
  // }

  getBuildings(type, treeMid = null, dataType = 0, callback, fromType, planMid) {
    const tableName = fromType === '0' ? 'project_tree' : 'task_list_2';
    // console.info(type, childType);
    if (type == '1') { // 取楼栋
      if (dataType == 0) { // 按楼栋
        if (fromType === '0') {
          this.getSingleCondData(tableName, 'type_isfq', ['楼栋', '0'], callback);
        } else {
          this.getSingleCondData(tableName, 'type_isfq', ['楼栋', '0', planMid], callback);
        }
      } else {
        if (fromType === '0') {
          this.getSingleCondData(tableName, 'type_isfq', ['分区', '1'], callback);
        } else {
          this.getSingleCondData(tableName, 'type_isfq', ['分区', '1', planMid], callback);
        }
      }

    } else { // 取单元/楼层
      // console.log(1);
      if (dataType == 0) { // 按楼栋
        if (fromType === '0') {
          this.getSingleCondData(tableName, 'parid_isfq', [treeMid, dataType.toString()], callback);
        } else {
          this.getSingleCondData(tableName, 'parid_isfq', [treeMid, dataType.toString(), planMid], callback);
        }

      } else { // 按分区
        // 分区
        if (fromType === '0') {
          this.getSingleCondData(tableName, 'parid_isfq', [treeMid, dataType.toString()], callback);
        } else {
          this.getSingleCondData(tableName, 'parid_isfq', [treeMid, dataType.toString(), planMid], callback);
        }

        // console.log(121);
        // console.log(childType);
        // if (fromType === '0') {
        //   this.getSingleCondData(tableName, 'type_isfq', ['部位分类', dataType.toString()], callback);
        // } else {
        //   this.getSingleCondData(tableName, 'type_isfq', ['部位分类', dataType.toString(), planMid], callback);
        // }
      }
    }
  }

  getListInhouse(planDid, cb) {
    this.getSingleCondData('task_list_3', 'planDid', planDid, cb);
  }

  getPartialsInHouse(checkupID, posID, cb) {
    this.getSingleCondData('check_itemlist', 'checkup_position', [checkupID, posID], cb);
  }

  getPartialsInHouse2(templateType, checkupID, posID, cb) {
    this.getSingleCondData('check_itemlist_new', 'checkup_position_type', [checkupID, posID, templateType], cb);
  }

  getSingleCondData(tableName, indexName, param, cb) {
    console.info(tableName, '-', indexName, '-', param);
    const table = this.db.transaction([tableName], 'readwrite')
      .objectStore(tableName);

    const objIndex = table.index(indexName);

    const keyRange = IDBKeyRange.only(param);

    const req = objIndex.openCursor(keyRange);
    req.onerror = (e) => {
      console.log(e.target.error.message);
      if (cb) {
        cb(null);
      }
    };
    const temp = [];
    req.onsuccess = (e) => {
      const cursor = e.target.result;
      if (cursor) {
        temp.push(cursor.value);
        cursor.continue();
        // console.log(cursor.value);
      } else {
        if (cb) {
          cb(temp);
        }
      }
    };
  }

  disposeDB() {
    return new Promise((resolve) => {
      this.db.close();
      window.indexedDB.deleteDatabase(this.getDBName());
      resolve();
    });

  }
}
