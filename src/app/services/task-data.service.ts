import { Injectable } from '@angular/core';
import { DbService } from './db.service';
import { ApiService, ResultData } from './api.service';
import { TASK_LIST_1, ACCOUNT_TYPE_LIST, ACCOUNT_LIST, CHECK_TYPE_LIST } from './sync.service';
import { ToolsService } from './tools.service';

@Injectable({
  providedIn: 'root'
})
export class TaskDataService {

  constructor(private db: DbService, private api: ApiService, private tools: ToolsService) {
    // this.db.initDB();
  }

  /**
   * 获取质检任务
   * @param type 任务类型，0 表示待办 1 表示已办
   * @param callback 回调函数，返回任务数据
   */
  getTasks(type, isComplete, callback, loading = true) {
    if (loading) {
      this.tools.showLoading();
    }
    if (type !== 60 && type !== 70) {
      this.db.initDB().then(() => {
        this.db.getSingleCondData(TASK_LIST_1, 'iscomplete', isComplete.toString(), (res) => {
          if (callback) {
            callback(res);
          }
          this.tools.hideLoading();
        });
      });
    } else {
      this.db.initDB().then(() => {
        this.db.getSingleCondData(TASK_LIST_1, 'type_complete', [type.toString(), isComplete.toString()], (res) => {
          if (callback) {
            callback(res);
          }
          this.tools.hideLoading();
        });
      });
    }

  }

  /**
   * 获取楼栋
   * @param cb 回调函数
   */
  getBuildings(type = 0, cb, fromType = '0', planMid = '') {
    this.db.initDB()
      .then(() => {
        this.db.getBuildings('1', null, type, cb, fromType, planMid);
      });
  }

  confirmDone(task, cb) {
    const param = Object.assign({}, task);
    param.iscomplete = '1';
    param.isupdate = '1';
    this.db.initDB()
      .then(() => {
        this.db.update(TASK_LIST_1, [param], (res) => {
          task.iscomplete = '1';
          // console.log(123);
          if (cb) {
            cb();
          }
        });
      });
  }

  /**
   * 获取单元
   */
  getUnits(type, treeMid, cb, fromType, planMid = '') {
    // if (this._getBiz().mode === '0') {
    this.db.initDB()
      .then(() => {
        this.db.getBuildings('0', treeMid, type, cb, fromType, planMid);
      });
    // } else {

    // }
  }

  /**
   * 获取楼层以及房间数据
   */
  getFloors(type, treeMid, cb, fromType, planMid = '') {
    this.db.initDB()
      .then(() => {
        this.db.getBuildings('0', treeMid, type, (res) => {
          // const rooms = [];
          res.forEach(floor => {
            this.db.getBuildings('0', floor.tree_mid, type, (res2) => {
              // floor.rooms = res2;
              res2.sort((a, b) => {
                // tslint:disable-next-line:radix
                return parseInt(a.iorder) - parseInt(b.iorder);
              });
              floor.rooms = res2;
            }, fromType, planMid);
          });
          if (cb) {
            cb(res);
          }
        }, fromType, planMid);
      });
  }

  getFloors2(type, treeMid, cb, fromType, planMid = '', isAll = true) {
    this.db.initDB()
      .then(() => {
        this.db.getBuildings('0', treeMid, type, (res) => {
          // const rooms = [];
          const floors = [];
          res.forEach(floor => {
            this.db.getBuildings('0', floor.tree_mid, type, (res2) => {
              // floor.rooms = res2;
              let arr = [];
              if (isAll) {
                arr = res2;
              } else {
                arr = res2.filter(r => {
                  return r.state_desc !== '完成';
                });
              }
              arr.sort((a, b) => {
                // tslint:disable-next-line:radix
                return parseInt(a.iorder) - parseInt(b.iorder);
              });
              floor.rooms = arr;
              // if (floor.rooms.length > 0) {
              //   floors.push(floor);
              // }
            }, fromType, planMid);
          });
          if (cb) {
            cb(res);
          }
        }, fromType, planMid);
      });
  }

  /**
   * 获取某个房间下面的检查部位和检查项
   */
  getListInHouse(checkupID, objTypeName, cb) {
    this.db.initDB().then(() => {
      this.db.getListInhouse(objTypeName, (res) => {
        // console.log(res);
        // res.forEach(ele => {
        //   // console.log(ele);
        //   this.db.getPartialsInHouse(checkupID, ele.position_id, (r2) => {
        //     ele.check_items = r2;
        //   });
        // });
        if (cb) {
          cb(res);
        }
      });
    });
  }

