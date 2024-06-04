<template>
  <div class="pyzl-drawer">
    <template v-if="isLoading">
      <van-skeleton title :row="3" />
    </template>
    <template v-else>
      <!-- 操作栏 -->
      <div class="pyzl-drawer__footer">
        <div class="flex item-center justify-center">
          <template v-if="progressState === 1">
            <van-button
              class="footer--action"
              type="warning"
              style="width: 150px"
              @click="debounceActionHandler('appeal')"
            >
              申诉
            </van-button>
            <van-button
              class="footer--action"
              type="primary"
              @click="debounceActionHandler('signRectificationPaper')"
              style="width: 150px"
            >
              确认
            </van-button>
          </template>

          <template v-else-if="progressState === 2">
            <van-button
              plain
              type="primary"
              class="btn-action is--save"
              @click="debounceActionHandler('saveRectificationRequirement')"
            >
              确认
            </van-button>
          </template>

          <template v-else-if="show.appealResult">
            <van-button
              class="footer--action"
              type="warning"
              style="width: 150px"
              @click="debounceActionHandler('confirmAppeal')"
            >
              申诉成立
            </van-button>
            <van-button
              @click="debounceActionHandler('rejectAppeal')"
              class="footer--action"
              type="primary"
              style="width: 180px"
            >
              驳回申诉，签发整改
            </van-button>
          </template>

          <!-- NOTE： 验收场景显示 -->
          <template v-else-if="show.rectificationLog">
            <van-button
              class="footer--action"
              type="warning"
              style="width: 150px"
              @click="debounceActionHandler('rejectAccpet')"
            >
              不予验收
            </van-button>
            <van-button
              @click="debounceActionHandler('agreeAccept')"
              class="footer--action"
              type="primary"
              style="width: 180px"
            >
              同意验收
            </van-button>
          </template>

          <template v-else>
            <van-button
              class="footer--action"
              type="warning"
              style="width: 150px"
              @click="debounceActionHandler('cancel')"
            >
              取消
            </van-button>
            <van-button
              @click="debounceActionHandler('submit')"
              class="footer--action"
              type="primary"
              style="width: 150px"
            >
              提交
            </van-button>
          </template>
        </div>
      </div>

      <!-- ## 违规信息 -->
      <ViolationInfoCard @action="handleAction"></ViolationInfoCard>

      <!-- ## 申诉理由弹窗 -->
      <AppealReasonDialog
        title="申诉理由"
        v-model="show.appealReason"
        @appeal-succsss="actionHandler('appealSuccsss')"
      >
      </AppealReasonDialog>

      <!-- ## 不予验收弹窗 -->
      <RejectAccpetDialog
        title="不予验收"
        v-model="show.rejectAccpet"
      ></RejectAccpetDialog>

      <!-- ## 签收整改告知书 -->
      <template v-if="show.rectificationPaper">
        <div class="p-15 rectificationPaper--section">
          <CardBox title="签收整改告知书" :show-toggler="false" type="simple">
            <div class="bg--white">
              <div class="van-cell van-cell--center van-field justify-between">
                <span>整改告知书查阅:</span>
                <!-- :disabled="!form.notice"  -->
                <van-button
                  size="small"
                  plain
                  type="primary"
                  @click="actionHandler('viewRectificationPaper', form.notice)"
                >
                  {{ form.notice || "整改告知书.pdf" }}
                </van-button>
              </div>

              <van-field
                v-model="form.rtfPeriod"
                center
                clearable
                label="整改要求:"
                placeholder=""
                :readonly="true"
              >
              </van-field>

              <div class="van-cell van-cell--center van-field justify-between">
                <span>上传签收回执单:</span>
                <Uploader
                  @upload-success="handleRectificationPaperUploadSuccess"
                ></Uploader>
              </div>

              <div class="filelist rectificationReceiptList">
                <div
                  class="van-cell"
                  v-for="item in uploadList.rectificationReceiptList"
                  :key="item.ossId"
                >
                  {{ item.fileName }}
                </div>
              </div>
              <div class="p-15 is--error">{{ rectificationPaperError }}</div>
            </div>
          </CardBox>
        </div>
      </template>

      <!-- ## 承运商整改 -->
      <template v-if="show.carrierRectification">
        <div class="p-15 carrierRectification--section">
          <CardBox title="承运商整改" :show-toggler="false" type="simple">
            <div class="bg--white p-15">
              <van-field
                v-model="form.carrierName"
                center
                clearable
                label="整改人:"
                placeholder="请输入整改人"
              >
              </van-field>

              <van-field
                v-model="appealForm.rtfMark"
                center
                clearable
                label="整改描述:"
                placeholder="请输入整改描述"
              >
              </van-field>

              <div class="van-cell van-cell--center van-field justify-between">
                <span>整改报告:</span>
                <Uploader
                  @upload-success="handleAppealFormReportListUploadSuccess"
                ></Uploader>
              </div>

              <div class="filelist appealFormReportList">
                <div
                  class="van-cell"
                  v-for="item in appealForm.reportList"
                  :key="item.ossId"
                >
                  {{ item.fileName }}
                </div>
              </div>

              <div class="van-cell van-cell--center van-field justify-between">
                <span>整改图片:</span>
                <Uploader
                  @upload-success="handleAppealFormImageListUploadSuccess"
                ></Uploader>
              </div>

              <div class="filelist appealFormImageList">
                <div
                  class="van-cell"
                  v-for="item in appealForm.imageList"
                  :key="item.ossId"
                >
                  {{ item.fileName }}
                </div>
              </div>
              <p class="p-15 is--error">{{ appealForm.errorMsg }}</p>
            </div>
          </CardBox>
        </div>
      </template>

      <!-- ## 执行岗处理申诉 -->
      <template v-if="show.appealResult">
        <div class="p-15 carrierRectification--section">
          <CardBox title="申诉结果" :show-toggler="false" type="simple">
            <div class="bg--white p-15">
              <van-field
                type="textarea"
                v-model="form.appealReason"
                center
                clearable
                label="申诉结果:"
                placeholder=""
                :disabled="true"
              >
              </van-field>
              <p class="p-15 is--error">{{ appealForm.errorMsg }}</p>
            </div>
          </CardBox>
        </div>
      </template>

      <!-- ## 整改需求 -->
      <template v-if="show.rectificationRequirement">
        <div class="p-15 rectificationRequirement--section">
          <CardBox title="请选择整改类型" :show-toggler="false" type="simple">
            <div class="bg--white p-15">
              <p class="is--error" v-show="showRectificationRequirementError">
                * 请输入整改要求
              </p>
              <van-radio-group v-model="radio">
                <van-radio name="立即整改">
                  <p>立即整改</p>
                </van-radio>
                <van-radio name="7日内整改">
                  <p>7日内整改</p>
                </van-radio>
                <van-radio name="15天内整改">
                  <p>15天内整改</p>
                </van-radio>
                <van-radio name="其他">
                  <p>其他</p>
                </van-radio>
                <van-field
                  style="background-color: #f7f7f7;"
                  v-show="isOtherRectificationRequirementType"
                  v-model="content"
                  center
                  clearable
                  placeholder="请输入整改要求"
                />
              </van-radio-group>
            </div>
          </CardBox>
        </div>
      </template>

      <!-- ## 整改签发弹窗 -->
      <template v-if="show.RectificationRequirementActionSheet">
        <!-- :state="this.preNode" -->
        <RectificationRequirementActionSheet
          :state="form.preNode"
          :close-on-click-overlay="false"
          :closeable="false"
          title="请选择整改类型"
          v-model="show.RectificationRequirementActionSheet"
        >
        </RectificationRequirementActionSheet>
      </template>

      <!-- ## 整改日志 -->
      <template v-if="show.rectificationLog">
        <div class="p-15 rectificationLog--section">
          <CardBox title="整改日志" :show-toggler="false" type="simple">
            <RectificationLogTable></RectificationLogTable>
          </CardBox>
        </div>
      </template>
    </template>
  </div>
