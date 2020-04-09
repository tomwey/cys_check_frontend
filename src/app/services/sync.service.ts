import { DbService } from './db.service';
import { ResultData, ApiService, ErrorData } from './api.service';
import { Utils } from './Utils';

import { Injectable } from '@angular/core';

export const QUE_LIST = 'que_list'; // 问题表
export const TASK_LIST_1 = 'task_list_1'; // 大任务表
export const TASK_LIST_2 = 'task_list_2'; // 任务对象表
export const TASK_LIST_3 = 'task_list_3'; // 任务检查项
export const PROJECT_TREE = 'project_tree'; // 项目基础数据表, 包含了楼栋或区域，单元，楼层，房间号或部位
export const LIST_IN_HOUSE = 'list_inhouse'; // 房间部位表
export const CHECK_ITEM_LIST = 'check_itemlist'; // 检查项列表
export const CHECK_ITEM_LIST2 = 'check_itemlist_new'; // 检查项列表
export const CHECK_TYPE_LIST = 'check_typelist'; // 检查类型列表
export const QUE_TYPE_ITEM = 'que_type_item'; // 问题分类及问题检查项表
export const ACCOUNT_LIST = 'account_list'; // 账户人员表
export const ACCOUNT_TYPE_LIST = 'accounttype_list'; // 账号类别
export const QUE_LIST_ANNEXS = 'que_list_annexs'; // 问题附件
export const QUE_LIST_RECORD = 'que_list_record'; // 问题处理记录
export const QUE_LIST_CONTRACTTYPE = 'que_list_contracttype'; // 问题合约类别
export const QUE_LEVEL_LIST = 'que_level_list'; // 问题紧急程度
export const QUE_OVERDUE_REASON_LIST = 'que_overdue_reason_list'; // 问题超期原因
export const QUE_REASON_LIST = 'que_reason_list'; // 问题原因
export const RECT_REGISTER_LIST = 'rect_register_list'; // 问题整改
export const RECT_QUE_BACK = 'rect_feedback_list'; // 问题反馈
export const RECT_QUE_URGE = 'rect_urge_list'; // 问题催办
export const RECT_QUE_ACCEPT = 'rect_accept_list'; // 问题验收
export const CHECK_TYPEITEM_LIST = 'check_type_list'; // 分类检查项


