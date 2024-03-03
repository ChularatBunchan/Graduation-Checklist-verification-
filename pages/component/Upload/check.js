import { useState } from 'react';

export default function UploadFile() {
    const [file, setFile] = useState(null);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleUpload = () => {
        // ทำการอัพโหลดไฟล์ file ไปยังเซิร์ฟเวอร์ Next.js หรือบันทึกไว้ในระบบ
    };

    return (
        <form encType="multipart/form-data">
            <input type="file" name="file" accept=".pdf" multiple />
            <button type="submit">Upload</button>
        </form>

    );
}