</template>

<script>
import { closePage } from "utils/weixin";

// 新增Table
let TableMixin = {
  data() {
    return {
      transRoleList: []
    };
  }
};

let AppealFormMixin = {
  data() {
    return {
      appealForm: {
        // 整改人
        rtfName: "",
        // 整改描述
        rtfMark: "",
        reportList: [],
        imageList: [],
        errorMsg: ""
      }
    };
  },

  methods: {
    handleAppealFormImageListUploadSuccess({ file }) {
      this.appealForm.imageList.push(file);
    },
    handleAppealFormReportListUploadSuccess({ file }) {
      this.appealForm.reportList.push(file);
    }
  }
};

let toBool = o => !!o;

/**
 * 面板状态控制
 * @mixin
 */
let CardControlMixin = {
  data() {
    return {
      disabled: {
        // 承运商确认
        carrierConfirm: false,
        // 承运商整改
        carrierRectification: false,
        // 承运商整改日志
        rectificationLog: false,
        // 整改验收
        rectificationAcceptance: false,
        // 验收日志
        acceptanceLog: false,
        // 申诉结果
        appealResult: false,
        // 申诉理由
        appealReason: false,
        // 签收整改告知书
        rectificationPaper: false
      },

      // 默认除违规消息、基础信息、检查结果外其他模块都是隐藏的
      show: {
        // 不予验收
        rejectAccpet: false,

        // 整改需求弹窗
        rectificationRequirement: false,

        // 承运商确认
        carrierConfirm: false,
        // 承运商整改
        carrierRectification: false,
        // 承运商整改日志
        rectificationLog: false,
        // 整改验收
        rectificationAcceptance: false,
        // 验收日志
        acceptanceLog: false,
        // 申诉结果
        appealResult: false,
        // 申诉理由
        appealReason: false,
        // 签收整改告知书
        rectificationPaper: false,

        // 整改签发弹窗
        RectificationRequirementActionSheet: false
      }
    };
  }
};

