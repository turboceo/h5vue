import { mapActions } from 'vuex'

let CheckListMixin = {
  methods: {
    ...mapActions({
      updateCheckListAsync: 'checklist/updateCheckListAsync'
    })
  },

  created () {
    let payload = this.$route.query
    this.updateCheckListAsync(payload).then(res => {
    })
  }
}

export default CheckListMixin
