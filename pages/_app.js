import '@/styles/globals.css'
import Layout from './component/Layout'
// import mongoose from 'mongoose';


export default function App({ Component, pageProps }) {

  // async function connectDB() {
  //   try {
  //     await mongoose.connect(process.env.MONGODB_URI, {
  //       useNewUrlParser: true,
  //       useUnifiedTopology: true,
  //     });
  //     console.log('Connected to MongoDB');
  //   } catch (err) {
  //     console.error(err.message);
  //     process.exit(1);
  //   }
  // }

  // connectDB();

  //ส่วนที่ถ้า log in ตรงปุ่ม log in จะกลายเป็น ไอคอนโปรไฟล์
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  )
}