import debounce from "lodash/debounce";

import AppealReasonDialog from "./AppealReasonDialog.vue";
import { doAction } from "@/api/system/notification";

import StateMixin from "./StateMixin";
import RectificationRequirementMixin from "./RectificationRequirementMixin";

import { mapActions, mapState } from "vuex";

import CardBox from "components/CardBox/IndexView.vue";

import { Dialog } from "vant";

function showSuccess(message = "操作成功") {
  this.$notify({
    title: "提示",
    message,
    position: "bottom-right",
    type: "success"
  });
}

function showError(message = "操作失败") {
  this.$notify({
    title: "提示",
    message,
    position: "bottom-right",
    type: "danger",
    duration: 3 * 1000
  });
}

import Uploader from "components/Uploader.vue";

export default {
  components: {
    CardBox,
    Uploader,

    // 违规信息
    ViolationInfoCard: () =>
      import(/* webpackChunkName: "violation-info-card" */ "./ViolationInfoCard.vue"),

    AppealReasonDialog,

    // 不予验收弹窗
    RejectAccpetDialog: () =>
      import(/* webpackChunkName: "reject-accpet-dialog" */ "./RejectAcceptDialog.vue"),

    // 整改签发弹窗
    RectificationRequirementActionSheet: () =>
      import(/* webpackChunkName: "RectificationRequirement-ActionSheet" */ "./RectificationRequirementActionSheet.vue"),

    RectificationLogTable: () =>
      import(/* webpackChunkName: "acceptanceLog-table" */ "./RectificationLogTable.vue")

    // AcceptanceLogTable: () =>
    //   import(
    //     /* webpackChunkName: "acceptanceLog-table" */ './AcceptanceLogTable.vue'
    //   ),
  },

  mixins: [
    TableMixin,
    AppealFormMixin,
    CardControlMixin,
    StateMixin,
    RectificationRequirementMixin
  ],

  data() {
    return {
      isEditMode: false,

      uploadList: {
        rectificationReceiptList: []
      },

      // 签收整改告知书错误信息
      rectificationPaperError: "",

      // 是否显示更多信息
      showMoreDetial: false,

      appealResult: {
        textarea: ""
      }

      // hasConfirmRectificationRequirement: false
    };
  },

  provide: function() {
    return {
      drawerContext: this
    };
  },

  computed: {
    ...mapState({
      isLoading: state =>
        state["@@loading"].effects["notification/updateNotificationDetailAsync"]
    }),

    ...mapState("notification", ["form"])
  },

  methods: {
    ...mapActions({
      updateNotificationDetailAsync:
        "notification/updateNotificationDetailAsync"
    }),

    /**
     * 处理回执单上传操作
     * @flow 签收整改通知书
     * @param {*} param0
     */
    handleRectificationPaperUploadSuccess({ file }) {
      this.uploadList.rectificationReceiptList.push(file);
    },

    handleAction(data) {
      let { type, options = {} } = data;
      debugger;
      this.actionHandler(type, options);
    },

    /**
     * 编辑按钮操作
     */
    handleEditPage() {
      this.isEditMode = true;
    },

    actionHandler(action, options = {}) {
      let actionStrategies = {
        viewRectificationPaper(pdf) {
          function downFile(filePath) {
            var newTab = window.open("about:blank");
            newTab.location.href = filePath;
          }
          downFile(pdf);
        },

        /**
         * 保存整改需求
         */
        saveRectificationRequirement() {
          // 验证表单
          if (!this.isRectificationRequirementValidate()) return;
          this.RectificationRequirement = false;
          let content = this.content.trim();
          let f = this.form;
          let state = f.preNode;
          let data = {
            // 签发期限
            rtfPeriod: this.radio,
            // 暂时留空
            rtfPeriodMark: content || "",
            id: this.noticeId
          };
          return doAction(state.toString(), data)
            .then(res => {
              showSuccess.call(this);
              this.$emit("refresh");
              // Refresh
              closePage.call(this);
            })
            .catch(err => {
              debugger;
              showError.call(this, err.message);
            });
        },

        /**
         * 签发整改告知书
         * @场景 确认
         */
        signRectificationPaper() {
          let data = {
            rtfOver: 1,
            id: this.noticeId
          };

          doAction(1, data)
            .then(res => {
              showSuccess.call(this);
              this.$emit("refresh");
              closePage.call(this);
            })
            .catch(err => {
              showError.call(this, err.message);
            });
        },

        /**
         * 图片预览
         */
        previwImageList(options) {
          this.doImagePreview(options);
        },

        /**
         * 申诉(按钮点击)
         */
        appeal(options) {
          if (!this.show.appealReason) {
            this.show.appealReason = true;
            return;
          }
          return;
        },

        /**
         * 申诉成功
         */
        appealSuccsss(options) {
          this.$emit("refresh");
          closePage.call(this);
        },

        /**
         * 不予验收保存(确认)操作
         */
        rejectAccpetConfirm(options) {
          debugger;
          this.$emit("refresh");
          closePage.call(this);
        },

        /**
         * 确认申诉
         */
        confirmAppeal(options) {
          let data = {
            rtfOver: 1,
            appealResult: "",
            id: this.noticeId
          };
          doAction(this.progressState, data)
            .then(res => {
              debugger;
              showSuccess.call(this);
              this.$emit("refresh");
              closePage.call(this);
            })
            .catch(err => {
              showError.call(this, err.message);
            });
        },

        /**
         * 驳回申诉，签发整改
         */
        rejectAppeal(options) {
          this.show.RectificationRequirementActionSheet = true;
        },

        /**
         * 申诉整改需求弹窗确认
         */
        rectificationRequirementConfirm(options) {
          this.$emit("refresh");
          closePage.call(this);
        },

        /**
         * 确认/整改
         */
        rectification(options) {
          // 校验
          let f = this.appealForm;

          if (f.reportList.length === 0) {
            f.errorMsg = "* 请上传整改报告";
            return;
          }
          if (f.imageList.length === 0) {
            f.errorMsg = "* 请上传整改图片";
            return;
          }

          let data = {
            id: this.noticeId,
            wrapup: f.reportList.map(item => item.url).join(","),
            evinAction: f.imageList.map(item => item.url).join(",")
          };

          doAction(this.progressState, data)
            .then(res => {
              showSuccess.call(this);
            })
            .then(() => {
              // TODO:
              // 关闭页面
              closePage.call(this);
            })
            .catch(err => {
              showError.call(this, err.message);
            });
        },

        /**
         * 不予验收
         * @action
         */
        rejectAccpet(options) {
          this.show.rejectAccpet = true;
        },

        /**
         * 同意验收
         */
        agreeAccept(options) {
          let data = {
            rtfOver: 1,
            id: this.noticeId
          };

          debugger;

          doAction(this.progressState, data)
            .then(res => {
              debugger;
              showSuccess.call(this);
              this.$emit("refresh");
              closePage.call(this);
            })
            .catch(err => {
              showError.call(this, err.message);
            });
        },

        cancel() {
          closePage.call(this);
        },

        /**
         * 提交操作
         */
        submit() {
          let progressState = this.progressState;
          if (progressState === 3) {
            let list = this.uploadList.rectificationReceiptList;
            if (list.length === 0) {
              this.rectificationPaperError = "* 请上传签收回执单";
              return;
            }
            this.rectificationPaperError = "";
            let data = {
              id: this.noticeId,
              notice: list[0].url
            };
            doAction(progressState, data)
              .then(res => {
                showSuccess.call(this);
                this.$emit("refresh");
                closePage.call(this);
              })
              .catch(err => {
                showError.call(this, err.message);
              });
            return;
          }

          // 整改
          if (progressState === 6) {
            this.actionHandler("rectification");
          }
        }
      };

      // 动作策略
      let actionStrategy = actionStrategies && actionStrategies[action];
      actionStrategy && actionStrategy.call(this, options);
    }
  },

  created() {
    // 通知ID
    let { id: noticeId, progressState, from } = this.$route.query;
    this.noticeId = noticeId;
    this.progressState = +progressState || 1;
    this.from = from || "";
    this.updateNotificationDetailAsync({ noticeId }).then(response => {
      let hasHandled = response.data.preNode !== this.progressState;
      console.log(response.data.preNode, this.progressState, progressState);
      if (hasHandled) {
        Dialog.alert({
          message: "当前消息已经处理过"
        }).then(() => {
          closePage.call(this);
        });
      }
    });

    this.debounceActionHandler = debounce(this.actionHandler, 250);

    /**
     * 流程状态处理策略
     */
    let flowStateProcessingStrategies = {
      /**
       * 设置流程处理策略
       * @param {Number} strategyName 策略名称
       * @param {Function} func 策略方法
       * @return undefined
       */
      setStrategy(strategyName, func) {
        this[strategyName] = func;
      },

      /**
       * 获取流程处理策略
       * @param {Number} strategyName 策略名称
       * @return function
       */
      getStrategy(strategyName) {
        return this[strategyName];
      }
    };

    // 签发整改告知书
    flowStateProcessingStrategies.setStrategy(2, function() {
      this.show.rectificationRequirement = true;
    });

    // 签收整改告知书
    flowStateProcessingStrategies.setStrategy(3, function() {
      this.show.rectificationPaper = true;
    });

    // 承运商申诉
    flowStateProcessingStrategies.setStrategy(4, function() {
      this.show.carrierRectification = true;
    });

    // 5. 执行岗处理申诉
    flowStateProcessingStrategies.setStrategy(5, function() {
      this.show.appealResult = true;
    });

    // 执行岗处理申诉
    flowStateProcessingStrategies.setStrategy(6, function() {
      this.show.carrierRectification = true;
    });

    // 整改日志
    flowStateProcessingStrategies.setStrategy(7, function() {
      this.show.rectificationLog = true;
    });

    let func = flowStateProcessingStrategies.getStrategy(this.progressState);

    // 执行流程处理策略
    func && func.call(this);
  }
};
</script>

<style lang="scss" scoped>
.pyzl-drawer {
  background: #f7f7f7;
  padding-bottom: 100px;

  &__footer {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 5px 15px;
    box-sizing: border-box;
    transition: transform 0.25s ease-in-out;
    z-index: 2;
  }
}

.card-section {
  .car--no {
    margin-bottom: 0.625rem;
    font-size: 1.5rem;
    font-weight: 500;
  }
}

.footer--action {
  & ~ & {
    margin-left: 50px;
  }
}

.is--error {
  color: red;
}
</style>