// 从本地同步数据到服务器
export const SyncToServerTables = [
  {
    name: '质检问题',
    uri: null,
    dotype: 'GetData',
    funname: '质检系统提问题APP',
    params: [
      'problem_id',
      'plan_mid',
      'project_id',
      'object_type',
      'object_name',
      'position_desc',
      'problem_name',
      'unittype',
      'from_type',
      'comp_fields',
      'comp_values'
    ],
    table: 'add_que',
    pri_key: 'addque_id',
    needRemove: true,
    attachTable: 'H_QA_Problem_Annex',
    attachField: 'Annex_ID',
    totalItems: [],
    totalSize: 0,
    doneItems: []
  },
  // {
  //   name: '质检部位',
  //   uri: null,
  //   dotype: 'GetData',
  //   funname: '质检系统获取质检任务列表APP',
  //   params: [Utils.getQueryString('manid') || '1693010', '2', '0', '0', '0'],
  //   table: TASK_LIST_2,
  //   totalItems: [],
  //   totalSize: 0,
  //   doneItems: []
  // },
  // {
  //   name: '质检项',
  //   uri: null,
  //   dotype: 'GetData',
  //   funname: '质检系统计划事项确认APP',
  //   params: ['process_id', 'man_id', 'is_problem'],
  //   table: TASK_LIST_3,
  //   totalItems: [],
  //   totalSize: 0,
  //   doneItems: []
  // },
  {
    name: '质检项',
    uri: null,
    dotype: 'GetData',
    funname: '质检系统确认计划APP',
    params: ['plan_mid', 'object_type', 'object_id', 'pro_position_id', 'qaitem_id', 'man_id', 'is_problem'],
    table: TASK_LIST_3,
    totalItems: [],
    totalSize: 0,
    doneItems: []
  },
  {
    name: '整改登记',
    uri: null,
    dotype: 'GetData',
    funname: '质检系统问题整改APP',
    params: ['problemId', 'rectManId', 'rectDate', 'rectDesc', 'rectType', 'queResonId', 'createId', 'fromType', 'overdueReasonId', 'overdueDesc'],
    table: RECT_REGISTER_LIST,
    pri_key: 'rect_register_id',
    needRemove: true,
    attachTable: 'H_QA_Problem_Annex',
    attachField: 'Annex_ID',
    totalItems: [],
    totalSize: 0,
    doneItems: []
  },
  {
    name: '整改反馈',
    uri: null,
    dotype: 'GetData',
    funname: '质检系统问题反馈APP',
    params: ['problemId', 'createId', 'receiveID', 'queRisk', 'queprog', 'queDate', 'backDesc'],
    table: RECT_QUE_BACK,
    pri_key: 'rect_feedback_id',
    needRemove: true,
    attachTable: 'H_QA_Problem_Annex',
    attachField: 'Annex_ID',
    totalItems: [],
    totalSize: 0,
    doneItems: []
  },
  {
    name: '整改催办',
    uri: null,
    dotype: 'GetData',
    funname: '质检系统整改催办APP',
    params: ['problemId', 'createId', 'receiveId', 'urgeDesc'],
    table: RECT_QUE_URGE,
    pri_key: 'rect_urge_id',
    needRemove: true,
    totalItems: [],
    totalSize: 0,
    doneItems: []
  },
  {
    name: '整改验收',
    uri: null,
    dotype: 'GetData',
    funname: '质检系统问题验收APP',
    params: ['problemId', 'rectID', 'accpetManId', 'isPass', 'acceptDesc', 'fromType', 'acceptDate'],
    table: RECT_QUE_ACCEPT,
    pri_key: 'rect_accept_id',
    needRemove: true,
    attachTable: 'H_QA_Problem_Annex',
    attachField: 'Annex_ID',
    totalItems: [],
    totalSize: 0,
    doneItems: []
  },
];