  getListInHouse2(templateType, checkupID, objectTypeName, cb) {
    this.db.initDB().then(() => {
      this.db.getSingleCondData('list_inhouse', 'objtypename', objectTypeName, (res) => {
        res.forEach(ele => {
          this.db.getPartialsInHouse2(templateType, checkupID, ele.position_id, (r2) => {
            console.log(r2);
            const temp = [];
            const temp2 = {};
            const qaTypes = [];
            r2.forEach(item => {
              if (item.template_type === templateType) {
                const key = `${item.qatype_name}|${item.qatype_id}`;
                if (temp.indexOf(key) === -1) {
                  temp.push(key);
                  qaTypes.push({ qatype_id: item.qatype_id, qatype_name: item.qatype_name });
                }
                const arr = temp2[key] || [];
                // item['obj_name1'] = item['obj_name'] + ' / ' + ele.position_name;
                item['pro_position_id'] = ele.pro_position_id;
                arr.push(item);

                temp2[key] = arr;
              }
            });
            ele.check_items = qaTypes;
            ele.type_items = temp2;
          });
        });
        if (cb) {
          cb(res);
        }
      });
    });
  }

  getAccountTypes(cb) {
    this.db.initDB().then(() => {
      this.db.select(ACCOUNT_TYPE_LIST, [], {}, (res) => {
        // console.log(res);
        if (cb) {
          cb(res);
        }
      });
    });
  }

  getCheckTypes(cb) {
    this.db.initDB().then(() => {
      this.db.select(CHECK_TYPE_LIST, [], {}, (res) => {
        // console.log(res);
        if (cb) {
          cb(res);
        }
      });
    });
  }

  getTypeCompanies(typename, cb) {
    this.db.initDB().then(() => {
      this.db.getSingleCondData(ACCOUNT_LIST, 'accountType', typename, (res) => {
        // console.log(res);
        const comps = [];
        const temp = [];
        res.forEach(ele => {
          if (comps.indexOf(ele.companyname) === -1) {
            comps.push(ele.companyname);
            temp.push({ name: ele.companyname, rawData: ele });
          }
        });

        if (cb) {
          cb(temp);
        }
      });
    });
  }

  getStationsOrMen(contractid, cb) {
    this.db.initDB().then(() => {
      this.db.getSingleCondData(ACCOUNT_LIST, 'contractId', contractid, (res) => {
        // console.log(res);
        const temp = [];
        const stations = [];
        const managers = [];
        res.forEach(ele => {
          // 取管理者
          if (ele.ismanage === '1') {
            // 获取负责人
            if (managers.indexOf(ele.id) === -1) {
              managers.push(ele.id);
              temp.push({ name: ele.manname, id: ele.id, type: '2', rawData: ele });
            }
          }

          // 取岗位
          if (stations.indexOf(ele.stationid) === -1) {
            stations.push(ele.stationid);
            temp.push({ name: ele.stationname, id: ele.stationid, type: '3', rawData: ele });
          }
        });

        if (cb) {
          cb(temp);
        }

      });
    });
  }

  getCompanyContracts(compName, cb) {
    this.db.initDB().then(() => {
      this.db.getSingleCondData(ACCOUNT_LIST, 'companyName', compName, (res) => {
        const contracts = [];
        const temp = [];
        const stations = [];
        const managers = [];
        res.forEach(ele => {
          if (ele.contractname && ele.contractname !== 'NULL') {
            // 有合约
            if (contracts.indexOf(ele.contractid) === -1) {
              contracts.push(ele.contractid);
              temp.push({ name: ele.contractname, id: ele.contractid, type: '1', rawData: ele });
            }
          } else {
            // 取管理者
            if (ele.ismanage === '1') {
              // 获取负责人
              if (managers.indexOf(ele.id) === -1) {
                managers.push(ele.id);
                temp.push({ name: ele.manname, id: ele.id, type: '2', rawData: ele });
              }
            }

            // 取岗位
            if (stations.indexOf(ele.stationid) === -1) {
              stations.push(ele.stationid);
              temp.push({ name: ele.stationname, id: ele.stationid, type: '3', rawData: ele });
            }
          }
        });

        if (cb) {
          cb(temp);
        }
      });
    });
  }
}
