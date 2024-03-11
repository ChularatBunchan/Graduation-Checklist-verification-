// import React, { useState } from 'react';

// const Upload = () => {
//   const [file, setFile] = useState(null);

//   const handleFileChange = (e) => {
//     const selectedFile = e.target.files[0];
//     setFile(selectedFile);
//   };

//   const handleUpload = () => {
//     // เรียกใช้ API หรือการจัดการไฟล์ต่อไปที่ต้องการ
//     console.log('Upload file:', file);
//     // ตัวอย่างการใช้ Fetch API สำหรับการอัปโหลดไฟล์
//     // ในแบบสมมติว่ามี API endpoint สำหรับการอัปโหลดไฟล์ที่ชื่อว่า /upload
//     // fetch('/upload', {
//     //   method: 'POST',
//     //   body: file,
//     // })
//     // .then(response => {
//     //   // ตรวจสอบสถานะการตอบกลับ
//     //   if (response.ok) {
//     //     console.log('File uploaded successfully.');
//     //   } else {
//     //     console.error('File upload failed.');
//     //   }
//     // })
//     // .catch(error => console.error('Error uploading file:', error));
//   };

//   return (
//     <div>
//       <h1>Upload Document</h1>
//       <input type="file" onChange={handleFileChange} />
//       <button onClick={handleUpload}>Upload</button>
//     </div>
//   );
// };

// export default Upload;

import React, { useState } from 'react';
import axios from 'axios';

const Upload = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      console.error('No file selected.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await axios.post('http://localhost:4000/files', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        console.log('File uploaded successfully.');
        // Handle success
      } else {
        console.error('File upload failed.');
        // Handle error
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      // Handle error
    }
  };

  return (
    <div>
      <h1>Upload Document</h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
};

export default Upload;


