import _Quill from 'quill'
// @ts-ignore
import v3Quill from './index.vue'

const Quill = (window as any).Quill || _Quill
const install = (Vue:any) => {
  Vue.component(v3Quill.name, v3Quill)
}

const VueQuillEditor = { Quill, v3Quill, install }

export default VueQuillEditor
export { Quill, v3Quill, install }