// 从服务器同步数据到本地
export const SyncTables = [
  {
    uri: null,
    dotype: 'GetData',
    funname: '质检系统获取质检任务列表APP',
    params: ['manid', '0', '-1', '0'],
    table: TASK_LIST_1
  },
  {
    uri: null,
    dotype: 'GetData',
    funname: '质检系统获取质检任务列表APP',
    params: ['manid', '3', '0', '0', '0'],
    table: TASK_LIST_3
  },
  {
    uri: null,
    dotype: 'GetData',
    funname: '质检系统获取质检任务列表APP',
    params: ['manid', '2', '0', '0', '0'],
    table: TASK_LIST_2
  },
  {
    uri: null,
    dotype: 'GetData',
    funname: '质检系统获取项目树APP',
    params: ['1'],
    table: PROJECT_TREE
  },
  {
    uri: null,
    dotype: 'GetData',
    funname: '质检系统获取检查类型列表APP',
    params: ['589'],
    table: CHECK_TYPE_LIST,
    need_project: '0'
  },
  {
    uri: null,
    dotype: 'GetData',
    funname: '质检系统获房间部位列表APP',
    params: [],
    table: LIST_IN_HOUSE
  },
  // {
  //   uri: null,
  //   dotype: 'GetData',
  //   funname: '质检系统获取检查项列表APP',
  //   params: [],
  //   table: CHECK_ITEM_LIST
  // },
  {
    uri: null,
    dotype: 'GetData',
    funname: '质检系统获取部位检查项APP',
    params: ['0'],
    table: CHECK_ITEM_LIST2
  },
  {
    uri: null,
    dotype: 'GetData',
    funname: '质检系统获取账户信息APP',
    params: ['0', '', '', '', ''], //['', '', '', '0'],
    table: ACCOUNT_LIST
  },
  {
    uri: null,
    dotype: 'GetData',
    funname: '质检系统获取问题清单APP',
    params: ['manid', '0', '0', '-1', '0', '0', '0', '', '', '-1'],
    table: QUE_LIST
  },
  {
    uri: null,
    dotype: 'GetData',
    funname: '质检系统获取检查类型列表APP',
    params: ['646'],
    table: ACCOUNT_TYPE_LIST,
    need_project: '0'
  },
  {
    uri: null,
    dotype: 'GetData',
    funname: '质检系统获取检查类型列表APP',
    params: ['616'],
    table: QUE_LEVEL_LIST,
    need_project: '0'
  },
  {
    uri: null,
    dotype: 'GetData',
    funname: '质检系统获取检查类型列表APP', // 获取问题原因
    params: ['619'],
    table: QUE_REASON_LIST,
    need_project: '0'
  },
  {
    uri: null,
    dotype: 'GetData',
    funname: '质检系统获取检查类型列表APP', // 获取问题超期原因
    params: ['640'],
    table: QUE_OVERDUE_REASON_LIST,
    need_project: '0'
  },
  {
    uri: null,
    dotype: 'GetData',
    funname: '质检系统获取问题清单APP', // 获取问题附件
    params: ['manid', '1', '0', '-1', '0', '0', '0', '', '', '-1'],
    table: QUE_LIST_ANNEXS,
    imageDownloadField: 'annex_url'
  },
  {
    uri: null,
    dotype: 'GetData',
    funname: '质检系统获取问题清单APP', // 获取问题处理记录
    params: ['manid', '2', '0', '-1', '0', '0', '0', '', '', '-1'],
    table: QUE_LIST_RECORD
  },
  {
    uri: null,
    dotype: 'GetData',
    funname: '质检系统获取问题清单APP', // 获取问题合约类别
    params: ['manid', '3', '0', '-1', '0', '0', '0', '', '', '-1'],
    table: QUE_LIST_CONTRACTTYPE
  },
  {
    uri: null,
    dotype: 'GetData',
    funname: '质检系统获取分类检查项APP', // 获取分类检查项
    params: [],
    table: CHECK_TYPEITEM_LIST,
    need_project: '1'
  }
];

@Injectable({
  providedIn: 'root'
})

export class SyncService {

  counter = 0;
  needSyncCount = 0;
  currSyncCount = 0;

  currAnnexes = [];

  constructor(private db: DbService, private api: ApiService) { }

  /**
   * 获取项目
   * @returns project 例如：{ id: 123, name: '枫丹铂麓' }
   */
  getProject() {
    const project = JSON.parse(localStorage.getItem('project'));
    return project;
  }

  /**
   * 保存项目到本地
   * @param projectID 项目ID
   * @param projectName 项目名字
   */
  saveProject(projectID, projectName) {
    localStorage.setItem('project', JSON.stringify({ id: projectID, name: projectName }));
  }

  /**
   * 从服务器同步数据到本地
   * @param callback 回调完成函数
   */
  syncServerToLocal(progressCallback, doneCallback) {
    // this.db.initDB().then(())
    this.startOfflineData(progressCallback, doneCallback);
  }

  syncToServerCheck(cb) {
    let counter = 0;
    let sum = 0;
    SyncToServerTables.forEach(sync => {
      this.db.initDB().then(() => {
        // this.db.select()
        if (sync.needRemove) {
          this.db.select(sync.table, [], {}, (res) => {
            sync.totalItems = res;
            sync.totalSize = res.length;
            counter++;
            sum += res.length;
            if (counter === SyncToServerTables.length) {
              if (cb) {
                this.needSyncCount = sum;
                cb(sum);
              }
            }
          });
        } else {
          this.db.getSingleCondData(sync.table, 'isUpdate', '1', (res) => {
            console.log(res);
            sync.totalItems = res;
            sync.totalSize = res.length;
            sum += res.length;
            counter++;
            if (counter === SyncToServerTables.length) {
              if (cb) {
                this.needSyncCount = sum;
                cb(sum);
              }
            }
          });
        }
      });
    });
  }

