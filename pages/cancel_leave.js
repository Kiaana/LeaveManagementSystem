import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

const CancelLeave = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    cancellation_method: '',
    actual_return_time: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://127.0.0.1:5000/api/cancel_leave', formData);
      alert('销假申请提交成功');
      router.push('/');
    } catch (error) {
      console.error('Error submitting cancellation:', error);
      alert('提交失败，请重试');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">销假申请</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">姓名</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          />
        </div>
        <div>
          <label className="block mb-1">销假方式</label>
          <input
            type="text"
            name="cancellation_method"
            value={formData.cancellation_method}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          />
        </div>
        <div>
          <label className="block mb-1">实际返回时间</label>
          <input
            type="datetime-local"
            name="actual_return_time"
            value={formData.actual_return_time}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          />
        </div>
        <div className="flex space-x-4">
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            提交
          </button>
          <button
            type="reset"
            className="bg-gray-500 text-white px-4 py-2 rounded"
            onClick={() =>
              setFormData({
                name: '',
                cancellation_method: '',
                actual_return_time: '',
              })
            }
          >
            重置
          </button>
        </div>
      </form>
    </div>
  );
};

export default CancelLeave;