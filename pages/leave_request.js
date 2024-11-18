import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

const LeaveRequest = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    leave_type: '',
    destination: '',
    approver: '',
    start_time: '',
    expected_return_time: '',
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
      await axios.post('http://127.0.0.1:5000/api/leave_requests', formData);
      alert('请假申请提交成功');
      router.push('/');
    } catch (error) {
      console.error('Error submitting leave request:', error);
      alert('提交失败，请重试');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">请假申请</h1>
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
          <label className="block mb-1">请假事由</label>
          <input
            type="text"
            name="leave_type"
            value={formData.leave_type}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          />
        </div>
        <div>
          <label className="block mb-1">请假去向</label>
          <input
            type="text"
            name="destination"
            value={formData.destination}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          />
        </div>
        <div>
          <label className="block mb-1">批假人</label>
          <input
            type="text"
            name="approver"
            value={formData.approver}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          />
        </div>
        <div>
          <label className="block mb-1">出发时间</label>
          <input
            type="datetime-local"
            name="start_time"
            value={formData.start_time}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          />
        </div>
        <div>
          <label className="block mb-1">请假预计返回时间</label>
          <input
            type="datetime-local"
            name="expected_return_time"
            value={formData.expected_return_time}
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
                leave_type: '',
                destination: '',
                approver: '',
                start_time: '',
                expected_return_time: '',
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

export default LeaveRequest;