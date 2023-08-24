const DebounceMixin = {
    created() {
        if (!this.actionHandler) {
            console.warn('Please implement @actionHandler method')
            return
        }
        this.debounceActionHandler = this.$debounce(this.actionHandler, 250);
    }
}

export default DebounceMixin