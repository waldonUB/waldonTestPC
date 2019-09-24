routerComponents.TempCustomerEdit = {
  template: `
  <div class="edit-box">
    <content-header>
      <template #headerLeft>
        <span @click="goBackList">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-icon-2"></use>
          </svg>
          <i class="inner-font">客户列表</i>
        </span>
        <span>客户录入</span>
      </template>
    </content-header>
    <section class="edit-body">
      <div class="base-info">
        <div class="info-title">
          <span>基本信息</span>
        </div>
        <div class="info-form">
          <div class="info-row">
            <div class="info-item">
               <div class="item-label">
                 <span class="label-must">*</span>
                 <span>联系人</span>
               </div>
               <div class="input-group">
                 <input v-model="editForm.contacts" type="text" class="form-input" placeholder="请输入联系人">
               </div>
            </div>
            <div class="info-item info-item-last">
               <div class="item-label">
                 <span class="label-must">*</span>
                 <span>客户来源</span>
               </div>
               <div class="input-group">
                  <yx-select
                    :selectedLabel="selectedLabel"
                    select-width="350px"
                    select-height="40px"
                    ref="sourceSelect">
                    <li v-for="item of sourceList"
                      :key="item.code"
                      @mousedown="changeSourceSelect(item)">
                      {{item.label}}
                    </li>
                 </yx-select>
               </div>
            </div>
          </div>
          <div class="info-row row-after">
            <div class="info-item">
               <div class="item-label">
                 <span class="label-must">*</span>
                 <span>联系手机</span>
               </div>
               <div class="input-group">
                 <input v-model="editForm.mobile" type="text" class="form-input" placeholder="请输入联系手机">
               </div>
            </div>
            <div class="info-item info-item-last">
               <div class="item-label">
                 <span class="label-must">*</span>
                 <span>联系QQ</span>
               </div>
               <div class="input-group">
                 <input v-model="editForm.qq" type="text" class="form-input" placeholder="请输入联系QQ">
               </div>
            </div>
          </div>
        </div>
      </div>
      <div class="detail-info">
        <div class="info-title">
          <span>详细信息</span>
        </div>
        <div class="info-form">
          <div class="info-row">
            <div class="info-item">
               <div class="item-label">
                 <span>所在省份</span>
               </div>
               <div class="input-group">
                 <input v-model="editForm.province" type="text" class="form-input" placeholder="所在省份">
               </div>
            </div>
            <div class="info-item info-item-last">
               <div class="item-label">
                 <span>所在城市</span>
               </div>
               <div class="input-group">
                 <input v-model="editForm.city" type="text" class="form-input" placeholder="所在城市">
               </div>
            </div>
          </div>
          <div class="info-row row-after">
            <div class="info-item">
               <div class="item-label">
                 <span>详细地址</span>
               </div>
               <div class="input-group">
                 <input v-model="editForm.address" type="text" class="form-input" placeholder="请输入详细地址">
               </div>
            </div>
            <div class="info-item info-item-last">
               <div class="item-label">
                 <span>证件号码</span>
               </div>
               <div class="input-group">
                 <input v-model="editForm.idCard" type="text" class="form-input" placeholder="请输入证件号码">
               </div>
            </div>
          </div>
          <div class="info-row row-after row-area">
            <div class="info-item info-item-area">
               <div class="item-label">
                 <span>备注</span>
               </div>
               <div class="input-group">
                 <textarea v-model="editForm.remark" class="form-textarea" placeholder="请输入备注"></textarea>
               </div>
            </div>
          </div>
        </div>
      </div>
      <div class="sale-info">
        <div class="info-title">
          <span>销售信息</span>
        </div>
        <div class="info-form">
          <div class="info-row">
            <div class="info-item">
               <div class="item-label">
                 <span class="label-must">*</span>
                 <span>业务员</span>
               </div>
               <div class="input-group">
                 <yx-select
                    top
                    :selectedLabel="sLabel"
                    select-width="350px"
                    select-height="40px"
                    ref="sSelect">
                    <li @mousedown="changeSSelect">无</li>
                 </yx-select>
               </div>
            </div>
            <div class="info-item info-item-last">
               <div class="item-label">
                 <span>客户标签</span>
               </div>
               <div class="input-group">
                 <yx-select
                    :top="true"
                    :selectedLabel="tagLabel"
                    select-width="350px"
                    select-height="40px"
                    ref="tagSelect">
                    <li v-for="item of tagList"
                      :key="item.code"
                      @mousedown="changeTagSelect(item)">
                      {{item.label}}
                    </li>
                 </yx-select>
               </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="edit-bottom">
      <yx-btn type="success" v-if="!editForm.cid" @click.native="addTsClient" class="edit-btn">添加</yx-btn>
      <div class="btn-group" v-else>
        <yx-btn type="success" @click.native="setTsClient" class="edit-btn">保存</yx-btn>
        <yx-btn @click.native="delTsClient" class="edit-trash">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-icon-10"></use>
          </svg>
          <span>删除</span>
        </yx-btn>
      </div>
    </section>
    <yx-alert type="error" :is-show.sync="isShow">{{showMsg}}</yx-alert>
  </div>`,
  props: ['isEdit'],
  data () {
    return {
      editForm: {
        cid: '',
        contacts: '', // 联系人名称
        mobile: '',
        qq: '',
        source: '',
        province: '',
        city: '',
        address: '',
        idCard: '',
        sid: '',
        labelId: '',
        remark: '',
        salesRelTime: ''
      },
      sourceList: [], // 客户来源列表
      tagList: [],
      selectedLabel: '',
      isShow: false,
      showMsg: '',
      sLabel: '', // 业务员
      tagLabel: '', // 客户标签
    }
  },
  methods: {
    /**
     * 返回List页面
     * */
    goBackList () {
      this.editForm = {
        cid: '',
        contacts: '', // 联系人名称
        mobile: '',
        qq: '',
        source: '',
        province: '',
        city: '',
        address: '',
        idCard: '',
        sid: '',
        labelId: '',
        remark: '',
        salesRelTime: ''
      }
      this.selectedLabel = '', // 客户来源
      this.sLabel = '', // 业务员
      this.tagLabel = '', // 客户标签
      this.$emit('update:isEdit', false)
    },
    /**
     * 根据id查询客户信息
     */
    async getTsClient (id) {
      const params = {
        cid: id
      }
      const res = await this.$yxPost('/client/tsClient_h.jsp?cmd=getTsClient', params)
      if (res.data && res.data.success) {
        const row = res.data.data
        this.editForm = {
          cid: row.id,
          contacts: row.contacts,
          mobile: row.mobile,
          qq: row.qq,
          source: row.source,
          province: row.province,
          city: row.city,
          address: row.address,
          idCard: row.idCard,
          sid: row.sid,
          labelId: row.labelId,
          remark: row.remark,
          salesRelTime: row.salesRelTime
        }
        const selectedLabel = this.sourceList.find(item => item.code === row.source)
        if (selectedLabel) {
          this.selectedLabel = selectedLabel.label
        }
      } else {
        this.isShow = true
        this.showMsg = res.data.msg
      }
    },
    /**
     * 添加客户
     */
    async addTsClient () {
      const res = await this.$yxPost('/client/tsClient_h.jsp?cmd=addTsClient', this.editForm)
      if (res.data && res.data.success) {
        this.goBackList()
        this.$emit('editSuccess') // 创建成功的回调
      } else {
        this.isShow = true
        this.showMsg = res.data.msg
      }
    },
    /**
     * 修改客户信息
     */
    async setTsClient () {
      const res = await this.$yxPost('/client/tsClient_h.jsp?cmd=setTsClient', this.editForm)
      if (res.data && res.data.success) {
        this.goBackList()
        this.$emit('editSuccess') // 创建成功的回调
      } else {
        this.isShow = true
        this.showMsg = res.data.msg
      }
    },
    /**
     * 删除客户
     */
    async delTsClient () {
      const params = {
        cid: this.editForm.cid
      }
      const res = await this.$yxPost('/client/tsClient_h.jsp?cmd=delTsClient', params)
      if (res.data && res.data.success) {
        this.goBackList()
        this.$emit('editSuccess') // 创建成功的回调
      } else {
        this.isShow = true
        this.showMsg = res.data.msg
      }
    },
    /**
     * 获取客户来源列表
     * 接口名称的拼写暂时不理
     */
    async getTsCleintDef () {
      const res = await this.$yxPost('/client/tsClient_h.jsp?cmd=getTsCleintDef')
      if (res.data && res.data.success) {
        this.sourceList = res.data.data.source.map(item => {
          return {
            code: item.key,
            label: item.value
          }
        })
      } else {
        this.isShow = true
        this.showMsg = res.data.msg
      }
    },
    /**
     * 获取标签列表
     */
    async getTagList () {
      let params = {
        sid: -1
      }
      const res = await this.$yxPost('/client/tsClientLabel_h.jsp?cmd=getTsClientLabelList', params)
      if (res.data && res.data.success) {
        this.tagList = res.data.data.map(item => {
          return {
            code: item.id,
            label: item.name
          }
        })
      }
    },
    /**
     * 选择客户来源
     */
    changeSourceSelect (item) {
      this.selectedLabel = item.label
      this.editForm.source = item.code
      this.$refs.sourceSelect.closeOptions()
    },
    changeSSelect () {
      // 账号无业务员id
      this.sLabel = '无'
      this.editForm.sid = 0
      this.$refs.sSelect.closeOptions()
    },
    /**
     * 选择客户标签
     */
    changeTagSelect (item) {
      this.tagLabel = item.label
      this.editForm.labelId = item.code
      this.$refs.tagSelect.closeOptions()
    }
  },
  created () {
    this.getTsCleintDef()
    this.getTagList()
  }
}