  /**
   * 本地数据同步到服务器
   * @param progressCallback 同步进度回调函数，返回两个参数：progress, total
   * @param doneCallback 同步完成回调函数，返回一个参数：yesOrNo
   */
  syncLocalToServer(progressCallback, doneCallback) {
    this.currSyncCount = 0;
    SyncToServerTables.forEach(sync => {
      // sync.startSync();
      if (sync.attachTable && sync.attachField) {
        sync.totalItems.forEach(item => {

          let images = (item.annexes || item.images);
          // console.log(images);
          if (images) {
            images = images.split('|');

            const formData = new FormData();
            formData.append('mid', '0');
            formData.append('domanid', Utils.getManID());
            formData.append('tablename', sync.attachTable);
            formData.append('fieldname', sync.attachField);

            let index = 0;
            images.forEach(img => {
              formData.append('file', this.dataURItoBlob(img), `image${index++}.jpg`);
            });

            this.api.upload(formData, '', false)
              .then((res: any) => {
                if (res.code === '0') {
                  const ids = res.IDS;
                  const params = {};
                  params['dotype'] = sync.dotype;
                  params['funname'] = sync.funname;

                  const obj = Object.assign({}, item);
                  obj.project_id = this.getProject().id;
                  obj.man_id = Utils.getManID();

                  // tslint:disable-next-line:no-shadowed-variable
                  let index = 1;
                  sync.params.forEach(param => {
                    const str = (obj[param] || '').toString();
                    params[`param${index}`] = str.replace(/NULL/g, '');
                    index++;
                  });
                  params[`param${index}`] = ids;

                  this.api.POST(null, params, '', false).then((res2: ResultData) => {
                    if (res2.code === 0) {
                      if (res2.data && res2.data.length > 0) {
                        if (res2.data[0].ihint_type === '1') {
                          this.db.initDB().then(() => {
                            this.db.delete(sync.table, [item[sync.pri_key]], () => {

                            });
                          });
                          this.syncCallback(progressCallback, doneCallback, '1');
                        } else {
                          this.syncCallback(progressCallback, doneCallback, '0');
                        }
                      } else {
                        this.syncCallback(progressCallback, doneCallback, '0');
                      }
                    } else {
                      this.syncCallback(progressCallback, doneCallback, '0');
                    }
                  })
                    .catch((error) => { this.syncCallback(progressCallback, doneCallback, '0'); });
                } else {
                  this.syncCallback(progressCallback, doneCallback, '0');
                }
              })
              .catch((err) => {
                // console.log(err);
                this.syncCallback(progressCallback, doneCallback, '0');
              });
          } else {
            console.log('无附件');
            const ids = '';
            const params = {};
            params['dotype'] = sync.dotype;
            params['funname'] = sync.funname;

            const obj = Object.assign({}, item);
            obj.project_id = this.getProject().id;
            obj.man_id = Utils.getManID();

            console.log(item);

            // tslint:disable-next-line:no-shadowed-variable
            let index = 1;
            sync.params.forEach(param => {
              console.log(param);
              const str = (obj[param] || '').toString();
              // console.log(str);
              params[`param${index}`] = str.replace(/NULL/g, '');
              index++;
            });
            params[`param${index}`] = ids;

            this.api.POST(null, params, '', false).then((res2: ResultData) => {
              if (res2.code === 0) {
                if (res2.data && res2.data.length > 0) {
                  if (res2.data[0].ihint_type === '1') {
                    this.db.initDB().then(() => {
                      this.db.delete(sync.table, [item[sync.pri_key]], () => {

                      });
                    });
                    this.syncCallback(progressCallback, doneCallback, '1');
                  } else {
                    this.syncCallback(progressCallback, doneCallback, '0');
                  }
                } else {
                  this.syncCallback(progressCallback, doneCallback, '0');
                }
              } else {
                this.syncCallback(progressCallback, doneCallback, '0');
              }
            })
              .catch((error) => { this.syncCallback(progressCallback, doneCallback, '0'); });
          }
        });
      } else {
        sync.totalItems.forEach(item => {
          const params = {};
          params['dotype'] = sync.dotype;
          params['funname'] = sync.funname;

          const obj = Object.assign({}, item);
          obj.project_id = this.getProject().id;
          obj.man_id = Utils.getManID();

          let index = 1;
          sync.params.forEach(param => {
            const str = (obj[param] || '').toString();
            params[`param${index}`] = str.replace(/NULL/g, '');
            index++;
          });

          console.log(item);
          console.log('参数：' + params);

          const obj1 = Object.assign({}, item);
          obj1.isupdate = '0';

          this.api.POST(null, params, '', false).then((res: ResultData) => {
            if (res.code === 0) {
              if (res.data && res.data.length > 0) {
                if (res.data[0].ihint_type === '1') {
                  this.db.initDB().then(() => {
                    if (sync.needRemove) {
                      this.db.delete(sync.table, [item[sync.pri_key]], () => {

                      });
                    } else {
                      this.db.update(sync.table, [obj1], null);
                    }
                  });
                }
              }
            }
            this.syncCallback(progressCallback, doneCallback, '1');
          })
            .catch((error) => { this.syncCallback(progressCallback, doneCallback, '0'); });
        });
      }
    });
  }

