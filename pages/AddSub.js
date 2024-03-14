import styles from '@/styles/Off.module.css';
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

const AddSub = () => {
    const router = useRouter();
    
    // State for form data
    const [formData, setFormData] = useState({
        en_code: '',
        en_name: '',
        en_year: '',
        en_semester: '',
        en_note: ''
    });

    // Handle form input changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:4000/english_subject', formData);
            console.log('Subject added:', response.data);
            alert("Subject added successfully!");
            // Reset form after successful submission
            setFormData({
                en_code: '',
                en_name: '',
                en_year: '',
                en_semester: '',
                en_note: ''
            });
        } catch (error) {
            console.error('Error adding subject:', error);
            alert("Failed to add subject. Please try again later.");
        }
    };

    return (
        <center className={styles.Basic}>
            <form onSubmit={handleSubmit}>
                <span onClick={() => router.push('/component/Hello')}>
                    <i className="fa-solid fa-circle-chevron-left"></i>
                </span><br></br>
                <div style={{ display: "flex" }}>
                    <h1>เพิ่มรายวิชา ภาษาอังกฤษ</h1><br />
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>วิชา</th>
                            <th>ปีการศึกษา</th>
                            <th>ภาคเรียนที่</th>
                            <th>หมายเหตุ</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><input id='en_code' value={formData.en_code + formData.en_name} onChange={handleChange} required /></td>
                            <td><input id='en_year' value={formData.en_year} onChange={handleChange} required /></td>
                            <td><input id='en_semester' value={formData.en_semester} onChange={handleChange} required /></td>
                            <td><input id='en_note' value={formData.en_note} onChange={handleChange} required /></td>
                        </tr>
                    </tbody>
                </table><br />
                <button type='submit'>Add</button>
            </form>
        </center>
    );
};

export default AddSub;