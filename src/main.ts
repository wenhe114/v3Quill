import _Quill from 'quill'
// @ts-ignore
import vue3QuillEdit from './index.vue'

const Quill = (window as any).Quill || _Quill
const install = (Vue:any) => {
  Vue.component(vue3QuillEdit.name, vue3QuillEdit)
}

const VueQuillEditor = { Quill, vue3QuillEdit, install }

export default VueQuillEditor
export { Quill, vue3QuillEdit, install }