  syncCallback(progressCallback, doneCallback, code) {
    if (++this.currSyncCount === this.needSyncCount) {
      if (doneCallback) {
        doneCallback();
      }
    }
    console.log(this.currSyncCount);
    if (progressCallback) {
      progressCallback(this.currSyncCount);
    }
  }

  private dataURItoBlob(dataURI) {
    // convert base64 to raw binary data held in a string
    // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
    const byteString = atob(dataURI.split(',')[1]);

    // separate out the mime component
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

    // write the bytes of the string to an ArrayBuffer
    const ab = new ArrayBuffer(byteString.length);

    // create a view into the buffer
    const ia = new Uint8Array(ab);

    // set the bytes of the buffer to the correct values
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    // write the ArrayBuffer to a blob, and you're done
    const blob = new Blob([ab], { type: mimeString });
    return blob;

  }

  private syncSingleTable(sync, cb) {
    const project = this.getProject();

    const params = {};

    params['dotype'] = sync.dotype;
    params['funname'] = sync.funname;

    if (sync.params) {
      let startIndex;
      if (sync.need_project === '0') {
        startIndex = 1;
      } else {
        params['param1'] = project.id || '0';
        startIndex = 2;
      }
      if (sync.funname === '质检系统获取账户信息APP') {
        console.log('fsdfs');
      }
      for (let i = 0; i < sync.params.length; i++) {
        params['param' + (startIndex + i)] = sync.params[i] === 'manid' ? Utils.getManID() : sync.params[i];
      }
    }

    this.api.POST(sync.uri, params, '', false).then((res: ResultData) => {
      // console.info(sync.table, res);
      if (res.code === 0) {
        if ((res.data || []).length === 0) {
          // 数据为空
          // console.log('清除表：' + sync.table);
          this.db.clearTable(sync.table);
          if (cb) {
            cb();
          }
          return;
        }
      }

      if (sync.imageDownloadField /*&& sessionStorage.getItem('need.sync.all') === '1'*/) {
        // 缓存附件
        const arr = res.data || [];
        // console.log(arr);
        this.currAnnexes = [];

        let counter = 0;
        arr.forEach(obj => {

          this.db.getSingleCondData('que_list_annexs', 'ID', obj.annex_id, (res2) => {
            console.log(res);
            if (res2.length > 0 && res2[0].annex_data && res2[0].annex_data !== 'NULL') {
              // obj['annex_data'] = res[0].annex_data;

              // this.currAnnexes.push(obj);

              counter++;
              if (counter === arr.length) {
                if (cb) {
                  cb();
                }
              }
              // if (counter === arr.length) {
              //   this.doSaveAnnexes(cb);
              // }
            } else {
              if (sessionStorage.getItem('need.sync.all') === '1') {
                // 重新下载附件
                const imageUrl = obj[sync.imageDownloadField];
                const img = new Image();
                img.crossOrigin = 'anonymous';
                img.onload = () => {

                  let canvas = document.createElement('canvas');
                  canvas.width = img.width;
                  canvas.height = img.height;
                  const context = canvas.getContext('2d');
                  context.drawImage(img, 0, 0, img.width, img.height);
                  const url = canvas.toDataURL('image/jpeg', 1.0);

                  obj['annex_data'] = url;
                  canvas = null;

                  if (res2.length > 0) { // 删除之前的旧数据
                    // if (!res2[0]['annex_data'] || res2[0]['annex_data'] === 'NULL') {
                    this.db.delete(QUE_LIST_ANNEXS, [res2[0]['que_annex_id']], null);
                    // }
                  }

                  // this.currAnnexes.push(obj);
                  this.db.insert(QUE_LIST_ANNEXS, [obj], () => {
                    // this.currAnnexes = [];

                    counter++;
                    if (counter === arr.length) {
                      // this.doSaveAnnexes(cb);
                      if (cb) {
                        cb();
                      }
                    }

                  }, false);

                  // counter++;
                  // if (counter === arr.length) {
                  //   // this.doSaveAnnexes(cb);
                  //   if (cb) {
                  //     cb();
                  //   }
                  // }
                };
                img.onerror = () => {
                  counter++;
                  if (counter === arr.length) {
                    // this.doSaveAnnexes(cb);
                    if (cb) {
                      cb();
                    }
                  }
                };
                img.src = imageUrl;
              } else {
                // 只插入附件信息数据到数据库
                if (res2.length === 0) {
                  this.db.insert(QUE_LIST_ANNEXS, [obj], () => {
                    // this.currAnnexes = [];

                    counter++;
                    if (counter === arr.length) {
                      // this.doSaveAnnexes(cb);
                      if (cb) {
                        cb();
                      }
                    }

                  }, false);
                } else {
                  counter++;
                  if (counter === arr.length) {
                    // this.doSaveAnnexes(cb);
                    if (cb) {
                      cb();
                    }
                  }
                }
              }
            }
          });// end else
        });
      } else {
        // 批量缓存一批数据
        this.saveData(sync.table, res.data, () => {
          if (cb) {
            cb();
          }
        });
      }
    }).catch((err) => {
      if (cb) {
        cb();
      }
    });
  }

  doSaveAnnexes(cb) {
    this.db.initDB().then(() => {
      this.db.insert(QUE_LIST_ANNEXS, this.currAnnexes, () => {
        this.currAnnexes = [];
        if (cb) {
          cb();
        }
      }, true);
    });
  }

  private startOfflineData(progressCallback, doneCallback) {

    this.counter = 0;

    for (const sync of SyncTables) {
      // let done = false;
      this.syncSingleTable(sync, () => {
        // done = true;
        if (++this.counter === SyncTables.length) {
          if (doneCallback) {
            doneCallback();
          }
        }
        if (progressCallback) {
          progressCallback(this.counter);
        }
      });
    }

  }

  private saveData(tableName, data, cb) {
    this.db.initDB().then(() => {
      this.db.insert(tableName, data, (res) => {
        cb();
      }, true);
    });
  }

}
