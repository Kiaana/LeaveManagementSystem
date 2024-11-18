import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

const EditLeave = () => {
  const router = useRouter();
  const { id } = router.query;
  const [formData, setFormData] = useState({
    name: '',
    leave_type: '',
    destination: '',
    approver: '',
    start_time: '',
    expected_return_time: '',
  });

  useEffect(() => {
    if (id) {
      fetchLeave();
    }
  }, [id]);

  const fetchLeave = async () => {
    try {
      const res = await axios.get(`http://127.0.0.1:5000/api/leave_requests/${id}`);
      const data = res.data;
      setFormData({
        name: data.name,
        leave_type: data.leave_type,
        destination: data.destination,
        approver: data.approver,
        start_time: data.start_time,
        expected_return_time: data.expected_return_time,
      });
    } catch (error) {
      console.error('Error fetching leave request:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://127.0.0.1:5000/api/leave_requests/${id}`, formData);
      alert('请假信息更新成功');
      router.push('/overview');
    } catch (error) {
      console.error('Error updating leave request:', error);
      alert('更新失败，请重试');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">编辑请假信息</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">姓名</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border rounded p-2"
            readOnly
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
            更新
          </button>
          <button
            type="button"
            className="bg-gray-500 text-white px-4 py-2 rounded"
            onClick={() => router.back()}
          >
            取消
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditLeave;