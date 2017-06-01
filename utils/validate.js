module.exports = {
    /**
     * 验证必填元素
     */
    required(value) {
        if (typeof value === 'number') {
            value = value.toString()
        } else if (typeof value === 'boolean') {
            return !0
        }
        return (value && value != null) 
    },
    /**
     * 验证两个输入框的内容是否相同
     */
    equalTo(value, param) {
        return this.required(value) || value === param
    },
    /**
     * 验证最小长度
     */
    minlength(value, param) {
        return this.required(value) && value.length >= param
    },
    /**
     * 验证最大长度
     */
    maxlength(value, param) {
        return this.required(value) && value.length <= param
    },





}