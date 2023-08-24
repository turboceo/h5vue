import { mapActions } from "vuex";

let isDev = process.env.NODE_ENV === 'development'

let CheckListMixin = {
    methods: {
        ...mapActions({
            updateCheckListAsync: 'checklist/updateCheckListAsync'
        }),
    },

    created() {
        this.updateCheckListAsync({
            q: 'test'
        }).then(res => {
            // TODO:
            // - Remove
            // if (isDev) {
            //     this.listMode = true
            // }
        })
    }
}

export default CheckListMixin