import '@/styles/globals.css'
import Layout from './component/Layout'

export default function App({ Component, pageProps }) {

  //ส่วนที่ถ้า log in ตรงปุ่ม log in จะกลายเป็น ไอคอนโปรไฟล์
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  )
}


